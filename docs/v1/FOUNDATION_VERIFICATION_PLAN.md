# Foundation Verification Plan

## FV-01 Database bootstrap
Aplicar migrations 0001→0006 em banco limpo. PASS = zero erro.

## FV-02 Incremental migration
Aplicar 0002→0006 sobre snapshot compatível V3. PASS = dados preservados e zero conflito.

## FV-03 Cross-tenant
Criar user A/tenant A e user B/tenant B. Para toda tabela tenant-owned testar SELECT/INSERT/UPDATE/DELETE A→B. PASS = nenhuma leitura/escrita indevida.

## FV-04 Auth/session
Login, refresh, logout, sessão expirada, multi-membership e troca explícita de tenant.

## FV-05 Consent
Grant/deny/revoke por finalidade; matching/IA/analytics respeitam deny.

## FV-06 Diagnostic
Essential e Full; autosave; retomada; coverage <60 bloqueia score; score determinístico reproduzível.

## FV-07 Mission
Testar todas as transições válidas e inválidas; evidência; outcome; nenhuma pontuação por clique.

## FV-08 Qualification
Tabela de decisão com cada gate falhando isoladamente; plano nunca altera ranking após elegibilidade.

## FV-09 CI
install lockfile → lint → typecheck → unit → integration → build.

## FV-10 Security/supply chain
secret scan, dependency scan, license scan, SBOM, threat model e abuse cases.

## FV-11 Operations
backup, restore drill, rollback de deploy/migration, logs/traces/redaction.

## FV-12 E2E
onboarding → consent → Passport → diagnóstico → score → pain → GDS → missão → capability → qualified provider → contact consent → outcome.
