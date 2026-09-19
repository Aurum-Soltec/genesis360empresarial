# PRODUCTION WAVES

As Waves 0-4 existentes representam evolução histórica da fundação. A partir deste pacote, usar identificadores `PW-*` para produção.

## PW-0 - Foundation Verification
Objetivo: transformar contratos implementados em evidência runtime.

Saída:
- migrations;
- CI;
- RLS A->B;
- auth/session;
- consent;
- restore.

## PW-1 - Product Shell & Manager Dashboard
- light design system;
- topbar/sidebar;
- dashboard manager-first;
- empty/error/loading;
- responsive/a11y.

## PW-2 - Passport & Diagnostic Production
- Passport UX;
- progressive profiling;
- diagnostic applicability;
- diagnosis UX;
- evidence enrichment.

## PW-3 - Decision & Mission
- cause validation;
- GDS UX;
- Mission Library;
- mission state/evidence/outcomes;
- gamification.

## PW-4 - Qualification Network
- capability taxonomy;
- qualification;
- entitlement;
- eligibility/ranking;
- solution UI;
- consented contact.

## PW-5 - Agentic
- Agno vs simple runtime spike;
- context assembly;
- tools;
- budgets;
- Council Genesis;
- evals;
- kill switch.

## PW-6 - Ecosystem
- ecosystem domain;
- branding/config;
- aggregated dashboard;
- suppression/privacy;
- institutional pilot.

## PW-7 - Production Go-Live
- load/performance;
- security review;
- observability;
- FinOps;
- E2E;
- production readiness review.

## PW-0A — Foundation Acceleration (2026-08-28)

Implementação preparada:
- ST-065 private RLS/grants;
- ST-066 pgTAP harness;
- ST-067 Evidence Ledger;
- ST-068 Outbox;
- ST-069 trusted write boundary;
- ST-071 security pack.

**Para fechar:** executar local Supabase/CI e anexar evidência.

## PW-5A — Agentic Spike

Executar ST-070 somente depois do core deterministic runtime estar verde.
Pydantic AI Slim compete com wrapper mínimo; Agno é fallback.

## PW-3A / PW-4A — End-to-End Core

Wave 6 fecha a plumbing de:
- Decision/Mission;
- Mission/Outcome;
- Capability/Qualification;
- Consented Contact.

Ela não fecha metodologia comercial ainda:
PEND-003/004/005/006 continuam bloqueando ativação real da rede.

## PW-5A update
O spike agora possui baseline sem framework.
Pydantic AI Slim precisa vencer essa baseline para ser adotado.
