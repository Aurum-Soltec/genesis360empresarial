# Wave 6 — End-to-End Core

**Data:** 2026-08-28  
**Gate:** IMPLEMENTATION / PRODUCT FLOW  
**Status:** IMPLEMENTED BY CONTRACT + STATIC CHECKS / RUNTIME PENDING

## Objetivo
Fechar o ciclo principal do Genesis sem adicionar nova plataforma:

`Pain → GDS → Mission → Evidence → Outcome → Timeline`
e
`Pain → Capability → Qualified Providers → Consented Contact`

## Implementado

### GDS → Mission
- `create_mission_from_decision`;
- template seguro `GENESIS-VALIDATE-CAUSE`;
- nenhuma causa é inventada quando GDS não a comprovou;
- decisão pode projetar capability já aprovada pela taxonomia.

### Mission
- UX real `/missoes`;
- aceite, início, evidência, conclusão e outcome;
- evidência obrigatória quando o template declara requisito;
- state machine continua validada também no PostgreSQL;
- outcome fecha a Timeline;
- Passport só recebe outcome quando o template explicita `passportFactKey`.

### Qualification Network
- `plan_catalog`;
- `tenant_subscriptions`;
- `provider_network_policies`;
- matching cross-tenant somente por trusted server API;
- missing outcome data é tratado como dado ausente, não como score zero;
- plano fica fora da função de ranking.

### Fail closed
PEND-003 e PEND-004 continuam abertas:
- threshold V1 não foi inventado;
- nenhum Free/Start/Pro é habilitado automaticamente como plano de provider.

Até publicar uma política e habilitar os planos aprovados, nenhuma empresa aparece.

### Contato
- consentimento efetivo `QUALIFIED_MATCHING` obrigatório;
- elegibilidade é recalculada no momento do pedido;
- request cross-tenant não é exposto diretamente pelo PostgREST;
- request gera evento durável `solution.contact.requested`.

### Outbox
A primitive agora possui:
- claim;
- lease;
- complete;
- fail/retry;
- dead state.

Não existe HTTP dentro de trigger.

## UX conectada
- `/prioridades`;
- `/missoes`;
- `/solucoes`;
- `/capacidades`;
- `/indicadores`;
- `/historico`;
- `/privacidade`.

Nenhuma dessas superfícies inventa números para preencher layout.

## Agentic comparison
Foi criada uma baseline sem dependência adicional:
- `lib/intelligence/minimal-gds-orchestrator.ts`.

Ela competirá contra:
- `pydantic-ai-slim` isolado.

Pydantic só entra se reduzir complexidade total mensurada.

## Runtime ainda obrigatório
- migrations 0001→0011;
- `supabase test db`;
- `lint/typecheck/test/build`;
- E2E browser;
- restore/rollback;
- security scans.
