# Production Waves Master

As Waves 0–8 registram a evolução histórica da fundação. As **PW** abaixo são as ondas de execução para transformar a baseline em produção.

## Execução canônica Hosted Staging & Pilot Readiness — 2026-09-20

| Wave | Estado | Resultado objetivo |
|---|---|---|
| HSP-0 — Baseline, repositório e controle remoto | **PASS** | GitHub público organizacional, `main` protegida, PR e CI obrigatórios; commit baseline e correção de headers rastreáveis. |
| HSP-1 — Staging hospedado isolado | **BLOCKED no convite; core PASS** | Supabase/Railway hospedados, migrations 23/23, pgTAP 95/95, browser 10/10 e worker contínuo; convite real bloqueado por SMTP/inbox controlado. |
| HSP-2 — Segurança, observabilidade e recuperação | **BLOCKED; subgates técnicos PASS** | Headers, flags, logs, métricas, GitHub security e restore lógico passaram; paging externo e backup gerenciado/retido não estão disponíveis na solução gratuita atual. |
| HSP-3 — Prova de 100 tenants | **FAIL de performance** | Caminho fim a fim e isolamento passaram sem erro funcional; p95 hospedado excedeu o SLO de 750 ms. |
| HSP-4 — Production Readiness Review hospedado | **CONCLUÍDA — NO-GO** | Relatório reconciliado; piloto e ondas seguintes permanecem não iniciados. |

Próxima sequência aprovada, porém sem autorização de execução nesta etapa:
`PILOT-1 -> SCALE-500 -> V1-F -> SCALE-2000 -> V1-GA -> AGENTIC-1 -> MEMORY-1`.
Nenhuma dessas ondas foi iniciada.

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
