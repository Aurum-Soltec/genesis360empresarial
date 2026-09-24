import fs from "node:fs";
import path from "node:path";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA = /^[0-9a-f]{40}$/i;

export function validateFixture(input) {
  if (!input || input.synthetic !== true || !Array.isArray(input.users) || input.users.length !== 10) {
    throw new Error("Fixture must explicitly identify ten synthetic users");
  }
  const emails = new Set();
  const tenantIds = new Set();
  const companyIds = new Set();
  const users = input.users.map((user) => {
    if (typeof user.email !== "string" || !user.email.includes("@") ||
        typeof user.password !== "string" || !user.password ||
        !Array.isArray(user.tenants) || user.tenants.length !== 10) {
      throw new Error("Each synthetic user needs credentials and ten tenant/company pairs");
    }
    const email = user.email.toLowerCase();
    if (emails.has(email)) throw new Error("Fixture has a duplicate user");
    emails.add(email);
    const tenants = user.tenants.map((item) => {
      if (!UUID.test(item?.tenantId) || !UUID.test(item?.companyId) ||
          tenantIds.has(item.tenantId.toLowerCase()) || companyIds.has(item.companyId.toLowerCase())) {
        throw new Error("Fixture needs 100 distinct valid tenant/company pairs");
      }
      tenantIds.add(item.tenantId.toLowerCase());
      companyIds.add(item.companyId.toLowerCase());
      return { tenantId: item.tenantId.toLowerCase(), companyId: item.companyId.toLowerCase() };
    });
    return { email: user.email, password: user.password, tenants };
  });
  if (tenantIds.size !== 100 || companyIds.size !== 100) throw new Error("Fixture needs 100 unique tenants and companies");
  return users;
}

export function validateRunConfig(env, repoRoot = process.cwd()) {
  const fixturePath = env.HSP3_FIXTURE_FILE;
  if (!fixturePath || !path.isAbsolute(fixturePath)) {
    throw new Error("HSP3_FIXTURE_FILE must be an absolute path outside the repository");
  }
  const resolved = path.resolve(fixturePath);
  const relative = path.relative(path.resolve(repoRoot), resolved);
  if (!relative.startsWith("..") && !path.isAbsolute(relative)) {
    throw new Error("Credential fixture must remain outside the repository");
  }
  let base;
  try { base = new URL(env.HSP3_STAGING_URL ?? ""); }
  catch { throw new Error("HSP3_STAGING_URL must be a valid HTTPS origin"); }
  if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash || base.pathname !== "/") {
    throw new Error("HSP3_STAGING_URL must be an HTTPS origin without credentials or path");
  }
  if (env.HSP3_TARGET_HOST_ACK !== base.host || env.HSP3_ISOLATED_STAGING_ACK !== "yes") {
    throw new Error("Explicit isolated staging and exact host acknowledgement required");
  }
  if (!SHA.test(env.HSP3_DEPLOY_SHA ?? "") ||
      !/^[A-Za-z0-9_.:-]{3,128}$/.test(env.HSP3_DEPLOY_ID ?? "")) {
    throw new Error("Exact deployed SHA and deployment ID required");
  }
  const durationSeconds = Number(env.HSP3_DURATION_SECONDS ?? 3600);
  const cycleMs = Number(env.HSP3_CYCLE_MS ?? 6000);
  const maxRequests = Number(env.HSP3_MAX_REQUESTS ?? 30000);
  const maxWrites = Number(env.HSP3_MAX_WRITES ?? 6500);
  if (!Number.isInteger(durationSeconds) || durationSeconds < 10 || durationSeconds > 3600 ||
      !Number.isInteger(cycleMs) || cycleMs < 1000 || cycleMs > 60000 ||
      !Number.isInteger(maxRequests) || maxRequests < 100 || maxRequests > 100000 ||
      !Number.isInteger(maxWrites) || maxWrites < 1 || maxWrites > 10000) {
    throw new Error("Duration, pacing and workload caps are outside safe bounds");
  }
  return {
    baseUrl: base.origin, fixturePath: resolved, durationSeconds, cycleMs,
    maxRequests, maxWrites, deploySha: env.HSP3_DEPLOY_SHA.toLowerCase(),
    deployId: env.HSP3_DEPLOY_ID.trim(),
  };
}

export function readFixture(config) {
  let input;
  try { input = JSON.parse(fs.readFileSync(config.fixturePath, "utf8")); }
  catch { throw new Error("Credential fixture is unreadable or invalid JSON"); }
  return validateFixture(input);
}

// A login failure report must never contain request URLs, response bodies,
// browser exception text, or the synthetic user's identity.
export function classifyLoginFailure({ phase, authHttpStatus = null, authNetworkFailure = false }) {
  if (Number.isInteger(authHttpStatus) && authHttpStatus >= 400 && authHttpStatus <= 599) {
    return `AUTH_HTTP_${authHttpStatus}`;
  }
  if (authNetworkFailure) return "AUTH_NETWORK_FAILURE";
  if (phase === "navigate") return "LOGIN_NAVIGATION_FAILED";
  if (phase === "ready") return "LOGIN_HYDRATION_TIMEOUT";
  if (phase === "fill") return "LOGIN_FORM_FAILED";
  if (phase === "submit" && authHttpStatus === null) return "LOGIN_SUBMIT_FAILED";
  if (authHttpStatus === null) return "LOGIN_NO_AUTH_RESPONSE";
  return "LOGIN_ROUTE_TIMEOUT";
}

export function percentile(values, rank) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return Math.round(sorted[Math.ceil(rank * sorted.length) - 1] * 100) / 100;
}

// Only these numeric durations may leave a Server-Timing header for the
// sanitized HSP-3 report. Ignore descriptions and unrecognized metrics.
export function parsePassportServerTiming(header) {
  const result = { tenantContextMs: null, dataAccessMs: null };
  if (typeof header !== "string") return result;
  for (const metric of header.split(",")) {
    const match = /^\s*(tenant_context|data_access);dur=(\d+(?:\.\d+)?)\s*$/i.exec(metric);
    if (!match) continue;
    const duration = Number(match[2]);
    if (!Number.isFinite(duration) || duration > 300000) continue;
    const key = match[1].toLowerCase() === "tenant_context" ? "tenantContextMs" : "dataAccessMs";
    if (result[key] === null) result[key] = duration;
  }
  return result;
}

export function summarizeSamples(samples) {
  return Object.fromEntries(Object.entries(samples).map(([operation, values]) => [operation, {
    samples: values.length, p50Ms: percentile(values, 0.5),
    p95Ms: percentile(values, 0.95), p99Ms: percentile(values, 0.99),
    maxMs: values.length ? Math.round(Math.max(...values) * 100) / 100 : null,
    under750Ms: values.length > 0 && percentile(values, 0.95) <= 750,
  }]));
}

export function evaluateGate(report, observations) {
  const reasons = [];
  if (report.durationSeconds < 3600) reasons.push("soak_shorter_than_60_minutes");
  if (report.tenantsVisited !== 100 || report.authenticatedUsers !== 10) reasons.push("coverage_incomplete");
  if (report.expectedCrossTenantDenials < 100) reasons.push("isolation_sample_incomplete");
  if (report.requests < 15000 || report.factWrites < 5000) reasons.push("workload_below_60_minute_reference_volume");
  if (report.failures.length || report.unexpectedErrors) reasons.push("runtime_failures");
  for (const [operation, stats] of Object.entries(report.operations)) {
    if (!stats.under750Ms) reasons.push(`p95_${operation}_above_750ms_or_missing`);
  }
  if (!observations || observations.deploySha !== report.deploySha || observations.deployId !== report.deployId ||
      observations.runId !== report.runId) {
    reasons.push("same_artifact_operational_observations_missing");
  } else {
    for (const field of ["matchedFactEvents", "processedFactEvents", "deadFactEvents"]) {
      if (!Number.isInteger(observations[field]) || observations[field] < 0) reasons.push(`${field}_missing`);
    }
    if (observations.matchedFactEvents < report.factWrites ||
        observations.processedFactEvents < report.factWrites ||
        observations.factRowsMatched < report.factWrites ||
        observations.deadFactEvents !== 0 || observations.pendingFactEvents !== 0) reasons.push("outbox_worker_incomplete");
    for (const field of ["workerLatencyP95Ms", "workerRetries", "poolConnectionsPeak", "cpuPercentPeak",
      "memoryPercentPeak", "slowQueries", "costUsd", "errorRatePercent", "observedMinutes",
      "databaseConnectionsPeak", "poolUtilizationPeakPercent", "quotaDenied", "saturationEvents"]) {
      if (!Number.isFinite(observations[field]) || observations[field] < 0) reasons.push(`${field}_missing`);
    }
    for (const field of ["workerObservationRef", "databaseObservationRef", "hostingObservationRef"]) {
      if (typeof observations[field] !== "string" ||
          !/^[A-Za-z0-9._:/-]{1,200}$/.test(observations[field])) reasons.push(`${field}_missing_or_unsafe`);
    }
    if (observations.observedMinutes < 60) reasons.push("operational_window_shorter_than_60_minutes");
    if (observations.errorRatePercent > 0) reasons.push("provider_errors_present");
    if (observations.quotaDenied > 0 || observations.saturationEvents > 0) reasons.push("quota_or_saturation_events_present");
  }
  return { status: reasons.length ? "FAIL_OR_INCOMPLETE" : "PASS_CANDIDATE", reasons };
}
