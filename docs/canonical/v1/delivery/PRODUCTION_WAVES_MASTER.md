# Production Waves Master

As Waves 0–8 registram a evolução histórica da fundação. As **PW** abaixo são as ondas de execução para transformar a baseline em produção.

## Rechecagem canônica Hosted Staging & Pilot Readiness — 2026-09-23

A revisão inicial HSP-4 de 20/09 terminou em **NO-GO**. A rechecagem autorizada
permanece aberta no staging isolado. O SHA atual
**8df90d955479ffee98a62b7334faf1a172ec78a5** passou
quality/database/CodeQL e web/worker Railway chegaram a SUCCESS no mesmo
artefato. Os gates operacionais abaixo prevalecem sobre estados históricos
completed e não liberam piloto.

| Wave | Estado | Resultado objetivo |
| --- | --- | --- |
| HSP-0 — Baseline, repositório e controle remoto | **PASS histórico e CI atual PASS** | GitHub organizacional, branch principal protegida, PR/CI; checks do 8df90d9 aprovados. |
| HSP-1 — Staging hospedado isolado | **PASS parcial; onboarding aberto** | Migrations 0001–0024; 0024 RLS 12/12 em SQL com rollback. FULL 55 respostas/relatório no SHA anterior 5e6e836, sem fonte vinculada; fluxo afetado precisa nova prova. Convite em 6737406 passou API, Auth, e-mail, callback, sessão, Tenant A e negação admin; senha definida pelo proprietário, mas novo login após logout pendente. O SHA 8df90d9 corrigiu formulário pré-hidratação e autenticou 10 contas sintéticas no smoke. |
| HSP-2 — Segurança, observabilidade e recuperação | **BLOCKED** | Cinco flags OFF; issue #27 comprovou falha sintética, recuperação, e-mail recebido, ACK humano e fechamento. Comentário de ACK foi sanitizado, com risco residual de cache. Repo privado de backup/immutability/blueprint manual existem, mas sem backup/schedule/restore/RPO/RTO. LGPL libvips carece de disposição final. |
| HSP-3 — Prova de 100 tenants | **FAIL p95; 60 minutos PENDING** | Ensaio histórico teve isolamento funcional e falhou p95. Smoke de 30 s em 8df90d9 visitou 50 tenants, 340 requests, 50 escritas, 10 negações esperadas e 0 erros; p95 login 2164, Home 1326, escrita 1513, leitura 1175 ms contra 750 ms. Soak completo ainda não terminou. |
| HSP-4 — Production Readiness Review hospedado | **RECHECAGEM EM ANDAMENTO — NO-GO vigente** | Backup/recuperação, LGPL, SLO 100 tenants e provas afetadas pendentes. Produção aberta e piloto não autorizados. |

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
