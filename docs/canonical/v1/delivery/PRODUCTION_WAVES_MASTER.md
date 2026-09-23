# Production Waves Master

As Waves 0–8 registram a evolução histórica da fundação. As **PW** abaixo são as ondas de execução para transformar a baseline em produção.

## Rechecagem canônica Hosted Staging & Pilot Readiness — 2026-09-23

A revisão inicial HSP-4 de 20/09 terminou em **NO-GO**. A rechecagem autorizada
está em andamento no staging isolado. O candidato exato
`fe0e5b4583d98bf9985bf247c5976a367fc3b3e9` passou quality/database/CodeQL
e tem web e worker Railway em `SUCCESS`; isso não aprova os gates operacionais
restantes. O relatório A–T da rechecagem precisa declarar GO ou NO-GO apenas
após avaliar todas as provas exigidas.

| Wave | Estado | Resultado objetivo |
|---|---|---|
| HSP-0 — Baseline, repositório e controle remoto | **PASS histórico** | GitHub público organizacional, `main` protegida, PR e CI obrigatórios; CI do SHA atual também passou. |
| HSP-1 — Staging hospedado isolado | **BLOCKED no callback do convite; core parcial PASS** | Migrações `0001`–`0024` presentes; RLS hospedada de `0024` passou 12/12 assertions SQL com rollback; FULL no SHA anterior `5e6e836` gerou 55 respostas e relatório. O fluxo afetado precisa de rechecagem no SHA final. Os 95/95 pgTAP e 10/10 browser são evidências históricas. No SHA final, convite HTTP 201, usuário Auth criado, membership `member` somente no Tenant A, audit e e-mail recebido passaram; o link abriu a raiz com fragmento implícito, sem sessão app nem tela de senha. Callback E2E falhou. |
| HSP-2 — Segurança, observabilidade e recuperação | **BLOCKED** | Flags, logs e restore lógico históricos; issue #27 registrou simulação e recuperação, mas não houve entrega de notificação nem ACK humano. Backup automático retido, restore representativo/RPO real e disposição do LGPL `libvips` no SBOM CI Linux (455 entradas) seguem pendentes. |
| HSP-3 — Prova de 100 tenants | **FAIL histórico; nova execução PENDING** | O ensaio anterior de 60 minutos preservou isolamento e zero erro funcional, mas p95 excedeu 750 ms. A fixture privada temporária foi reconstituída; pré-checagem read-only confirmou 10/10 contas, 100/100 tenants e vínculos. Login real e novo soak no SHA final ainda não foram executados. |
| HSP-4 — Production Readiness Review hospedado | **RECHECAGEM EM ANDAMENTO — NO-GO vigente** | O NO-GO de 20/09 continua até convite, recuperação, alertas, licenças e carga atingirem critérios objetivos. Piloto e ondas seguintes não foram iniciados. |

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
