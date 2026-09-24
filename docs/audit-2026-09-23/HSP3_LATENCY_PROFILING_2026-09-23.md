# HSP-3 — hosted latency profiling and bounded remediation candidate

Date: 2026-09-23. Target: dedicated `genesis360-staging` Railway project,
environment named `production`, web deployment
`5bac0563-0be8-48b7-a554-94835cc31646`, source SHA
`5e6e836ad828b075ca91e5fc7d9075e4f6a73918`. This is **not** open
production. No 100-tenant soak was run in this recheck.

## Problem and measured evidence

The historical 60-minute HSP-3 run completed 18,610 requests across 100
tenants with zero functional failures, but dashboard p95 was 1,474.87 ms and
fact-write p95 was 1,166.55 ms against the 750 ms gate. The new hosted web
and worker are in Railway US East; `supabase projects list` reports the staging
database in `sa-east-1`. This regional split is a plausible source of network
latency, not by itself proof of the entire bottleneck.

Railway automatic tracing was enabled only on the dedicated staging web
service, without deployment or code change. It is a reversible service-level
setting. The authenticated API trace `11fdf57ce96bbc3f8ccf06a9178e0727`
at 22:18:41 UTC showed 585 ms at the edge, 469 ms in application processing,
and four successful Supabase HTTP requests of 140–151 ms: Auth user, concurrent
membership and quota, then business facts. A full HTML authenticated Home
reload, trace `76a18b0b3dfcd73419a4931d9526e9b4` at 22:21:31 UTC, took
1,451 ms at the edge and 1,277 ms in application processing. It included
**two sequential** `/auth/v1/user` calls (210 and 139 ms), then concurrent
membership/quota (149/162 ms), company selection (160 ms), concurrent
Passport/diagnostic/mission reads (146–151 ms), then pain/score reads (163/402
ms). The second Auth call comes from `proxy.ts` plus the page's
`requireTenantContext()`; page authorization and RLS remain mandatory.

A seven-request public login-page sample from this operator location returned
200 with warm total request times around 190–203 ms and one 449 ms cold first
request. This only characterizes the public network path, not authenticated
server work. The Railway web 1-hour summary at 22:13 UTC reported HTTP p95
2,899 ms over 213 mixed requests, with near-idle CPU and 23.6% memory at the
end; it is not a controlled HSP-3 sample. Per-route metrics had one
`/api/passport/facts` sample at 981 ms, insufficient for a percentile claim.

## Impact, alternatives and recommendation

The repeated hosted Auth call adds one observable sequential remote round
trip to protected pages. The dashboard also performs several sequential data
stages, so changing Auth alone **cannot** establish the 750 ms gate. Options:

1. Keep the current implementation and accept HSP-3 FAIL. It preserves
   behavior but leaves a measured duplicate request.
2. In the Proxy only, use `supabase.auth.getClaims()` to verify the signed
   session and refresh cookies. Keep `getUser()`, membership, quota and RLS in
   the page/API data layer. Supabase's current Next.js SSR guide recommends
   this split. On asymmetric signing keys, claims verification can be local;
   on symmetric keys it can still call Auth. The data layer retains a fresh
   Auth lookup and catches revocation before any protected read.
3. Co-locate application and database or consolidate dashboard reads. Either
   is a larger architecture/deployment change requiring an ADR, migration or
   new database boundary tests. Railway's listed deployment regions currently
   do not include Sao Paulo, so moving only the Railway service cannot
   co-locate it with this Supabase project.

Recommendation: test option 2 as the smallest reversible change. This is a
**candidate only** until the exact new artifact passes local checks, hosted
Auth/tenant regression and the same 60-minute 100-tenant workload. A later
architecture decision may be needed if the SLO still fails. Do not relax the
750 ms threshold or RLS to produce a PASS.

Rollback: revert the Proxy change and redeploy the prior approved SHA; the
staging database schema is unchanged by this optimization. Independent
`requireTenantContext()` and RLS continue to guard data in either version.

Primary references:

- Supabase SSR Next.js guidance: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- Supabase session revocation distinction: https://supabase.com/docs/guides/auth/server-side/advanced-guide
- Railway regional deployment guidance: https://docs.railway.com/deployments/optimize-performance

## Gate status

**HSP-3 performance remains FAIL.** New tracing proves where time is spent in
sample requests; it does not replace the controlled load run, p50/p95/p99,
error rate, connection/pool, outbox/worker, CPU, memory, saturation or cost
evidence required for 100 TENANTS READY.
