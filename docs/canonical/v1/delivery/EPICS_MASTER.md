# EPICS MASTER — Genesis 360 Empresarial V1.2

**Status:** baseline de produção

## EPIC-01 Foundation & Canonical
**Objetivo:** Fundação, tenancy, consentimento e autoridade documental.
**Exit gate:** Tenant explícito, RLS e docs canônicos verificadas em runtime.
**Stories:** 5

- `V1-ST-001` — Canonical docs — **implemented**
- `V1-ST-002` — Feature flags — **implemented**
- `V1-ST-003` — Auth/tenant active — **implemented-runtime-partial-browser-e2e-pending**
- `V1-ST-004` — Cross-tenant RLS — **implemented-runtime-verified**
- `V1-ST-005` — Consent purposes — **implemented-legal-ux-pending**

## EPIC-02 Business Passport
**Objetivo:** Perfil empresarial vivo com provenance, sensibilidade e Timeline.
**Exit gate:** Facts versionados, timeline e progressive profiling funcionando sem falsificar verificação.
**Stories:** 4

- `V1-ST-006` — Business facts/provenance — **implemented**
- `V1-ST-007` — Timeline — **implemented**
- `V1-ST-008` — Passport UI — **implemented**
- `V1-ST-009` — Progressive profiling — **partial**

## EPIC-03 Diagnostic
**Objetivo:** Diagnóstico determinístico, versionado e retomável.
**Exit gate:** Score/coverage/confidence reais, path válido e submit atômico.
**Stories:** 5

- `V1-ST-010` — Question bank/versioning — **implemented**
- `V1-ST-011` — Applicability/branching — **partial-methodology-pending**
- `V1-ST-012` — Session/autosave/resume — **implemented**
- `V1-ST-013` — Rules Engine — **implemented**
- `V1-ST-014` — Result/pain/evidence — **implemented-foundation**

## EPIC-04 Decision/GDS
**Objetivo:** Transformar findings em decisão estruturada e verificável.
**Exit gate:** GDS idempotente, evidência/gaps explícitos e próxima missão rastreável.
**Stories:** 3

- `V1-ST-015` — Pain Finding — **implemented**
- `V1-ST-016` — Cause hypotheses — **implemented-schema**
- `V1-ST-017` — Decision Record/GDS — **implemented**

## EPIC-05 Mission
**Objetivo:** Converter decisão em execução mensurável.
**Exit gate:** State machine, evidência, outcome e Timeline fechando o loop.
**Stories:** 5

- `V1-ST-018` — Mission Library — **partial-library**
- `V1-ST-019` — State machine — **implemented**
- `V1-ST-020` — Evidence — **implemented**
- `V1-ST-021` — Outcomes — **implemented**
- `V1-ST-022` — Gamification — **partial**

## EPIC-06 Qualification
**Objetivo:** Rede de soluções qualificada e comercialmente neutra.
**Exit gate:** Eligibility/ranking fail-closed, provider sem autoqualificação e consented contact.
**Stories:** 8

- `V1-ST-023` — Pain->capability taxonomy — **pending-methodology**
- `V1-ST-024` — Provider capabilities — **implemented-schema**
- `V1-ST-025` — Qualification/recertification — **pending-methodology**
- `V1-ST-026` — Entitlements — **implemented-policy-pending**
- `V1-ST-027` — Eligibility — **implemented**
- `V1-ST-028` — Neutral ranking — **implemented**
- `V1-ST-029` — Qualified solution UI — **implemented**
- `V1-ST-030` — Consented contact/attribution — **partial-contact-implemented-attribution-pending**

## EPIC-07 Agentic
**Objetivo:** Conselho Genesis com IA controlada e auditável.
**Exit gate:** Runtime escolhido por spike, ACL/tool budgets/evals e kill switch.
**Stories:** 6

- `V1-ST-031` — Runtime spike — **spike-scaffolded-not-run**
- `V1-ST-032` — Context assembly — **partial**
- `V1-ST-033` — Council routing — **pending**
- `V1-ST-034` — Tool contracts — **partial-read-tools**
- `V1-ST-035` — Budgets/fallback/kill switch — **pending**
- `V1-ST-036` — Golden set/evals — **seeded-not-run**

## EPIC-08 Ecosystem
**Objetivo:** Camada institucional para associações e redes.
**Exit gate:** Membership/configuração/analytics agregados sem fork de produto.
**Stories:** 3

- `V1-ST-037` — Ecosystem membership — **pending**
- `V1-ST-038` — Institutional branding — **pending**
- `V1-ST-039` — Aggregated dashboard — **pending**

## EPIC-09 Trust/Data/Admin
**Objetivo:** Governança de dados, admin, auditoria, LGPD e benchmark.
**Exit gate:** Policies, lifecycle, audit e quality guardrails comprovados.
**Stories:** 5

- `V1-ST-040` — Admin/rules/qualification — **pending**
- `V1-ST-041` — Audit/correlation — **partial**
- `V1-ST-042` — LGPD lifecycle — **partial**
- `V1-ST-043` — Data quality/provenance — **implemented-foundation**
- `V1-ST-044` — Benchmark guardrails — **pending**

## EPIC-10 Production
**Objetivo:** Operabilidade, segurança, performance e release.
**Exit gate:** CI/CD, observabilidade, backup/restore, E2E e PRR verdes.
**Stories:** 8

- `V1-ST-045` — Observability — **pending**
- `V1-ST-046` — Backup/restore/rollback — **pending-blocker**
- `V1-ST-047` — Security/supply-chain — **partial**
- `V1-ST-048` — CI/CD/environments — **baseline-existing**
- `V1-ST-049` — Performance/a11y — **partial**
- `V1-ST-050` — FinOps — **docs-only**
- `V1-ST-051` — E2E — **partial-db-e2e-browser-pending**
- `V1-ST-052` — Production Readiness Review — **pending-blocker**

## EPIC-11 UX Light / Taste
**Objetivo:** Migrar UX inicial para linguagem clara, acessível e consistente.
**Exit gate:** Navegação, estados, acessibilidade e visual baseline.
**Stories:** 7

- `V1-ST-053` — Light theme migration — **implemented** — P0
- `V1-ST-054` — Topbar + Context Sidebar — **implemented** — P0
- `V1-ST-055` — Manager Dashboard — **implemented** — P0
- `V1-ST-056` — Product empty/error/loading states — **partial** — P0
- `V1-ST-057` — Accessibility visual gate — **runtime-pending** — P0
- `V1-ST-058` — Motion system — **partial** — P1
- `V1-ST-059` — Visual regression — **pending** — P1

## EPIC-12 Product Flow Completion
**Objetivo:** Fechar o ciclo GDS→Mission→Capability→Provider→Outcome.
**Exit gate:** Fluxo vertical sem mocks e com contratos reais.
**Stories:** 5

- `V1-ST-060` — GDS -> Mission creation — **implemented** — P0
- `V1-ST-061` — Mission -> Capability recommendation — **implemented-taxonomy-pending** — P0
- `V1-ST-062` — Qualified provider search API — **implemented-fail-closed** — P0
- `V1-ST-063` — Contact consent workflow — **implemented-legal-copy-pending** — P0
- `V1-ST-064` — Outcome closes Passport/Timeline loop — **implemented-timeline-passport-explicit-only** — P0

## EPIC-13 — Foundation Acceleration / Selective OSS
**Objetivo:** Acelerar fundação apenas com OSS que reduza complexidade total.
**Exit gate:** Due diligence, spikes e adoções seletivas documentadas.
**Stories:** 12

- `V1-ST-065` — Private RLS helper + explicit grants — **implemented** — P0
- `V1-ST-066` — Cross-tenant pgTAP harness — **implemented-runtime-verified** — P0
- `V1-ST-067` — Evidence Ledger — **implemented** — P0
- `V1-ST-068` — Durable event outbox — **implemented** — P1
- `V1-ST-069` — Trusted server write boundary — **implemented** — P0
- `V1-ST-070` — Pydantic AI Slim spike — **spike-scaffolded-not-run** — P1
- `V1-ST-071` — Curated DevSecOps skill gates — **implemented** — P1
- `V1-ST-072` — Provider Network Policy:** IMPLEMENTED; threshold permanece PEND-003. — **implemented-threshold-pending**
- `V1-ST-073` — Subscription/Plan Gate:** IMPLEMENTED; provider plans permanecem PEND-004. — **implemented-plan-decision-pending**
- `V1-ST-074` — Cross-Tenant Sanitized Matching:** IMPLEMENTED. — **implemented**
- `V1-ST-075` — Outbox Completion/Retry:** IMPLEMENTED. — **implemented**
- `V1-ST-076` — Minimal Agentic Baseline:** IMPLEMENTED for comparison. — **implemented**

## EPIC-14/15 Wave 7
**Objetivo:** Diagnóstico adaptativo + Data Submission Governance.
**Exit gate:** 144 como biblioteca, score estável, confidence e upload governado fail-closed.
**Stories:** 17

- `V1-ST-077` — Question metadata/purpose/applicability — **implemented-by-contract** — P1
- `V1-ST-078` — Stable 24-anchor score — **implemented-by-contract** — P1
- `V1-ST-079` — 31-question high-yield starter path — **implemented-by-contract** — P1
- `V1-ST-080` — Adaptive follow-up selector — **implemented-by-contract** — P1
- `V1-ST-081` — Progress Engine — **implemented-by-contract** — P1
- `V1-ST-082` — Confidence Thermometer — **implemented-by-contract** — P1
- `V1-ST-083` — Structured information slots — **implemented-foundation** — P1
- `V1-ST-084` — Unknown/N.A./Deferred semantics — **implemented-by-contract** — P1
- `V1-ST-085` — Diagnostic resume/idempotent draft — **implemented-by-contract** — P1
- `V1-ST-086` — Sector/trait applicability calibration — **calibration-pending** — P1
- `V1-ST-087` — Versioned attestation model — **implemented-by-contract** — P1
- `V1-ST-088` — Auditable acceptance event — **implemented-by-contract** — P1
- `V1-ST-089` — Governed upload session — **implemented-foundation** — P1
- `V1-ST-090` — Copyright/confidentiality/IP warning — **draft-copy** — P1
- `V1-ST-091` — GENESIS responsibility disclaimer — **draft-copy** — P1
- `V1-ST-092` — Legal/privacy review — **p0-blocker** — P0
- `V1-ST-093` — Binary upload security pipeline — **p0-blocker** — P0

## EPIC-16 Genesis Precision Light
**Objetivo:** Fixar linguagem premium e jornada executiva.
**Exit gate:** 3 telas canônicas aprovadas no browser e design system sem drift.
**Stories:** 10

- `V1-ST-094` — Portable Design System package — **implemented** — P1
- `V1-ST-095` — Route-aware contextual navigation — **implemented** — P1
- `V1-ST-096` — Functional mobile drawer — **implemented-static-verified** — P1
- `V1-ST-097` — Executive Home redesign — **implemented** — P1
- `V1-ST-098` — Focused Diagnostic redesign — **implemented** — P1
- `V1-ST-099` — Interpretation-first Result redesign — **implemented** — P1
- `V1-ST-100` — Accessibility/contrast static gate — **implemented** — P1
- `V1-ST-101` — Browser visual/accessibility validation — **completed-local-critical-flows** — P0
- `V1-ST-102` — Visual regression baseline — **partial-local-baseline-full-suite-pending** — P1
- `V1-ST-103` — Remaining surface migration — **p1-after-canonical-approval** — P1

## EPIC-17 Production Readiness & Repository
**Objetivo:** Transformar a fundação implementada por contrato em release candidate comprovada.
**Exit gate:** Repo bootstrap, runtime gates, restore, security, E2E e PRR aprovados.
**Stories:** 12
**Estado canônico HSP-4, fonte `458aac9` enviada ao staging (2026-09-24 UTC): NO-GO.** PR #33/CI PASS e merge `458aac964d1f9a7016ac1804fe99d68637a3c0b8`; web `65ede85d-f918-4ccf-b161-a9396d6c702a` e worker `8e460f0f-4c6b-4506-b490-90682b5b1b4d` SUCCESS de worktree limpa detached. `/api/ops/home-timing` negou anônimo com 401, mas a navegação direta autenticada foi bloqueada no navegador (`ERR_BLOCKED_BY_CLIENT`); run privado posterior `36063913391`/backstop `36064075371` SUCCESS validou 16/16 amostras em fixture escassa sem pains (total p50/p95 799,01/1.337,44 ms), sem crédito ao p95 de 100×60 ou causa definitiva. HTTP multi-role run privado `36062309891` e backstop `36062480126` SUCCESS no claim `458aac9`, 12/12 inferidos de runner fail-fast sem inspeção independente do artefato sanitizado; cinco flags visualmente DESLIGADA após reload autenticado e `/ecossistema` 404, sem env bruto; FULL e worker/outbox no SHA atual seguem pendentes; PR privada #22/run sintético `36063130004` SUCCESS observou 3 Auth, 2 tenants, 24 migrations e 4 outbox processados, mas `storage_bytes_restored_from_backup=false`; 188,167 s até worker não é RTO e cron permanece OFF. Backup operacional, NOTICE e SLO seguem bloqueados/reprovados. Evidência: `docs/audit-2026-09-24/HSP4_CURRENT_REVIEW_458AAC9_2026-09-24.md`.

**Registro histórico HSP-4, fonte `6dff3c9` enviada ao staging (2026-09-24 UTC): NO-GO.** PRs #30/#31/#32 integrados e CI PASS; uploads CLI da fonte local limpa chegaram a SUCCESS em web `2e2690bd` e worker `56740353`, com digests, mas `meta.commitHash=null` no Railway limita a atestação nativa do commit. FULL fictício 52 respostas/cockpit 7/7 passou no predecessor `5b992d3`, sem documento real. SQL-only 0024 passou nos workflows privados `36031065644` (`ff864213`) e `36035020570` (fonte `6dff3c9`), exigindo 12 casos/rollback; JSON privado não lido pelo agente. HTTP membro/gestor/outro tenant permanece pendente. Dois GETs autenticados da Home retornaram 200 em 2.287/14 ms, sem evento `home_latency` filtrado; falta medição causal. A última carga 100×60 falhou p95 ≤750 ms. Source→target sintético passou sem staging real; backup automático/restore de serviço/RPO-RTO, alerta específico com ACK, NOTICE/decisão jurídica e inspeção OSS da nova imagem seguem BLOCKED/PENDING. `V1-ST-110`, `V1-ST-111` e `V1-ST-122` continuam abertos; `V1-ST-123` não começou. Evidência histórica: `docs/audit-2026-09-24/HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md`.

**Registro histórico HSP-4 no staging SHA `ff864213` (2026-09-24 UTC): NO-GO.** PR #30 vinculou as três fontes fictícias como contexto e um FULL hospedado no `5b992d3` concluiu 52 respostas, score 51, confiança 78%, zero fontes verificadas e cockpit 7/7. PR #31 integrou instrumentação da Home e o SHA `ff864213` foi indicado para web/worker do staging; faltavam spans hospedados e repetição dos gates afetados. O PR #32 passou CI e foi integrado no main `6dff3c9`, ainda não promovido **naquele momento**. A migration 0024 passou historicamente 12/12 SQL e 12/12 HTTP multi-role no `bb290bc`; no SHA `ff864213` o SQL-only passou pelo workflow privado fail-closed `36031065644` (JSON privado não inspecionado pelo agente), mas HTTP multi-role pendia. A última carga 100×60 falhou p95 ≤750 ms. Backup de serviço/automação/RPO-RTO, NOTICE/decisão jurídica e inspeção OSS no SHA exato seguiam BLOCKED/PENDING. O ensaio source→target sintético `36030761200` passou, sem credenciais/backup do staging e sem crédito de restore real ou RPO/RTO.

**Registro histórico no SHA `31df6086`:** O PR #25 foi integrado em `31df6086cb612886dc5db4a45b946ea80dde2cf1`; CI final quality/database/CodeQL/Analyze e web/worker Railway no mesmo SHA passaram. O smoke hospedado observou negativas anônimas, Tenant A autenticado, administração/Passport/Documentos/demo/relatório existentes e quatro destinos superiores. A demo marcou 6/7 etapas porque três fontes fictícias estavam registradas mas zero vinculadas/verificadas. O login convidado passou. FULL corrigido, 0024 SQL/HTTP multi-role e 100 empresas/60 min não foram repetidos nesse SHA; a carga integral anterior falhou p95 ≤750 ms. Backup v2 manual e restore lógico foram subprovas, sem backup automático, restore de serviço, equivalência ACL/owner, RPO/RTO, retenção ou chave independente. A comparação read-only de 30/30 pacotes em web/worker com o CI Linux do mesmo SHA passou tecnicamente; NOTICE e disposição LGPL/CC-BY/MPL permaneceram pendentes. O runner sintético anterior autenticou duas contas sem escolher tenant, enquanto a UI posterior encontrou Tenant A para uma delas; causa não provada. Detalhe histórico: `docs/audit-2026-09-24/HSP4_CORRECTIVE_GO_NO_GO_2026-09-24.md`.

**Subprova posterior em EPIC-17:** PR privada #11/run `36020411581` passou
boot/saúde de stack sintética vazia em Ubuntu, com identidade de serviços,
binds em loopback e cleanup. Não restaurou dados, não mediu RPO/RTO e não
altera `V1-ST-110` ou a decisão NO-GO. Evidência:
`docs/audit-2026-09-24/HSP4_PRIVATE_SYNTHETIC_STACK_BOOT_2026-09-24.md`.

**Registro da rechecagem anterior HSP-4 (histórico, 2026-09-24 UTC): NO-GO.** O SHA funcional
bb290bc7bc35f77b4ca01aecdbf19b748c386270 passou CI e web/worker
Railway SUCCESS. A migration 0024 passou 12/12 SQL e 12/12 HTTP multi-role;
o FULL de 55 respostas e relatório foi repetido, ainda com zero documentos
vinculados/verificados. Convite/e-mail/callback/sessão/Tenant A passaram e o
proprietário confirmou senha e acesso, mas falta logout seguido de novo login.
A issue #27 comprovou e-mail, ACK humano e recuperação. Backup privado run
35945384891 passou release cifrada imutável e restore lógico isolado de 102
tenants/16 Auth/24 migrations em 37,476 s local; não é RTO de serviço. O export v1 suprimiu ACL por `--no-privileges`, e o restore v1 pulou owners/ACLs; `pg_dump --no-owner` não elimina owner em arquivo customizado. Seguem risco estrutural e falta de agendamento,
30 dias de retenção, RPO/RTO de serviço, guarda independente da chave e
decisão de equivalência. Scanner CI do candidato posterior 0c6dc1a deixou 30
itens, incluindo LGPL, sem disposição do artefato hospedado. O primeiro run
de carga encerrou aos 998 s com dez erros; retry `662855c2dbd5` concluiu
**3.604 s**, 100/100 tenants, 24.512 requests, 5.806 escritas, 584 negações
esperadas, zero erro inesperado. Outbox 5.806 processados, zero pending/dead/
retries, worker p95 3.476,20 ms. Duração, isolamento sintético e outbox
passaram; p95 login 1.964,5 ms, Home 1.055,48 ms, escrita 1.024,5 ms e
leitura 793,8 ms falharam contra 750 ms. Railway Virgínia/Supabase São Paulo
foi comprovado, sem contribuição causal quantificada. PILOT-1 não começou.
- `V1-ST-104` — Bootstrap do novo repositório GitHub — **completed-remote-repository** — P0
- `V1-ST-105` — Bootstrap limpo histórico 0001→0023; `0024` aplicada append-only hospedada — **completed-hosted-runtime-limited** — P0
- `V1-ST-106` — pgTAP histórico; `0024` RLS SQL hospedada 12/12 com rollback — **completed-hosted-runtime-limited** — P0
- `V1-ST-107` — Full lint + TypeScript 6 + Vitest + Next build — **completed-remote-ci** — P0
- `V1-ST-108` — E2E browser e novo FULL 55 respostas no bb290bc, sem vínculo documental — **completed-hosted-runtime-limited** — P0
- `V1-ST-109` — Cross-tenant 12/12 RLS SQL e 12/12 HTTP multi-role no bb290bc — **completed-hosted-runtime-limited** — P0
- `V1-ST-110` — Backup/restore/rollback drill — **partial-private-v2-manual-logical-pass-service-rpo-rto-pending** — P0
- `V1-ST-111` — SBOM + license + dependency + secret/security scans — **partial-deployed-package-bytes-pass-notice-legal-blocked** — P0
- `V1-ST-112` — Observabilidade e correlation IDs ponta a ponta — **partial-monitor-drill-alert-delivery-ack-pass-continuous-observation-pending** — P0
- `V1-ST-113` — Configurar dev/staging/prod e promoção controlada — **completed-hosted-staging-and-remote-ci** — P0
- `V1-ST-122` — Production Readiness Review e release candidate — **hsp4-prr-closed-no-go-objective-fixes** — P0
- `V1-ST-123` — Piloto controlado com rollout/rollback — **planned-not-started** — P0

## EPIC-18 Activation Decisions
**Objetivo:** Fechar decisões metodológicas/jurídicas antes de habilitar capacidades sensíveis.
**Exit gate:** Upload, rede, confidence/sector calibration e agentic possuem decisão/evidência.
**Stories:** 8

- `V1-ST-114` — Aprovar e ativar versão jurídica de Data Submission Attestation — **planned-production** — P0
- `V1-ST-115` — Implementar pipeline seguro de upload binário — **foundation-implemented-scanner-and-activation-pending** — P0
- `V1-ST-116` — Fechar metodologia de qualification e thresholds — **planned-production** — P0
- `V1-ST-117` — Fechar provider-plan eligibility — **planned-production** — P0
- `V1-ST-118` — Calibrar confidence engine com empresas piloto — **planned-production** — P1
- `V1-ST-119` — Calibrar applicability setorial/operating traits — **planned-production** — P1
- `V1-ST-120` — Executar spike Minimal vs Pydantic AI Slim — **planned-production** — P1
- `V1-ST-121` — Migrar superfícies restantes para Precision Light V2 — **planned-production** — P1
