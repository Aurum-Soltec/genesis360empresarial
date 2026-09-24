# PRODUCTION WAVES

> **Atualização operacional — 2026-09-24 UTC:** este mapa PW permanece histórico.
> Web e worker do staging receberam por CLI fonte local limpa `6dff3c9` e
> terminaram SUCCESS com digests; Railway `meta.commitHash=null` limita a
> atestação nativa do SHA. A demo
> fictícia 7/7 foi observada no predecessor `5b992d3`. O último soak de
> 100 tenants por 60 minutos concluiu sem erro funcional, mas falhou no p95.
> SQL 0024 **PASS limitado ao workflow privado** pinado à fonte atual no run
> `36035020570`, sem leitura independente do JSON; HTTP multi-role, backup de serviço/RPO-RTO,
> retenção e licença final continuam pendentes ou bloqueados. A decisão é
> **HSP-4 NO-GO**. Estado vigente: `PRODUCTION_WAVES_MASTER.md` e
> `../../../audit-2026-09-24/HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md`.
> Nenhuma Wave após HSP-4 começou. A cópia privada cifrada e o restore lógico
> isolado passaram como subprova manual; o gate de recuperação continua BLOCKED
> por agendamento, retenção, equivalência de permissões e RPO/RTO de serviço.
> A inspeção read-only foi repetida no SHA `25c022d8` para os 30 pacotes;
> as imagens novas ainda requerem vínculo de licença ao artefato exato. NOTICE
> e decisão LGPL/CC-BY/MPL permanecem BLOCKED. O vínculo contextual da demo
> passou no `5b992d3`; instrumentação da Home enviada como `6dff3c9` ainda
> não mostrou evento `home_latency` filtrado e não prova SLO.
> A PR privada #11/run `36020411581` passou somente boot/saúde de stack
> sintética vazia, isolada em loopback no runner Ubuntu; 120 s não são RTO.
> Restore real, RPO/RTO, agendamento e retenção seguem BLOCKED.

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
