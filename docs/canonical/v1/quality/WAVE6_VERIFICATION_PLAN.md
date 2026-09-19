# Wave 6 Verification Plan

## W6-01 Migration
Bootstrap 0001→0011.

## W6-02 Decision → Mission
- GDS existente cria exatamente uma missão aberta;
- fallback usa `GENESIS-VALIDATE-CAUSE`;
- segunda missão ativa para mesma decisão falha.

## W6-03 Mission evidence/outcome
- evidence em estado inválido falha;
- evidence move IN_PROGRESS→EVIDENCE_PENDING;
- COMPLETE sem evidence requerida falha pela API;
- outcome só após COMPLETED/OUTCOME_PENDING;
- outcome cria Timeline.

## W6-04 Capability projection
Pain mapping publicado gera mission capability requirement.
Sem mapping = nenhuma capability inventada.

## W6-05 Provider policy
Sem policy publicada = zero providers.
Sem threshold = zero providers.

## W6-06 Plan neutrality
Provider sem plano elegível = excluído.
Mudar plan tier entre planos elegíveis não muda ranking.

## W6-07 Missing data
Provider sem outcome histórico não recebe outcome=0 artificial.

## W6-08 Contact
Sem `QUALIFIED_MATCHING` = 409.
Provider reprovado depois de aparecer = request falha.
Consent de outro tenant não pode ser reutilizado.
Duplicate open request = 409.

## W6-09 Cross-tenant disclosure
Consumer recebe somente campos sanitizados do provider.
Nenhuma tabela de provider é liberada via client RLS.

## W6-10 Outbox
Claim → complete.
Claim → fail → retry.
Após max attempts → dead.
Lease mismatch falha.

## W6-11 UI
Desktop/tablet/mobile:
- prioridades;
- missões;
- soluções;
- capacidades;
- indicadores;
- histórico;
- privacidade.

## W6-12 Regression
`pnpm quality` e `supabase test db`.

## W6-13 RBAC / Sensitivity
- member lê empresa, mas não cria/edita;
- manager cria/edita;
- member não lê financial/restricted Passport/Evidence;
- manager lê;
- auditor lê audit;
- member não lê audit;
- legacy `current_tenant_id()` não existe.
