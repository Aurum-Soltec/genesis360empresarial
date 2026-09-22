# Demo Readiness Wave — 2026-09-21

## Objective

Make the already validated Genesis core demonstrable to ecosystem leaders through
a truthful flow from company information to a traceable executive report.

## Implemented local cut

- official Genesis 360 Empresarial brand applied to shared navigation and access;
- evidence ledger rendered in the Documents surface with source, capture date and
  verification state;
- diagnostic result enriched with answer count, evidence-backed answer count,
  unique linked sources and verified-evidence count;
- score and confidence rule versions displayed with diagnostic identity and
  submission timestamp;
- browser-native A4 report layout and print/save-as-PDF action;
- diagnostic-level evidence links reconciled with answer-level references in the
  same provenance view;
- authenticated demo preparation runner that uses only ordinary application
  permissions to create a fictional scenario, complete the Essential path,
  submit the diagnosis and produce screenshots, a PDF and a machine-readable
  execution record;
- explicit unavailable and no-evidence states so missing provenance is never
  represented as proof.

## Complete presentation tranche

The next candidate extends the bounded demo without changing the frozen core:

- `/demonstracao` is the presenter cockpit and shows readiness for company,
  documents, diagnostic, report and Conselho;
- Documents can register only a fixed package of three system-owned fictional
  sources. The endpoint accepts identifiers only and never accepts file bytes or
  arbitrary document text;
- Full and Essential diagnostic profiles are selectable in the focused journey;
- the executive report includes a deterministic evidence-quality statement and
  a 30/60/90-day plan based on the three weakest known dimension scores;
- Conselho Genesis offers interactive deterministic syntheses with visible data
  sources. It is read-only and does not activate the agentic runtime;
- the demo is available only when `FEATURE_DEMO_WORKSPACE=true` and the active
  tenant UUID is present in `DEMO_TENANT_IDS`.

This tranche requires a new hosted run before receiving runtime credit.

## Reproducible demo preparation

The runner requires a dedicated demo user with an active tenant and company. It
does not use database credentials, a Supabase service role or privileged writes.
Credentials are read from the process environment and are never written to the
generated artifacts.

```powershell
$env:DEMO_BASE_URL = "https://staging.example"
$env:DEMO_EMAIL = "dedicated-demo-user@example.com"
$env:DEMO_PASSWORD = "<provided-at-runtime>"
$env:DEMO_TENANT_NAME = "<optional-tenant-name>"
$env:DEMO_PROFILE = "FULL"
pnpm demo:prepare
```

Outputs are written to `docs/audit-2026-09-18/demo-readiness/` by default:

- complete executive-result screenshot;
- evidence-ledger screenshot;
- printable A4 PDF;
- JSON run record without credentials or session cookies.

The generated information is explicitly labelled as fictional demonstration
data. Evidence remains `unverified` unless a separate approved verification
process changes its ledger state.

## Objective PASS / FAIL

PASS requires all of the following in one authenticated run:

- tenant selected through the normal application boundary;
- diagnostic created or resumed for the tenant company;
- three evidence records created and linked to that diagnostic;
- the full Essential adaptive path completed through the public API;
- scoring submission accepted;
- result renders score methodology and provenance;
- result screenshot, evidence screenshot, PDF and JSON record generated.

FAIL applies if any request bypasses the normal application boundary, the
diagnostic cannot submit, provenance does not render, or any required artifact
is absent.

## Hosted execution result

**PASS — 2026-09-21.** The deployed artifact was identified by merge commit
`572b584b8c0fc9b096ed1cd5470fc8fd51e37bec` on Railway. The authenticated run
completed 42 Essential interactions, linked three fictional evidence records,
submitted scoring and rendered the traceable result.

Measured result:

- Growth Score: 55/100;
- coverage: 100%;
- confidence: 78%;
- answers with evidence references: 42/42;
- unique linked sources: 3;
- verified evidence: 0, correctly fail-closed as `unverified`;
- final PDF: two A4 pages, 131,412 bytes;
- final PDF SHA-256: `AB52E3D04F9FEC0D2978456F642370F159160A985E190EAC30079B9C537FC380`.

The first PDF render exposed an accessibility skip link and poor pagination.
PR `#10` corrected the print-only layout, repeated every remote gate, redeployed
the candidate and repeated the full hosted scenario. Only the corrected second
execution receives final demo evidence credit.

### Complete Full presentation rerun — PASS, 2026-09-22

PRs `#12`, `#13` and `#14` delivered the presentation cockpit, Full profile,
30/60/90-day executive plan, deterministic Council and idempotent canonical
evidence package. Railway deployed merge commit
`c4f264163280b60fb47024d907632fc819c63de8` successfully.

The hosted run completed 50 adaptive Full interactions, linked exactly three
canonical fictional sources, submitted scoring, rendered the report and exposed
all five presentation steps as ready. The result remained Growth Score 55,
coverage 100% and confidence 78%. The three-page A4 PDF was rendered and visually
reviewed without clipping or overlap; SHA-256 is
`D6D3739D9E1C7835398D32E4FDC4F0B8214F2FDB6D71B9E7988AD3442C2E9B24`.

Runtime screenshots and the JSON execution record are stored in
`docs/audit-2026-09-18/demo-readiness/full-hosted-2026-09-22/`. The reviewed PDF
remains local because the public-package policy blocks PDF binaries; its SHA-256
above preserves traceability. No credential, cookie or real-company data is
present. This PASS proves the bounded fictional presentation flow only; it does
not change the HSP-4 NO-GO for pilot or open production.

### Presentation-complete candidate — local PASS, hosted runtime pending

The next bounded candidate expands the meeting flow from five to seven visible
stages without enabling any sensitive product capability:

- the executive report translates the three weakest known dimension scores into
  deterministic service categories, expected outcomes and an open explanation;
- fictional illustrative providers make the future solution journey visible,
  always marked as fictional and never presented as qualified or recommended;
- `/demonstracao/solucoes` shows the complete simulated-adherence view and keeps
  Qualification Network and Real Contact visibly disabled;
- `/demonstracao/administracao` provides an owner/admin-only, tenant-scoped
  readiness cockpit. It is explicitly not a global platform backoffice;
- the executable demo runner now requires the report, seven-step cockpit,
  simulated-solution safety boundary and restricted administration to render in
  the same authenticated Full run;
- the generated evidence set adds screenshots for solutions and administration.

Local `pnpm quality` passed with 34 native hardening tests, 65 Vitest tests and a
production build containing both new dynamic routes. Hosted runtime credit
remains pending until this exact candidate is deployed and the expanded runner
passes against staging.

## Meeting flow

1. Open the authenticated home and identify the active company.
2. Show the focused diagnostic journey and explain adaptive questions.
3. Open Documents and distinguish declared evidence from verified evidence.
4. Open the completed result: interpretation, priorities, dimensions,
   confidence and provenance.
5. Save or show the branded PDF.
6. Show the solution simulation and explain why each capability appears.
7. Open the tenant-scoped administrative cockpit and verify the five sensitive
   flags remain disabled.
8. State explicitly that the scenario is fictional and that real client uploads,
   provider qualification and contact remain disabled during the controlled stage.

For the complete presentation tranche, start at `/demonstracao`, register the
fixed fictional package, choose Full, show the executive plan and finish with
the three Conselho questions. The 144 questions remain a governed library; the
Full adaptive journey uses the canonical 31 anchors and up to 60 typical
interactions rather than forcing every library item into one form.

## OSS reconciliation

DeskcommCRM supplied useful report, audit and evidence presentation references.
Its PDF runtime was not copied because introducing `@react-pdf/renderer` would add
dependency and migration work while the browser print pipeline already satisfies
the immediate demonstration need. Comp AI CRM remains a pattern reference because
its Bun/NestJS/Prisma runtime conflicts with the approved Next.js/Supabase stack.

No third-party source code was vendored in this cut.

## Preserved boundaries

- no tenancy, RLS, auth, scoring, outbox or worker rewrite;
- no agentic activation;
- no real-contact or ecosystem activation;
- no binary upload activation for real users;
- no document is presented as verified unless its ledger state is `verified`;
- declaration-only results remain explicitly distinguishable from verified evidence.

## Runtime credit

Local and hosted runtime receive credit for the bounded demonstration path above.
This does not change the HSP-4 NO-GO for an open pilot or production, and it does
not prove real-document ingestion because binary upload remains disabled.
