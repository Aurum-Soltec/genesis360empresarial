# FOUNDATION VERIFICATION PLAN

## FV-01 Database bootstrap
Aplicar migrations 0001->0006 em banco limpo.

## FV-02 Incremental
Aplicar 0002->0006 sobre baseline V3 compatível.

## FV-03 Cross-tenant
A tenta SELECT/INSERT/UPDATE/DELETE em B em toda tabela tenant-owned.

## FV-04 Auth/session
login, refresh, logout, expiração, multi-membership, tenant switch.

## FV-05 Consent
grant/deny/revoke por finalidade.

## FV-06 Diagnostic
Essential/Full, autosave, resume, score, <60% coverage block.

## FV-07 Mission
todas transições válidas/inválidas, evidence, outcome.

## FV-08 Qualification
cada gate falhando isoladamente; plan não altera ranking.

## FV-09 CI
lint, typecheck, unit, integration, build.

## FV-10 Security/supply chain
secret, dependency, license, SBOM, threat model.

## FV-11 Operations
backup, restore, rollback, telemetry/redaction.

## FV-12 E2E
`onboarding -> consent -> Passport -> diagnostic -> score -> pain -> GDS -> mission -> capability -> provider -> contact -> outcome`.

## Resultado
Somente depois do PASS registrar `GATE-FOUNDATION-VERIFIED = passed`.
