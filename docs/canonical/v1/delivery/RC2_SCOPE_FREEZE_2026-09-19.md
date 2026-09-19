# RC2 scope freeze — 2026-09-19

## Release target

RC2 is a candidate for an **internal controlled pilot** of the individual core.
It is not a production approval and is not an external customer launch.

## Included path

1. authenticated tenant context and explicit active tenant;
2. Business Passport read path and governed facts already contracted;
3. Diagnostic V1.1 with 24 stable anchors and 31 initial interactions;
4. canonical Growth Score, coverage and Confidence kept separate;
5. pain, Decision Record, mission, evidence and outcome cycle;
6. privacy view and purpose-bound consent foundation;
7. audit, trace, deterministic rules and fail-closed behavior;
8. reproducible build, migrations, tests and release evidence.

## Held off

The following flags remain false and cannot be enabled in RC2:

- `FEATURE_ECOSYSTEM`;
- `FEATURE_QUALIFICATION_NETWORK`;
- `FEATURE_AGENTIC`;
- `FEATURE_REAL_CONTACT`;
- `FEATURE_DATA_UPLOAD`.

Binary upload, qualified provider network, real contact, agentic execution,
checkout, external CRM integration and production deployment are later gates.
The existing tax surface remains a simulation; no fiscal integration is enabled.

## Reference repositories

The Pydantic AI, DeskcommCRM and Comp AI CRM ZIPs are reference inputs only.
They are not runtime dependencies of RC2, do not change the modular
Next.js/Supabase architecture and do not authorize copying code without license,
security and contract review. Their inventory is recorded in
`docs/audit-2026-09-18/REFERENCE_ZIPS_INDEX.json`.

## Promotion gate

Promotion requires, for the exact RC2 hash: frozen installation, clean build,
TypeScript and lint; unit, adversarial and SQL tests; clean migration from zero;
two-tenant negative checks; no known high/critical dependency advisory; evidence
manifest; and a signed GO/NO-GO decision. Missing evidence means `runtime-pending`.

## Rollback

Application changes roll back to RC1 artifacts. Migration 0016 is additive;
rollback disables the RC2 application paths while retaining the added columns,
constraints and trigger until a reviewed forward migration replaces them.
