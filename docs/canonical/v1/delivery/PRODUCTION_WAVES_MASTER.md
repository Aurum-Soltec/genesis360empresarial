# Production Waves Master

As Waves 0–8 registram a evolução histórica da fundação. As **PW** abaixo são as ondas de execução para transformar a baseline em produção.

## Rechecagem canônica Hosted Staging & Pilot Readiness — 2026-09-24 UTC

A revisão inicial HSP-4 de 20/09 terminou em **NO-GO**. A revisão corretiva de
24/09 continua **NO-GO** no staging isolado. O PR #25 foi integrado em
`31df6086cb612886dc5db4a45b946ea80dde2cf1`; quality/database/CodeQL/
Analyze passaram, e web/worker Railway chegaram a SUCCESS nesse mesmo SHA.
O smoke autenticado/negativas anônimas é limitado. Os testes integrais de
isolamento, diagnóstico FULL, outbox e 100 empresas/60 minutos pertencem ao
SHA anterior `bb290bc7bc35f77b4ca01aecdbf19b748c386270` e não foram
repetidos no novo. Os gates abaixo prevalecem sobre estados históricos
completed e não liberam piloto. Evidência atual: `docs/audit-2026-09-24/HSP4_CORRECTIVE_GO_NO_GO_2026-09-24.md`.

| Wave | Estado | Resultado objetivo |
| --- | --- | --- |
| HSP-0 — Baseline, repositório e controle remoto | **PASS histórico; CI/deploy corretivo PASS** | GitHub organizacional, branch principal protegida, PR/CI; último commit com código `6d4d569` no PR #25 passou `pnpm quality` local com 506 Vitest/34 nativos. O merge `31df6086` passou checks finais e web/worker no mesmo SHA chegaram a SUCCESS. |
| HSP-1 — Staging hospedado isolado | **PASS limitado do smoke/novo login; FULL corrigido e multi-role no SHA atual PENDING** | Migrations 0001–0024; 0024 RLS 12/12 SQL e 12/12 HTTP multi-role no `bb290bc` histórico. No `31df6086`, negativas anônimas e UI autenticada Tenant A/Passport/admin/demo/relatório existentes passaram; demo 6/7 com zero fontes vinculadas/verificadas. Convite/e-mail/callback e novo login da conta convidada com somente Tenant A passaram. Reteste automatizado do roteiro corrigido antes da promoção autenticou duas contas, mas o runner não escolheu tenant nem escreveu; UI posterior mostrou Tenant A para uma delas, causa indeterminada. |
| HSP-2 — Segurança, observabilidade e recuperação | **BLOCKED; subprova manual de backup v2 PASS** | Cinco flags OFF; issue #27 comprovou alerta por e-mail, ACK e recuperação. Backup privado v2 run 36002104320: release cifrada imutável, 129 entradas ACL no arquivo, restore lógico isolado de 102 tenants/16 Auth/24 migrations em 77,450 s após download. PR #7 do cron guardado integrada no SHA privado 051a76d, porém variáveis de ativação ausentes mantêm schedule OFF; PR #6 do scaffold de restore de serviço integrada no SHA 10214da, 34 testes locais PASS e um symlink SKIP no Windows, sem restore executado. Não há equivalência de ACL/owner restaurada, serviço recuperado, backup agendado, 30 dias, RPO/RTO ou chave independente. Orçamento GitHub Actions US$0/Stop usage confirmado, com risco de esgotar minutos. Licença ainda BLOCKED: CI Linux do 40b9b82 separou 9/30 itens na árvore de produção, sem bytes Railway/decisão LGPL/CC-BY. |
| HSP-3 — Prova de 100 tenants | **PASS histórico de duração/isolamento/outbox; FAIL p95; novo SHA PENDING** | Primeiro run `bb290bc` terminou aos 998 s com 10 erros. Retry no mesmo runtime, run `662855c2dbd5`: 3.604 s, 100/100 tenants, 24.512 requests, 5.806 escritas, 584 negativas esperadas, zero erro inesperado; outbox 5.806 processados e zero pending/dead/retries. p95 login 1.964,5, Home 1.055,48, escrita 1.024,5 e leitura 793,8 ms >750 ms. Instrumentação numérica agora implantada no `31df6086`, sem nova medição hospedada ou correção. |
| HSP-4 — Production Readiness Review hospedado | **NO-GO; revisão após promoção** | Novo login convidado e smoke limitado passaram. Matriz de isolamento/FULL corrigido/carga no SHA atual ainda pendentes; p95 histórico FAIL; backup automático/restore de serviço/ACL/RPO-RTO e licença continuam BLOCKED. Documento real fundamentando conclusão permanece pending sob flag OFF, sem promover demo sintética a fato. Produção aberta e piloto não autorizados. |

Sequência aprovada, mas **sem autorização de execução** nesta etapa:
PILOT-1 → SCALE-500 → V1-F → SCALE-2000 → V1-GA → AGENTIC-1 → MEMORY-1.
Nenhuma dessas Waves foi iniciada.

## Histórico consolidado
- Wave 0 — tenancy/consent;
- Wave 1 — Business Passport;
- Wave 2 — Diagnostic Engine;
- Wave 3 — Diagnostic UX/GDS;
- Wave 4 — Missions/Qualification foundation;
- Wave 5 — hardening/selective OSS;
- Wave 6 — end-to-end core;
- Wave 7 — Diagnostic Intelligence/Data Governance;
- Wave 8 — Genesis Precision Light V2.

## PW-0 — Repository & Foundation Verification — P0
Stories:
ST-104, 105, 106, 107.

Objetivo:
- colocar baseline no novo GitHub;
- provar migrations;
- provar pgTAP;
- provar lint/typecheck/test/build.

**Exit gate:** `GATE-FOUNDATION = PASS`.

## PW-1 — Security, Recovery & Environments — P0
Stories:
ST-109, 110, 111, 112, 113.

Objetivo:
- cross-tenant adversarial;
- restore/rollback;
- scans/SBOM;
- observabilidade;
- dev/staging/prod.

**Exit gate:** `GATE-SEC + GATE-OPS = PASS`.

## PW-2 — Canonical UX Runtime Validation — P0
Stories:
ST-101, 108, 121.

Objetivo:
- browser validate Home/Diagnostic/Result;
- executar happy path;
- migrar superfícies restantes somente depois da aprovação canônica.

**Exit gate:** `GATE-UX = PASS`.

## PW-3 — Sensitive Feature Activation — P0/P1
Stories:
ST-114, 115, 116, 117, 118, 119.

Objetivo:
- legal attestation;
- upload pipeline;
- qualification thresholds/methodology;
- provider eligibility;
- confidence/sector calibration.

**Exit gate:** features saem do fail-closed somente com decisões aprovadas.

## PW-4 — Agentic Decision — P1
Story:
ST-120.

Objetivo:
comparar Minimal Genesis vs Pydantic AI Slim com mesmo modelo/prompt/tools/evals.

**Exit gate:** adotar framework somente se reduzir complexidade total.

## PW-5 — Release Candidate & Pilot — P0
Stories:
ST-122, 123.

Objetivo:
- Production Readiness Review;
- staging freeze;
- pilot cohort;
- canary/rollback;
- evidence collection.

**Exit gate:** release candidate autorizado.

## PW-6 — Production General Availability
Não abrir antes de:
- SLO/alerting;
- restore comprovado;
- segurança;
- LGPD/legal;
- E2E;
- cost budget;
- incident response;
- rollback.
