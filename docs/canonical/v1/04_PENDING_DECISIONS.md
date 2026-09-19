 > **ADENDO V1.2.1, 2026-09-10:** preço Pro R$297 aprovado pelo proprietário; Free0 e Start99 mantidos.
> A referência executável está em `data/commercial-plans.json`.
> Hipóteses anteriores de preço do Pro estão superadas; outras pendências não foram aprovadas por inferência.
> Ver `docs/canonical/v1/product/PRD_HARDENING_V1_2_1.md` e `PROJECT-STATE.md`.

# Pending Decisions V1

## PEND-001 — Pro price
Baseline: R$297/mês.
Status: validar por experimento comercial.

## PEND-002 — AI budgets
Definir limites por Free/Start/Pro.
Sem “unlimited AI”.

## PEND-003 — Qualification threshold
Definir score mínimo por capability/policy.
**Sistema atual falha fechado sem threshold publicado.**

## PEND-004 — Provider plan eligibility
Definir quais planos podem participar da Rede Genesis.
**FREE/START/PRO estão inicialmente `provider_network_eligible=false`.**

## PEND-005 — Qualification methodology
Formalizar cálculo, evidências, recertificação e expiração.

## PEND-006 — Initial capability taxonomy
Aprovar pain→capability V1.
Nenhum mapping setorial é inventado automaticamente.

## PEND-007 — Agentic runtime
Comparar minimal Genesis orchestrator vs Pydantic AI Slim.
Agno SDK permanece fallback.

## PEND-008 — Benchmark minimum cohort
Definir suppression/coorte mínima e qualidade necessária.

## PEND-009 — Genesis Ecosystem commercial model
Definir modelo institucional.

## PEND-010 — Consent legal copy/version
A UX de aceite real requer texto/versionamento aprovado.
A infraestrutura existe; não será criada linguagem legal fictícia.

## PEND-011 — Sector taxonomy calibration
V1.1 includes a broad sector taxonomy and operating-trait contract.
Validate sector affinities against real companies before using them as benchmark methodology.

## PEND-012 — Confidence calibration
V1.1 weights are approved as product baseline but need empirical calibration.

## PEND-013 — Data Submission legal copy activation
Architecture/copy intent approved.
Activation still requires formal legal/privacy review.

## PEND-014 — Upload storage/scanning policy
Define binary limits, malware/content scan, storage, retention and deletion before `FEATURE_DATA_UPLOAD=true`.

## PEND-015 — RPO/RTO production targets
Definir metas objetivas depois do primeiro restore drill e do modelo de operação/staging.

## PEND-016 — Pilot cohort
Definir empresas/coorte, critérios de entrada, duração, suporte e critérios de sucesso para ST-123.

## PEND-017 — Observability retention/cost
Definir retenção e budget de logs/traces/metrics após medir volume real.
