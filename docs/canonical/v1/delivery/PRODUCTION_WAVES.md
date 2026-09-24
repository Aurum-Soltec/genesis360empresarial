# PRODUCTION WAVES

> **Atualização operacional — 2026-09-24 UTC:** este mapa `PW-*` permanece
> histórico. O estado vigente da etapa Hosted Staging & Pilot Readiness é
> `PRODUCTION_WAVES_MASTER.md` e
> `../../../audit-2026-09-24/HSP4_CURRENT_REVIEW_458AAC9_2026-09-24.md`.
> Web e worker do staging receberam a fonte limpa `458aac9` e terminaram
> SUCCESS com digests; Railway `meta.commitHash=null` não atesta nativamente o
> SHA. A matriz HTTP membro/gestor/outro tenant passou 12 verificações
> fail-fast no workflow privado, com crédito limitado porque o artefato não foi
> inspecionado independentemente. O ensaio de 100 tenants por 60 minutos ainda
> falhou p95 ≤750 ms. Backup automático, restore real, retenção, RPO/RTO e
> licenças finais não receberam PASS. **HSP-4 NO-GO.** Nenhuma Wave posterior
> foi iniciada. Resultados anteriores abaixo conservam caráter histórico.

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
