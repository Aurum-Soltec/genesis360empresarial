import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { evaluateGate, percentile, summarizeSamples, validateFixture, validateRunConfig } from "../scripts/hsp3-load-core.mjs";

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
