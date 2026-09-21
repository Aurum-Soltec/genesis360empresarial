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
is absent. Hosted runtime remains pending until this runner passes against the
deployed candidate.

## Meeting flow

1. Open the authenticated home and identify the active company.
2. Show the focused diagnostic journey and explain adaptive questions.
3. Open Documents and distinguish declared evidence from verified evidence.
4. Open the completed result: interpretation, priorities, dimensions,
   confidence and provenance.
5. Save or show the branded PDF.
6. State explicitly that the scenario is fictional and that real client uploads
   remain disabled during the controlled stage.

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

Local code, tests and production build can receive local-runtime credit after the
quality gate passes. Hosted-runtime credit remains pending deployment and a PASS
from `pnpm demo:prepare` in staging.
