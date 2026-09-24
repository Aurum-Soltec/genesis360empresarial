# HSP-4 hosted FULL diagnostic and migration 0024 RLS proof

Observed 2026-09-23 22:08–22:23 UTC against the dedicated Railway staging
project, web and worker deployment of commit
`5e6e836ad828b075ca91e5fc7d9075e4f6a73918`. The Railway environment is
named `production`, but this is the isolated staging project, not open
production. All application answers and companies described below are
fictitious. No real-user upload or sensitive feature flag was enabled.

## Authenticated FULL journey: PASS, documentary scope limited

In an existing authenticated owner session for fictitious `Empresa A`, the
ordinary hosted UI started a new FULL diagnostic, saved 55 sequential
interactions across six stages, reached 100% progress and 78% confidence,
submitted successfully and opened
`/resultado-v1?diagnostic=e6ec5efa-0e55-4882-8836-08b5b899c92d`.
The new report displayed Growth Score 48/100, 100% coverage, 12 dimension
readings, a 90-day plan, three explainable fictional service/company
suggestions and explicit evidence-quality limits. Its real-data matching and
contact boundaries remained off.

A separate read-only hosted database query confirmed that this diagnostic was
created at `2026-09-23 22:08:03 UTC`, scored at `22:15:33 UTC`, has exactly
55 answer rows, `answer_revision=55`, 12 score rows, Growth Score 48,
coverage 100% and confidence 78%. This is a fresh post-promotion run, unlike
the earlier result linked in the original staging-promotion note.

**Important limitation:** the report states zero question-level evidence
references, zero sources linked to this diagnostic and zero verified sources,
although three canonical fictional sources are registered for the company.
The database query confirmed `answers_with_evidence=0`. The UI deliberately
sends `evidenceRefs: []` in `app/diagnostico-v1/journey.tsx`; its comment says a
reviewed question-level relevance rule is needed before linking a demo source.
This run therefore proves a complete questionnaire-to-report path, **not** a
document-to-conclusion path. No arbitrary auto-linking was added and the
report correctly warns against treating answers as verified facts.
After this new result became the latest one, `/demonstracao` still showed
`7/7` and described a document-to-decision flow because its document step
counts the three company-level registered sources. Its report link now opens
the new zero-source result. That cockpit readiness count must not be
interpreted as proof of document-grounded conclusions.

**Local correction, not yet staged:** `app/demonstracao/page.tsx` now reads
both question references and diagnostic-level evidence links for the latest
scored result, intersects them with the canonical fictional sources and shows
registered and linked counts separately. A new result with zero links drops
the document step and would render `6/7`; a result with a valid linked source
can show `7/7`, while still saying that the source is not documentally
verified. This does not attach sources or change scoring. The focused SSR test
in `app/demo-company-boundary.test.tsx` passed 4/4, as did TypeScript and
ESLint for affected files. Because this is only local code, the hosted
cockpit continues to show `7/7` until a reviewed build is deployed; its demo
gate must be rerun on that new SHA.

## Hosted sensitive-read RLS after migration 0024: PASS at database boundary

The executable probe is
[`hosted-diagnostic-rls-2026-09-23.sql`](hosted-diagnostic-rls-2026-09-23.sql).
The sanitized machine-readable assertion output is
[`hosted-diagnostic-rls-2026-09-23.json`](hosted-diagnostic-rls-2026-09-23.json).
It ran with `supabase db query --linked --file ... --output json` against the
hosted staging database. It creates synthetic auth users, two tenants, three
companies, facts and timeline events **inside one transaction**, sets
`request.jwt.claim.sub` separately for four actors, and runs the observations
under `SET LOCAL ROLE authenticated` (not service role). The script ends with
`ROLLBACK`. It uses SQL assertions without pgTAP because the linked CLI role
cannot execute `extensions.plan()` in this hosted project.

All **12/12** hosted assertions passed:

| Actor | Observed authorized scope |
| --- | --- |
| Member of tenant A | 1 internal fact and 2 timeline events (internal fact plus unrelated mission); 0 sensitive payloads/source references |
| Manager of tenant A | 4 facts and 5 authorized events, including 3 sensitive references; 0 wrong-company fact reference |
| Owner of tenant A | 5 authorized events; malformed fact reference excluded |
| Member of tenant B | 0 tenant-A facts/events; 1 event belonging to tenant B |

A separate read-only query after the transaction found **zero** synthetic
tenant, user and fact rows; `business_timeline_sensitivity_select` exists and
the old `business_timeline_member_select` does not. No policy, grant or
application authorization was changed. This establishes hosted database RLS
under distinct authenticated JWT subjects. Separate browser sessions for
member/manager/other-tenant were not available, so their HTTP route behavior
was **not** independently exercised. The route code uses the authenticated
Supabase client, but that code observation is not a substitute for an HTTP
test.

## Gate accounting

- New FULL questionnaire → score/report on exact staging artifact: **PASS**.
- Migration 0024 hosted database RLS with synthetic member/manager/other
  tenant: **PASS**, 12/12 and rollback verified.
- End-to-end document relevance/verification in the ordinary UI: **PENDING**;
  zero linked/verified sources was explicitly disclosed by the product.
- Multi-role HTTP session proof: **PENDING**; no such credentials were used.
- HSP-4 overall: unchanged here. These two proofs do not close invitation,
  managed backup/RPO, alert acknowledgement, licensing or 100-tenant SLO.

No secret, password, token, service role key or database URL was recorded.
