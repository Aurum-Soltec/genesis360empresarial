# Production Waves Master

As Waves 0–8 registram a evolução histórica da fundação. As **PW** abaixo são as ondas de execução para transformar a baseline em produção.

## Rechecagem canônica Hosted Staging & Pilot Readiness — 2026-09-24 UTC

A revisão inicial HSP-4 de 20/09 terminou em **NO-GO**. A revisão corretiva de
24/09 continua **NO-GO** no staging isolado. O artefato funcional sob prova
**bb290bc7bc35f77b4ca01aecdbf19b748c386270** passou
quality/database/CodeQL e web/worker Railway chegaram a SUCCESS no mesmo
artefato. Os gates operacionais abaixo prevalecem sobre estados históricos
completed e não liberam piloto. Evidência atual: `docs/audit-2026-09-24/HSP4_CORRECTIVE_GO_NO_GO_2026-09-24.md`.

| Wave | Estado | Resultado objetivo |
| --- | --- | --- |
| HSP-0 — Baseline, repositório e controle remoto | **PASS histórico e CI do artefato PASS** | GitHub organizacional, branch principal protegida, PR/CI; checks de bb290bc e do ajuste posterior do harness em dc9c124 aprovados. O runtime funcional sob ensaio é bb290bc. |
| HSP-1 — Staging hospedado isolado | **PASS para Auth/fluxo; documentação real pending** | Migrations 0001–0024; 0024 RLS 12/12 SQL e 12/12 HTTP multi-role no bb290bc. FULL 55 respostas, score 48 e relatório, com zero fontes vinculadas/verificadas. Convite/e-mail/callback passaram; novo login por senha da conta convidada e somente Tenant A foram corroborados em 24/09. |
| HSP-2 — Segurança, observabilidade e recuperação | **BLOCKED; subprova manual de backup v2 PASS** | Cinco flags OFF; issue #27 comprovou alerta por e-mail, ACK e recuperação. Backup privado v2 run 36002104320: release cifrada imutável, 129 entradas ACL no arquivo, restore lógico isolado de 102 tenants/16 Auth/24 migrations em 77,450 s após download. Não há equivalência de ACL/owner restaurada, serviço recuperado, schedule, 30 dias, RPO/RTO ou chave independente. Orçamento GitHub Actions US$0/Stop usage confirmado, com risco de esgotar minutos. Licença ainda BLOCKED: 9/30 itens na árvore de produção local, sem bytes Railway/decisão LGPL/CC-BY. |
| HSP-3 — Prova de 100 tenants | **PASS de duração/isolamento/outbox; FAIL p95** | Primeiro run bb290bc terminou aos 998 s com 10 erros. Retry no mesmo runtime, run 662855c2dbd5: 3.604 s, 100/100 tenants, 24.512 requests, 5.806 escritas, 584 negativas esperadas, zero erro inesperado; outbox 5.806 processados e zero pending/dead/retries. p95 login 1.964,5, Home 1.055,48, escrita 1.024,5 e leitura 793,8 ms >750 ms. Railway Virgínia/Supabase São Paulo comprovados, causalidade não quantificada. |
| HSP-4 — Production Readiness Review hospedado | **NO-GO; revisão corretiva** | Novo login convidado passou. p95 continua FAIL; backup automático/restore de serviço/ACL/RPO-RTO e licença continuam BLOCKED. Documento real fundamentando conclusão permanece pending sob flag OFF, sem promover demo sintética a fato. Produção aberta e piloto não autorizados. |

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
