# Third-Party / Pattern Provenance

## Runtime dependencies
See `package.json`, `pnpm-lock.yaml` and future SBOM output.

## Selective OSS research used in Wave 5
No source code from the repositories below is vendored into the Genesis production runtime in this Wave.

- DeskcommCRM — reviewed for multi-tenant invariant and durable event-worker patterns.
- trycompai/crm — reviewed for evidence-ledger and no-database-agent boundary.
- Anthropic-Cybersecurity-Skills (community, mukul975) — reviewed for cybersecurity skill taxonomy; Genesis checklists are original.
- Pydantic AI — `pydantic-ai-slim==2.33.0` appears only in the isolated `/intelligence` spike and is not part of the Next.js production dependency graph.

Before any future code vendoring, record exact upstream commit/tag, license, NOTICE requirements, modified files and SBOM.
