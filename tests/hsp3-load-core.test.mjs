import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { classifyLoginFailure, evaluateGate, parsePassportServerTiming, percentile, summarizeSamples, validateFixture, validateRunConfig } from "../scripts/hsp3-load-core.mjs";
import { classifyBrowserFailure, shouldRecyclePage } from "../scripts/run-hsp3-100-tenants.mjs";

function fixture() {
  return { synthetic: true, users: Array.from({ length: 10 }, (_, user) => ({
    email: `load-${user}@genesis.test`, password: "dummy-not-a-secret",
    tenants: Array.from({ length: 10 }, () => ({ tenantId: crypto.randomUUID(), companyId: crypto.randomUUID() })),
  })) };
}

test("fixture requires 100 distinct synthetic tenants and credentials", () => {
  const valid = fixture();
  assert.equal(validateFixture(valid).length, 10);
  valid.users[0].tenants[0].tenantId = valid.users[0].tenants[0].tenantId.toUpperCase();
  assert.equal(validateFixture(valid)[0].tenants[0].tenantId, valid.users[0].tenants[0].tenantId.toLowerCase());
  valid.users[1].tenants[0].tenantId = valid.users[0].tenants[0].tenantId;
  assert.throws(() => validateFixture(valid), /distinct/);
  valid.users[1].tenants[0].tenantId = crypto.randomUUID();
  valid.synthetic = false;
  assert.throws(() => validateFixture(valid), /synthetic/);
});

test("run configuration refuses repo credentials, non-HTTPS and missing explicit staging acknowledgement", () => {
  const base = {
    HSP3_FIXTURE_FILE: "C:/fixtures/hsp3.json", HSP3_STAGING_URL: "https://staging.example.test/",
    HSP3_TARGET_HOST_ACK: "staging.example.test", HSP3_ISOLATED_STAGING_ACK: "yes",
    HSP3_DEPLOY_SHA: "a".repeat(40), HSP3_DEPLOY_ID: "deploy-123",
  };
  assert.equal(validateRunConfig(base, "C:/repo").durationSeconds, 3600);
  assert.throws(() => validateRunConfig({ ...base, HSP3_FIXTURE_FILE: "C:/repo/secrets.json" }, "C:/repo"), /outside/);
  assert.throws(() => validateRunConfig({ ...base, HSP3_STAGING_URL: "http://staging.example.test/" }, "C:/repo"), /HTTPS/);
  assert.throws(() => validateRunConfig({ ...base, HSP3_TARGET_HOST_ACK: "other.example.test" }, "C:/repo"), /acknowledgement/);
});

test("nearest-rank percentile and empty operation are explicit", () => {
  assert.equal(percentile([100, 300, 200, 500, 400], 0.95), 500);
  assert.equal(percentile([], 0.95), null);
  const data = summarizeSamples({ switch: [100, 200], read: [] });
  assert.equal(data.switch.p50Ms, 100);
  assert.equal(data.read.under750Ms, false);
});

test("passport timing report accepts only numeric whitelisted durations", () => {
  assert.deepEqual(parsePassportServerTiming("tenant_context;dur=12.34, data_access;dur=56.78"), {
    tenantContextMs: 12.34, dataAccessMs: 56.78,
  });
  assert.deepEqual(parsePassportServerTiming(
    'tenant_context;dur=12.34;desc="private", data_access;dur=56.78, trace;desc="secret"',
  ), { tenantContextMs: null, dataAccessMs: 56.78 });
  assert.deepEqual(parsePassportServerTiming("tenant_context;dur=-1, data_access;dur=Infinity"), {
    tenantContextMs: null, dataAccessMs: null,
  });
  assert.deepEqual(parsePassportServerTiming(null), { tenantContextMs: null, dataAccessMs: null });
});

test("login diagnostics distinguish hydration, provider and routing failures without identities", () => {
  assert.equal(classifyLoginFailure({ phase: "ready" }), "LOGIN_HYDRATION_TIMEOUT");
  assert.equal(classifyLoginFailure({ phase: "submit", authHttpStatus: 429 }), "AUTH_HTTP_429");
  assert.equal(classifyLoginFailure({ phase: "submit", authNetworkFailure: true }), "AUTH_NETWORK_FAILURE");
  assert.equal(classifyLoginFailure({ phase: "submit", authHttpStatus: 200 }), "LOGIN_ROUTE_TIMEOUT");
  assert.equal(classifyLoginFailure({ phase: "navigate" }), "LOGIN_NAVIGATION_FAILED");
});

test("runtime diagnostics separate browser, page, network and timeout without echoing exception text", () => {
  const privateUrl = "https://staging.example.test/api/passport/facts?token=SECRET_SHOULD_NOT_LEAK";
  const cases = [
    [new Error(`page.goto: net::ERR_CONNECTION_RESET at ${privateUrl}`), {}, "NETWORK_FAILURE"],
    [new Error(`page.evaluate: AbortError: request to ${privateUrl}`), {}, "BROWSER_OPERATION_TIMEOUT"],
    [Object.assign(new Error(`page.goto: Timeout 30000ms exceeded at ${privateUrl}`), { name: "TimeoutError" }), {}, "BROWSER_OPERATION_TIMEOUT"],
    [new Error(`Target page, context or browser has been closed at ${privateUrl}`), {}, "BROWSER_TARGET_CLOSED"],
    [new Error(privateUrl), { pageClosed: true, browserConnected: true }, "PAGE_CLOSED"],
    [new Error(privateUrl), { browserConnected: false }, "BROWSER_DISCONNECTED"],
    [new Error(privateUrl), { pageCrashed: true, browserConnected: false }, "PAGE_CRASHED"],
    [new Error(privateUrl), { networkFailure: true, browserConnected: true }, "NETWORK_FAILURE"],
    [new Error(privateUrl), {}, "BROWSER_OR_NETWORK_FAILURE"],
  ];
  for (const [error, state, expected] of cases) {
    const code = classifyBrowserFailure(error, state);
    assert.equal(code, expected);
    assert.doesNotMatch(code, /SECRET_SHOULD_NOT_LEAK|staging\.example\.test/);
  }
});

test("page recycling is staggered before cycle 160 and preserves every scheduled workload cycle", () => {
  const firstRecycles = Array.from({ length: 10 }, (_, userOrdinal) =>
    Array.from({ length: 80 }, (_, cycle) => cycle + 1)
      .find((cycle) => shouldRecyclePage(cycle, userOrdinal)));
  assert.deepEqual(firstRecycles, [80, 76, 72, 68, 64, 60, 56, 52, 48, 44]);
  assert.equal(new Set(firstRecycles).size, 10);
  for (let userOrdinal = 0; userOrdinal < 10; userOrdinal += 1) {
    for (let cycle = 1; cycle < 160; cycle += 1) {
      if (shouldRecyclePage(cycle, userOrdinal)) {
        assert.equal(shouldRecyclePage(cycle + 80, userOrdinal), true);
      }
    }
  }
  assert.equal(shouldRecyclePage(0, 0), false);
  assert.equal(shouldRecyclePage(80, 10), false);
});

test("runtime alone cannot pass; observations must match run and prove processed events", () => {
  const operations = Object.fromEntries(["login", "tenantSwitch", "dashboard", "factWrite", "factRead", "crossTenantDeny"]
    .map((name) => [name, { samples: 10, p95Ms: 500, under750Ms: true }]));
  const report = { runId: "abc123", deploySha: "a".repeat(40), deployId: "deployment",
    durationSeconds: 3600, tenantsVisited: 100, authenticatedUsers: 10,
    expectedCrossTenantDenials: 600, requests: 20000, factWrites: 6000,
    unexpectedErrors: 0, failures: [], operations };
  assert.match(evaluateGate(report, null).reasons.join(","), /observations_missing/);
  const observations = { runId: "abc123", deploySha: "a".repeat(40), deployId: "deployment",
    factRowsMatched: 6000, matchedFactEvents: 6000, processedFactEvents: 6000,
    deadFactEvents: 0, pendingFactEvents: 0, workerLatencyP95Ms: 20,
    workerRetries: 0, poolConnectionsPeak: 20, databaseConnectionsPeak: 20,
    poolUtilizationPeakPercent: 30, cpuPercentPeak: 40, memoryPercentPeak: 50,
    slowQueries: 0, quotaDenied: 0, saturationEvents: 0,
    costUsd: 0.02, errorRatePercent: 0, observedMinutes: 60,
    workerObservationRef: "ops/outbox-run.json", databaseObservationRef: "ops/database-run.json",
    hostingObservationRef: "ops/railway-run.json" };
  assert.equal(evaluateGate(report, observations).status, "PASS_CANDIDATE");
  observations.processedFactEvents = 5999;
  assert.match(evaluateGate(report, observations).reasons.join(","), /outbox_worker_incomplete/);
});

test("CLI fixture preflight prints no passwords or user identities", () => {
  const file = path.join(os.tmpdir(), `hsp3-fixture-${crypto.randomUUID()}.json`);
  try {
    fs.writeFileSync(file, JSON.stringify(fixture()));
    const result = spawnSync(process.execPath,
      [path.resolve("scripts/run-hsp3-100-tenants.mjs"), "--check-fixture"], {
        cwd: path.resolve("."), encoding: "utf8", env: {
          ...process.env, HSP3_FIXTURE_FILE: file,
          HSP3_STAGING_URL: "https://staging.example.test/",
          HSP3_TARGET_HOST_ACK: "staging.example.test",
          HSP3_ISOLATED_STAGING_ACK: "yes",
          HSP3_DEPLOY_SHA: "a".repeat(40), HSP3_DEPLOY_ID: "deployment",
        },
      });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /"uniqueTenants": 100/);
    assert.doesNotMatch(result.stdout, /dummy-not-a-secret|load-0@genesis\.test/);
  } finally {
    fs.unlinkSync(file);
  }
});

test("malformed credential fixture fails without echoing its contents", () => {
  const file = path.join(os.tmpdir(), `hsp3-fixture-${crypto.randomUUID()}.json`);
  try {
    fs.writeFileSync(file, '{"password":"SECRET_SHOULD_NOT_LEAK",broken');
    const result = spawnSync(process.execPath,
      [path.resolve("scripts/run-hsp3-100-tenants.mjs"), "--check-fixture"], {
        cwd: path.resolve("."), encoding: "utf8", env: {
          ...process.env, HSP3_FIXTURE_FILE: file,
          HSP3_STAGING_URL: "https://staging.example.test/",
          HSP3_TARGET_HOST_ACK: "staging.example.test",
          HSP3_ISOLATED_STAGING_ACK: "yes",
          HSP3_DEPLOY_SHA: "a".repeat(40), HSP3_DEPLOY_ID: "deployment",
        },
      });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Credential fixture is unreadable or invalid JSON/);
    assert.doesNotMatch(`${result.stdout}${result.stderr}`, /SECRET_SHOULD_NOT_LEAK/);
  } finally {
    fs.unlinkSync(file);
  }
});
