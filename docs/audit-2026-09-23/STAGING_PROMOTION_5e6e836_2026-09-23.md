# Staging promotion evidence — 2026-09-23

Status at 21:43 UTC: **SHA promoted to hosted staging; HSP-4 remains NO-GO.**
This record describes the controlled staging project, whose Railway environment
is named `production`. It is not open production or pilot approval.

## Source and CI

- Source commit: `5e6e836ad828b075ca91e5fc7d9075e4f6a73918` on the public
  `codex/navigation-pages-fix` branch; PR #25 remains open.
- PR checks for that exact head: Linux `quality`, isolated `database` pgTAP and
  CodeQL all `SUCCESS`. The Linux quality job includes dependency audit and SBOM.
- The previous exact SHA `6aab617` was not promoted because its Linux quality
  check failed and the demo evidence runner used the wrong API. The correction
  is in the promoted SHA.

## Hosted artifact and database

| Component | Deployment | Result |
| --- | --- | --- |
| Railway web | `5bac0563-0be8-48b7-a554-94835cc31646` | `SUCCESS`, active instance `RUNNING`, commit `5e6e836ad828b075ca91e5fc7d9075e4f6a73918` |
| Railway worker | `6b36423a-80eb-4eba-b8a5-35cb2636919b` | `SUCCESS`, active instance `RUNNING`, same commit |
| Supabase staging | migration `0024_sensitive_passport_timeline_reads.sql` | Applied after dry-run showed it was the only pending migration; remote history now contains `0001`–`0024` |

A schema-only `public` snapshot was taken before migration in
`tmp/staging-pre-0024-public-schema.sql` (SHA-256
`3A4DF5670F0A1011717934E89399FAF1492927E3FA9294A6B91EAD3405F8EF11`).
No customer rows or database credentials were included. A read-only remote
policy query confirmed that `business_timeline_sensitivity_select` exists and
the old `business_timeline_member_select` is absent.

The 11-case linked pgTAP file could not run as the Supabase CLI login role:
`plan()` was outside its search path, and explicit `extensions.plan()` was
denied by schema permissions. Those attempts stopped before any test fixture
write. The isolated GitHub database job passed, but it is not hosted RLS proof.
Hosted member/manager/cross-tenant RLS verification remains **BLOCKED** until
a safe test role or equivalent authenticated HTTP probe is available. Do not
grant broader schema access merely to turn this gate green.

## Hosted application observations

- Anonymous `/entrar` returned 200. Protected `/`, `/passaporte`, `/historico`,
  `/documentos`, `/diagnostico-v1`, `/resultado-v1`, `/demonstracao`, its two
  subpages and `/conselho` returned 307 to their own login destinations.
- Existing authenticated fictitious tenant: demo cockpit showed **7/7** steps,
  all **3/3** canonical fictional sources, an existing scored **FULL** report,
  simulated solutions, Conselho and restricted administration. This is a
  walkthrough of an existing diagnosis, not a new end-to-end diagnostic run
  on the promoted SHA.
- The report rendered 50 evaluated answers, 3 linked sources, 0 verified
  sources, Growth Score 55, confidence 78%, score/confidence rule versions,
  an evidence-quality warning, a 90-day plan and three explainable fictional
  services/companies. The solutions page showed no real contact or matching.
- The restricted administration page evaluated runtime flags via
  `getFeatureFlags()` and showed Agentic, real-user Data Upload, Qualification
  Network, Real Contact and Ecosystem all **off**.
- A new non-sensitive fictional Passport declaration was saved through the
  ordinary authenticated UI. It remained declared/unverified and appeared in
  the Business Timeline. The matching `passport.fact.created` outbox event was
  `processed`; the 15-minute aggregate at observation had 1 processed,
  0 failed, 0 dead, max attempts 1 and mean create-to-process latency 1.247 s.

## Fictional fixture reconciliation

The hosted document action initially failed closed. The sole pre-existing
`DEMO:indicadores-2026-q3.csv` row matched the canonical fictional template
except for legacy `sensitivity='internal'`; the current template requires
`financial`. An exact-match, single-row staging operation tightened that
classification to `financial` without changing content or its `unverified`
state and wrote one `demo.evidence_sensitivity_reconciled` audit event. The
Documents page then displayed 3/3 canonical sources and the cockpit 7/7.
No real document was uploaded, and no sensitive feature was enabled.

## Limits and next gate

- The full diagnostic runner was not repeated against this deployment because
  its dedicated demo credentials were not available in the current process.
  The existing FULL result predates the promotion.
- A member-versus-manager hosted RLS probe remains required despite policy
  presence and isolated pgTAP success.
- Historical HSP-4 blockers remain open unless separately proven closed:
  hosted invitation recovery, managed backup/restore and measured RPO/RTO,
  alert acknowledgement, OSS licensing, and the 100-tenant end-to-end p95
  gate. Neither this promotion nor a 7/7 demo cockpit proves 100 TENANTS READY.
- The Documents demo card still says `Empresa Aurora` while the active
  fictitious company is `Empresa A`; this copy inconsistency needs a future
  reviewed code change.
- Canonical project-state/gate documents must be reconciled in a later
  documentation commit. This note does not mark HSP-4, pilot or production
  gates as PASS.
