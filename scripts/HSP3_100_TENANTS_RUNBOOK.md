# HSP-3 hosted 100-tenant soak runner

This runner reproduces the historical ten authenticated sessions / 100 synthetic
tenants / 60-minute workload. It uses the public web path: browser login, tenant
selection, server-rendered dashboard, Passport fact write and read-back, and
cross-tenant denial. Every write is a synthetic `hsp3_*` declaration, tagged by
run ID; no real customer document or production fixture is accepted.

## Preconditions

1. An isolated staging deployment, exact 40-character deployed commit SHA and
   deployment ID. Keep the five sensitive feature flags off.
2. Ten staging-only management users, each with access to ten distinct active
   synthetic tenants with one company each. Prepare a JSON file **outside this
   repository** (for example, in a protected operator directory) with this
   structure. Never add that file to a commit or evidence bundle:

```json
{
  "synthetic": true,
  "users": [
    {
      "email": "staging-load-user-1@example.test",
      "password": "<staging-only secret>",
      "tenants": [
        { "tenantId": "<UUID>", "companyId": "<UUID>" }
      ]
    }
  ]
}
```

   The runner requires exactly ten users and ten unique tenant/company pairs per
   user. The snippet only shows the shape; it is not a valid fixture.
3. Installed Chrome/Chromium, Node 24, and an operator ready to collect metrics.
   The runner does not use a database URL or service-role key.
4. A bounded cost/usage plan approved for the isolated staging environment.
   `HSP3_MAX_REQUESTS` (default 30,000) and `HSP3_MAX_WRITES` (default 6,500)
   stop this workload; they cannot enforce a provider's monetary limit.

## Execute

Set the variables in the operator shell without logging their values:

```text
HSP3_FIXTURE_FILE=<absolute path outside repo>
HSP3_STAGING_URL=https://<staging-host>/
HSP3_TARGET_HOST_ACK=<exact staging host>
HSP3_ISOLATED_STAGING_ACK=yes
HSP3_DEPLOY_SHA=<40-character SHA of the deployed artifact>
HSP3_DEPLOY_ID=<provider deployment ID>
CHROME_PATH=<absolute Chrome/Chromium executable path>
HSP3_DURATION_SECONDS=3600
HSP3_CYCLE_MS=6000
```

Then run `pnpm test:hsp3-harness`,
`node scripts/run-hsp3-100-tenants.mjs --check-fixture`, and
`node scripts/run-hsp3-100-tenants.mjs --run`. The check prints only tenant
counts and deployment metadata. The run writes a JSON result under
`test-results/` (or `HSP3_OUTPUT_FILE`) and prints its location. Do not publish
the credential fixture. A short dry run can set `HSP3_DURATION_SECONDS` below
3600 but will never satisfy the 60-minute gate.

The first phase verifies all 100 declared tenant memberships and a foreign
denial before any fact write. During the workload, a foreign-tenant switch must
return 403 and a foreign-company Passport read must return no facts. Any
unexpected failure stops the run. The report contains p50/p95/p99 per operation,
error rate, DNS/connect/TLS/first-byte/download timing when available, sampled
correlation IDs, tenant coverage and request counts. It does **not** claim that
the worker completed merely because HTTP returned 201.

## Collect independent operational evidence

After the workload and worker drain, an authorized operator can execute the
read-only `scripts/hsp3-soak-ops.sql` with the run ID to count exact synthetic
facts, matching outbox events, processed/dead/pending events, retries and worker
latency. The SQL must run from the operator's protected database session. Keep
connection strings and credentials out of command logs and evidence.

Independently export the same deployment's 60-minute Railway/Supabase metrics:
error rate, web/worker CPU and memory peaks, pool utilization, connection peak,
slow queries, quota denials, saturation and estimated cost. Record source
artifact paths or provider IDs as `workerObservationRef`,
`databaseObservationRef` and `hostingObservationRef`. Create an observations
JSON with the keys listed in `scripts/finalize-hsp3-100-tenants.mjs`, including
the workload `runId`, `deploySha` and `deployId`. No credentials belong there.

Run:

```text
node scripts/finalize-hsp3-100-tenants.mjs <run.json> <observations.json> <final.json>
```

`PASS_CANDIDATE` only means the automated checks found a 60-minute 100-tenant
run, p95 at or below 750 ms for measured operations, no unexpected error,
cross-tenant denial, the expected volume and matching operator measurements.
It is **not** final HSP-4 approval. Review the raw provider metrics, full worker
window, costs and evidence provenance before deciding the gate. Missing
observations remain `FAIL_OR_INCOMPLETE`.
