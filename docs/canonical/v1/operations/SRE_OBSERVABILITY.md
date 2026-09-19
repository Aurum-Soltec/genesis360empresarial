# SRE / OBSERVABILITY

## Telemetria
- logs estruturados;
- correlation IDs;
- traces;
- métricas;
- domain events;
- PII redaction.

Implementado localmente em PS-4:
- `x-correlation-id` seguro criado/preservado no proxy e devolvido ao cliente;
- `server-timing` e log JSON pelo wrapper de API;
- captura estruturada de erro não tratado em `instrumentation.ts`;
- worker com tenant, company, event, correlação, duração, resultado e erro;
- views protegidas `outbox_operational_health` e `database_operational_health`;
- regras iniciais em `config/observability/alerts.json`.

O coletor/retentor externo e o roteamento de alertas pertencem ao ambiente de
staging/produção e não são simulados no código local.

## Fluxos críticos
- auth;
- tenant switch;
- diagnosis autosave;
- scoring;
- GDS;
- mission transition;
- qualification;
- matching;
- agent run;
- contact consent.

## SLO
Não fixar “nines” antes de workload real.

SLIs iniciais:
- request success;
- diagnosis save success;
- score computation success;
- p95 critical routes;
- agent task success;
- freshness;
- job completion.

## DR
- backup;
- restore drill;
- secrets recovery;
- infra reconstruction;
- data reconciliation;
- runbook.
