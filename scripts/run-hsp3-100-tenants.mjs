// HSP-3 hosted workload. Credentials live only in HSP3_FIXTURE_FILE outside this repository.
// This runner never grants a production readiness gate by itself: operator telemetry
// must independently prove Postgres, outbox, continuous worker and saturation.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { chromium } from "playwright-core";
import { evaluateGate, readFixture, summarizeSamples, validateRunConfig } from "./hsp3-load-core.mjs";

const mode = process.argv[2] ?? "--check-fixture";
const repoRoot = path.resolve(import.meta.dirname, "..");
if (!["--check-fixture", "--run"].includes(mode)) {
  throw new Error("Use --check-fixture or --run");
}
const config = validateRunConfig(process.env, repoRoot);
const users = readFixture(config);
if (mode === "--check-fixture") {
  console.log(JSON.stringify({ readyToRun: true, syntheticUsers: users.length,
    uniqueTenants: users.reduce((n, user) => n + user.tenants.length, 0),
    targetHost: new URL(config.baseUrl).host, durationSeconds: config.durationSeconds,
    maxRequests: config.maxRequests, maxWrites: config.maxWrites,
    deploySha: config.deploySha, deployId: config.deployId }, null, 2));
  process.exit(0);
}

const executablePath = process.env.CHROME_PATH;
if (!executablePath || !fs.existsSync(executablePath)) {
  throw new Error("CHROME_PATH must point to the installed Chromium/Chrome executable");
}
const runId = crypto.randomBytes(6).toString("hex");
const outputFile = path.resolve(process.env.HSP3_OUTPUT_FILE ?? `test-results/hsp3-100-tenants-${runId}.json`);
const outputRelative = path.relative(repoRoot, outputFile);
if (outputRelative.startsWith("..") || path.isAbsolute(outputRelative)) {
  throw new Error("HSP3_OUTPUT_FILE must stay inside this repository");
}
const samples = { login: [], tenantSwitch: [], dashboard: [], factWrite: [], factRead: [], crossTenantDeny: [] };
const hops = { dashboard: [], tenantSwitch: [], factWrite: [], factRead: [], crossTenantDeny: [] };
const seenTenants = new Set();
const correlationSamples = [];
const failures = [];
let requests = 0;
let writes = 0;
let denials = 0;
let unexpectedErrors = 0;
let stop = false;
let startedAt = null;
let browser;
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stop = true;
    failures.push({ phase: "signal", code: "INTERRUPTED" });
  });
}

function safeFailureCode(error) {
  const code = error instanceof Error ? error.message : "";
  return /^(?:[A-Za-z]+_HTTP_[0-9]{3}|WORKLOAD_CAP_REACHED|SYNTHETIC_TENANT_ACCESS_MISMATCH|CROSS_TENANT_PREFLIGHT_FAILED|TENANT_SWITCH_WRONG_CONTEXT|DASHBOARD_REDIRECTED|FACT_COMMIT_ID_MISSING|FACT_READBACK_MISMATCH|CROSS_TENANT_DENIAL_UNEXPECTED|CROSS_TENANT_DATA_EXPOSURE|AUTH_REDIRECTED_OFF_STAGING_ORIGIN)$/.test(code)
    ? code : "BROWSER_OR_NETWORK_FAILURE";
}

function reserveRequest(isWrite = false) {
  if (stop || requests >= config.maxRequests || (isWrite && writes >= config.maxWrites)) {
    stop = true;
    throw new Error("WORKLOAD_CAP_REACHED");
  }
  requests += 1;
}

function observe(operation, result, expectedStatus, detail = "") {
  const allowed = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
  if (!allowed.includes(result.status)) {
    throw new Error(`${operation}_HTTP_${result.status}${detail}`);
  }
  samples[operation].push(result.durationMs);
  if (result.timing) hops[operation].push(result.timing);
  if (result.correlationId && correlationSamples.length < 100) {
    correlationSamples.push({ operation, id: result.correlationId });
  }
}

async function browserFetch(page, method, pathname, body, correlationId) {
  return page.evaluate(async ({ method, pathname, body, correlationId }) => {
    performance.clearResourceTimings();
    const start = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    let response;
    try {
      response = await fetch(pathname, {
        method, credentials: "same-origin", cache: "no-store", signal: controller.signal,
        headers: { "x-correlation-id": correlationId,
          ...(body === undefined ? {} : { "content-type": "application/json" }) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } finally {
      clearTimeout(timer);
    }
    const data = await response.json().catch(() => ({}));
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    const url = new URL(pathname, location.origin).href;
    const entry = performance.getEntriesByName(url, "resource").at(-1);
    return {
      status: response.status, data, durationMs,
      correlationId: response.headers.get("x-correlation-id"),
      serverTiming: response.headers.get("server-timing"),
      timing: entry ? {
        dnsMs: Math.max(0, entry.domainLookupEnd - entry.domainLookupStart),
        connectMs: Math.max(0, entry.connectEnd - entry.connectStart),
        tlsMs: entry.secureConnectionStart > 0 ? Math.max(0, entry.connectEnd - entry.secureConnectionStart) : 0,
        requestToFirstByteMs: Math.max(0, entry.responseStart - entry.requestStart),
        responseDownloadMs: Math.max(0, entry.responseEnd - entry.responseStart),
      } : null,
    };
  }, { method, pathname, body, correlationId });
}

async function call(page, operation, method, pathname, body, expectedStatus, correlationId, isWrite = false) {
  reserveRequest(isWrite);
  const result = await browserFetch(page, method, pathname, body, correlationId);
  observe(operation, result, expectedStatus);
  return result;
}

async function login(user, index) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  reserveRequest();
  await page.goto(`${config.baseUrl}/entrar`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  const start = performance.now();
  await Promise.all([
    page.waitForURL("**/selecionar-empresa", { timeout: 30000 }),
    page.getByRole("button", { name: "Entrar", exact: true }).click(),
  ]);
  if (new URL(page.url()).origin !== config.baseUrl) throw new Error("AUTH_REDIRECTED_OFF_STAGING_ORIGIN");
  samples.login.push(Math.round((performance.now() - start) * 100) / 100);
  const foreign = users[(index + 1) % users.length].tenants[0];
  return { context, page, user, foreign, index };
}

async function preflight(session) {
  for (const tenant of session.user.tenants) {
    reserveRequest();
    const result = await browserFetch(session.page, "POST", "/api/tenant/active", { tenantId: tenant.tenantId },
      `hsp3:${runId}:preflight`);
    if (result.status !== 200 || result.data.tenantId !== tenant.tenantId) {
      throw new Error("SYNTHETIC_TENANT_ACCESS_MISMATCH");
    }
  }
  reserveRequest();
  const foreign = await browserFetch(session.page, "POST", "/api/tenant/active",
    { tenantId: session.foreign.tenantId }, `hsp3:${runId}:preflight-deny`);
  if (foreign.status !== 403 || foreign.data.error !== "TENANT_ACCESS_DENIED") {
    throw new Error("CROSS_TENANT_PREFLIGHT_FAILED");
  }
}

async function cycle(session, cycleIndex) {
  const { page, user, foreign, index } = session;
  const tenant = user.tenants[cycleIndex % user.tenants.length];
  const marker = `hsp3:${runId}:${index}:${cycleIndex}`;
  const switchResult = await call(page, "tenantSwitch", "POST", "/api/tenant/active",
    { tenantId: tenant.tenantId }, 200, marker);
  if (switchResult.data.tenantId !== tenant.tenantId) throw new Error("TENANT_SWITCH_WRONG_CONTEXT");
  seenTenants.add(tenant.tenantId);

  reserveRequest();
  const dashboardStart = performance.now();
  const dashboardResponse = await page.goto(`${config.baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  const dashboardDurationMs = Math.round((performance.now() - dashboardStart) * 100) / 100;
  const navigation = await page.evaluate(() => {
    const item = performance.getEntriesByType("navigation").at(-1);
    return item ? {
      dnsMs: Math.max(0, item.domainLookupEnd - item.domainLookupStart),
      connectMs: Math.max(0, item.connectEnd - item.connectStart),
      tlsMs: item.secureConnectionStart > 0 ? Math.max(0, item.connectEnd - item.secureConnectionStart) : 0,
      requestToFirstByteMs: Math.max(0, item.responseStart - item.requestStart),
      responseDownloadMs: Math.max(0, item.responseEnd - item.responseStart),
    } : null;
  });
  observe("dashboard", { status: dashboardResponse?.status() ?? 0, durationMs: dashboardDurationMs,
    correlationId: dashboardResponse ? await dashboardResponse.headerValue("x-correlation-id") : null,
    timing: navigation }, 200);
  if (new URL(page.url()).pathname !== "/") throw new Error("DASHBOARD_REDIRECTED");

  const factKey = `hsp3_${runId}_${index}_${cycleIndex % user.tenants.length}`;
  const value = { synthetic: true, runId, sequence: cycleIndex };
  const written = await call(page, "factWrite", "POST", "/api/passport/facts", {
    companyId: tenant.companyId, factKey, value, source: "declared",
    sourceRef: `HSP3:${runId}`, sensitivity: "internal", purposeCodes: ["CORE_OPERATION"],
  }, 201, marker, true);
  if (!written.data.fact?.id) throw new Error("FACT_COMMIT_ID_MISSING");
  writes += 1;

  const facts = await call(page, "factRead", "GET",
    `/api/passport/facts?companyId=${tenant.companyId}`, undefined, 200, marker);
  const current = facts.data.facts?.find((fact) => fact.id === written.data.fact.id);
  if (!current || current.fact_key !== factKey || current.value?.runId !== runId ||
      current.value?.sequence !== cycleIndex) throw new Error("FACT_READBACK_MISMATCH");

  if (cycleIndex % 10 === 0) {
    const denied = await call(page, "crossTenantDeny", "POST", "/api/tenant/active",
      { tenantId: foreign.tenantId }, 403, marker);
    if (denied.data.error !== "TENANT_ACCESS_DENIED") throw new Error("CROSS_TENANT_DENIAL_UNEXPECTED");
    denials += 1;
    reserveRequest();
    const foreignRead = await browserFetch(page, "GET",
      `/api/passport/facts?companyId=${foreign.companyId}`, undefined, marker);
    if (foreignRead.status !== 200 || !Array.isArray(foreignRead.data.facts) || foreignRead.data.facts.length !== 0) {
      throw new Error("CROSS_TENANT_DATA_EXPOSURE");
    }
  }
}

const initial = new Date().toISOString();
try {
  browser = await chromium.launch({ executablePath, headless: true });
  const sessions = await Promise.all(users.map((user, index) => login(user, index)));
  await Promise.all(sessions.map(preflight));
  startedAt = new Date().toISOString();
  const deadline = Date.now() + config.durationSeconds * 1000;
  await Promise.all(sessions.map(async (session) => {
    for (let i = 0; !stop && Date.now() < deadline; i += 1) {
      const cycleStarted = Date.now();
      try {
        await cycle(session, i);
      } catch (error) {
        stop = true;
        unexpectedErrors += 1;
        failures.push({ userOrdinal: session.index, cycle: i,
          code: safeFailureCode(error) });
        break;
      }
      const waitMs = Math.min(config.cycleMs - (Date.now() - cycleStarted), deadline - Date.now());
      if (waitMs > 0 && !stop) await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }));
  await Promise.all(sessions.map((session) => session.context.close()));
} catch (error) {
  failures.push({ phase: startedAt ? "runtime" : "preflight",
    code: safeFailureCode(error) });
} finally {
  await browser?.close();
}

const endedAt = new Date().toISOString();
const report = {
  wave: "HSP-3", runId, startedAt: startedAt ?? initial, endedAt,
  durationSeconds: startedAt ? Math.floor((Date.parse(endedAt) - Date.parse(startedAt)) / 1000) : 0,
  deploySha: config.deploySha, deployId: config.deployId, targetHost: new URL(config.baseUrl).host,
  synthetic: true, configuredTenants: 100, tenantsVisited: seenTenants.size,
  authenticatedUsers: samples.login.length, requests, factWrites: writes,
  expectedCrossTenantDenials: denials, unexpectedErrors, failures,
  errorRatePercent: requests ? Math.round(unexpectedErrors / requests * 100000) / 1000 : null,
  operations: summarizeSamples(samples),
  clientHopTiming: Object.fromEntries(Object.entries(hops).map(([name, values]) => [name, {
    samples: values.length,
    p95DnsMs: summarizeSamples({ dns: values.map((item) => item.dnsMs) }).dns.p95Ms,
    p95ConnectMs: summarizeSamples({ connect: values.map((item) => item.connectMs) }).connect.p95Ms,
    p95TlsMs: summarizeSamples({ tls: values.map((item) => item.tlsMs) }).tls.p95Ms,
    p95RequestToFirstByteMs: summarizeSamples({ firstByte: values.map((item) => item.requestToFirstByteMs) }).firstByte.p95Ms,
    p95ResponseDownloadMs: summarizeSamples({ download: values.map((item) => item.responseDownloadMs) }).download.p95Ms,
  }])),
  correlationSamples, operatorObservations: null,
};
report.gate = evaluateGate(report, null);
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ outputFile, runId, durationSeconds: report.durationSeconds,
  tenantsVisited: report.tenantsVisited, requests, factWrites: writes,
  expectedCrossTenantDenials: denials, unexpectedErrors, gate: report.gate }, null, 2));
if (failures.length) process.exitCode = 1;
