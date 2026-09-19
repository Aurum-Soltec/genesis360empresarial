# CHANGELOG V1 EMPRESARIAL

## 2026-08-18 - Work Production Foundation Pack

- consolidada documentação canônica V1;
- preservados PRD/ADRs/gap/backlog anteriores;
- adicionados Project State, Sources, Decisions, Risks, Gates e Handoff;
- arquitetura master e domain/data/API strategy;
- UX redesign baseada em Taste Skill;
- antigo dark Genesis Glass marcado como superado;
- novo Genesis Light implementado em CSS;
- topbar principal + sidebar contextual implementados;
- dashboard principal refeito para não depender de dados fictícios;
- criadas superfícies base para prioridades, indicadores, histórico, missões, soluções, capacidades, conselho e ecossistema;
- backlog expandido com stories UX e fechamento de fluxo;
- Production Waves formalizadas.

## 2026-08-28 — Wave 5 Foundation Acceleration
- selective OSS adoption decision formalized;
- Supabase RLS helper moved to private schema;
- explicit public Data API grants;
- executable pgTAP cross-tenant harness;
- known `companies.name` schema mismatch fixed to `trade_name`;
- consent write fixed to persist required `granted` boolean;
- canonical diagnostic version moved from request-time upsert to migration ownership;
- controlled writes moved behind server-only admin boundary;
- Evidence Ledger added;
- durable Postgres event outbox and atomic lease RPC added;
- Business Fact versioning made atomic;
- deterministic diagnostic result persistence made atomic;
- mission state machine enforced in PostgreSQL;
- Pydantic AI Slim 2.33.0 spike scaffolded outside the main runtime;
- curated security review pack added.

## 2026-08-28 — Wave 6 End-to-End Core
- GDS → Mission RPC + UI;
- safe fallback mission template;
- Mission evidence/outcome flow;
- Timeline closure after outcome;
- plan/subscription model;
- fail-closed provider network policy;
- pain→capability mission projection;
- neutral cross-tenant qualified provider search;
- consented contact requests + outbox event;
- outbox complete/fail primitives;
- real Priorities/Missions/Solutions/Capabilities/Indicators/History/Privacy screens;
- minimal agentic orchestration baseline added with zero new runtime dependency.

- conservative least-privilege RBAC added;
- legacy first-membership `current_tenant_id()` removed;
- sensitive Passport/Evidence access restricted by role;
- audit/tax/referral read access hardened.

## 2026-08-28 — Wave 7 Diagnostic Intelligence & Data Governance
- 144-question library classified by stage/purpose/applicability;
- stable 24-question score anchor set;
- 31-interaction high-yield starter path;
- deterministic adaptive follow-ups;
- progress + confidence thermometer;
- server-derived answer quality signals;
- Unknown/N.A./Deferred semantics;
- structured information slots;
- draft diagnostic resume;
- versioned Data Submission Attestation;
- governed upload-session contract;
- explicit copyright/confidentiality/IP warning;
- explicit statement that user attestation does not transfer GENESIS obligations.

## 2026-08-28 — Wave 8 Genesis Precision Light
- canonical Genesis Precision Light V2 design-system package;
- high-contrast light token refresh;
- contextual route-aware navigation;
- functional mobile drawer;
- Executive Home redesigned around next decision;
- Diagnostic redesigned as focused journey;
- Result redesigned interpretation-first;
- static contrast/design guard;
- Wave 7 backend frozen and hash-verified;
- no new runtime UI dependency.

## 2026-08-28 — Production Foundation Master V1.2
- consolidado todo o histórico Foundation V1 → Wave 8;
- adicionado Production Start Here e Master Index;
- PRD executive contract;
- Production Architecture Blueprint;
- Data/API/Event catalogs;
- 17 grupos de epics e 123 stories consolidadas;
- PW-0→PW-6 de produção;
- GitHub bootstrap para `Aurum-Soltec/genesis360empresarial`;
- PR/issue templates;
- CONTRIBUTING/SECURITY;
- runbooks de environments/releases, backup/restore e incidentes;
- Production Acceptance Matrix e E2E Matrix;
- Work production handoff;
- source package evidence e stack lock;
- nenhum backend/runtime dependency alterado.
