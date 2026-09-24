# Production Waves Master

As Waves 0–8 registram a evolução histórica da fundação. As **PW** abaixo são as ondas de execução para transformar a baseline em produção.

## Estado canônico Hosted Staging & Pilot Readiness — fonte `458aac9`

**NO-GO em 2026-09-24 UTC.** PR #33/CI PASS e merge na main
`458aac964d1f9a7016ac1804fe99d68637a3c0b8`. Web Railway
`65ede85d-f918-4ccf-b161-a9396d6c702a` e worker Railway
`8e460f0f-4c6b-4506-b490-90682b5b1b4d` chegaram a SUCCESS de
worktree limpa detached nesse SHA. Os deployments têm digests web
`sha256:108dd4d9b0d33b5bd60d5df4fce63ca3dee62f7fc6136675d7ec6612803a613b`
e worker `sha256:8318678e1197f06d97390dbf43629bfb88bea97963eda892ffd7ee9b234e2163`;
Railway `meta.commitHash=null` em ambos. A rota opt-in
`/api/ops/home-timing`
devolveu 401 anônimo, mas a navegação direta autenticada foi bloqueada
pelo navegador (`ERR_BLOCKED_BY_CLIENT`). O run privado `36063913391`
mediu depois 16 amostras numéricas em fixture escassa sem pains: total
p50/p95 799,01/1.337,44 ms, tenant context 504,71/709,60 ms e dashboard
284,31/810,15 ms, sem causa definitiva ou crédito de SLO. Último 100×60
permanece FAIL de p95; HTTP multi-role hospedado no claim `458aac9` passou
no run privado `36062309891` com guard independente e backstop SUCCESS,
12/12 inferidos do runner fail-fast, sem inspeção independente do artefato
sanitizado. As cinco flags foram vistas DESLIGADA após reload autenticado
da UI no `458aac9`, e `/ecossistema` retornou 404; escopo apenas visual/de
rota. FULL no candidato atual segue PENDING, backup de serviço/RPO-RTO e
NOTICE seguem BLOCKED. Nenhum gate
herda PASS runtime do `6dff3c9` automaticamente. [Revisão A–T
vigente](../../../audit-2026-09-24/HSP4_CURRENT_REVIEW_458AAC9_2026-09-24.md).

| Wave | Estado no `458aac9` | Próxima evidência obrigatória |
| --- | --- | --- |
| HSP-0 | **PARTIAL** | Preservar CI e vincular fonte/deployments ao artefato sem alegar atestação nativa não observada. |
| HSP-1 | **PARTIAL; HTTP multi-role PASS limitado** | Run hospedado `36062309891` e backstop `36062480126` SUCCESS no claim `458aac9`; 12/12 inferidos do runner fail-fast, JSON privado não inspecionado. FULL no candidato ainda pende; SQL-only anterior é histórico. Cinco flags OFF foram observadas na UI/rota atual sob sessão sintética, sem env bruto. |
| HSP-2 | **BLOCKED** | PR privada #22/run `36063130004` passou apenas stack sintética com 3 Auth/2 tenants/24 migrations/4 outbox; bytes Storage não vieram de backup, 188,167 s até worker não é RTO. Faltam restore real, RPO/RTO, backup automático/retido, alerta/ACK, chave independente e NOTICE. |
| HSP-3 | **FAIL p95 histórico; atual PENDING** | Run `36063913391` mediu 16/16 amostras curtas sem pains; ampliar fixture, isolar causa, corrigir gargalo demonstrado e repetir 100×60 no candidato. |
| HSP-4 | **NO-GO** | Reconciliar gates antes de decisão de piloto. |

## Registro histórico — fonte `6dff3c9`

**NO-GO em 2026-09-24 UTC.** PRs #30/#31/#32 passaram CI e foram integrados.
Uploads CLI da fonte local limpa `6dff3c9833ae2036f187dd1c9b3a2ad9680a20ac`
chegaram a SUCCESS no web `2e2690bd` e worker `56740353`, com digests
individuais; Railway registrou `meta.commitHash=null`, logo a identidade
do commit não tem atestação nativa do provedor. O [FULL fictício](../../../audit-2026-09-24/HSP4_HOSTED_FULL_DEMO_5B992D3_2026-09-24.md)
chegou a cockpit 7/7 no SHA predecessor `5b992d3`, sem validação documental
real. A [revisão A–T daquele SHA](../../../audit-2026-09-24/HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md)
mantém SQL 0024 **PASS limitado pelos workflows privados**, inclusive
`36035020570` pinado à fonte `6dff3c9`, e HTTP multi-role então pendente; backup de
serviço/RPO-RTO e licença final BLOCKED, e carga 100×60 com p95 FAIL no último
ensaio integral. O ensaio source→target sintético passou sem dados reais e
não concluiu o gate de recuperação. Dois GETs Home no novo web retornaram
200 em 2.287/14 ms, sem eventos `home_latency` filtrados: sem crédito p95.

| Wave | Estado histórico no `6dff3c9` | Próxima evidência obrigatória à época |
| --- | --- | --- |
| HSP-0 | **PARTIAL de proveniência; repo/CI PASS** | Preservar CI; fechar vínculo entre fonte limpa, digests e SHA sem `commitHash` nativo. |
| HSP-1 | **PARTIAL; demo e SQL-only PASS limitados, HTTP PENDING** | SQL 0024 passou por workflow privado fail-closed na fonte `6dff3c9` (`36035020570`); JSON privado não inspecionado independentemente. PR privada #19 preparou runner HTTP e passou ensaio local, sem run hospedado; a anon key ainda não estava configurada na Actions privada. FULL 7/7 no predecessor. A Wave inteira não recebeu PASS. |
| HSP-2 | **BLOCKED** | Restore funcional com ACL/RLS e RPO/RTO, backup automático/retido, chave independente e NOTICE/disposição jurídica. |
| HSP-3 | **FAIL de p95** | Medir gargalo e repetir 100 tenants/60 min no candidato corrigido, p95 ≤750 ms. |
| HSP-4 | **NO-GO** | Reconciliar todos os gates antes de qualquer decisão de piloto. |

Nenhuma Wave PILOT-1 ou posterior foi iniciada ou autorizada automaticamente.

## Registro histórico da rechecagem no SHA `31df6086` — 2026-09-24 UTC

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
| HSP-0 — Baseline, repositório e controle remoto | **PASS histórico; CI/deploy corretivo PASS** | GitHub organizacional, branch principal protegida, PR/CI; run local histórico do último código `6d4d569` relatou 506 Vitest/34 nativos sob configuração que não excluía `tmp`; a contagem não é comparável à suíte limpa atual de 49 arquivos/181 testes PASS, ainda local. O merge `31df6086` passou checks finais e web/worker no mesmo SHA chegaram a SUCCESS. |
| HSP-1 — Staging hospedado isolado | **PASS limitado do smoke/novo login; FULL corrigido e multi-role no SHA atual PENDING** | Migrations 0001–0024; 0024 RLS 12/12 SQL e 12/12 HTTP multi-role no `bb290bc` histórico. No `31df6086`, negativas anônimas e UI autenticada Tenant A/Passport/admin/demo/relatório existentes passaram; demo 6/7 com zero fontes vinculadas/verificadas. Convite/e-mail/callback e novo login da conta convidada com somente Tenant A passaram. Reteste automatizado do roteiro corrigido antes da promoção autenticou duas contas, mas o runner não escolheu tenant nem escreveu; UI posterior mostrou Tenant A para uma delas, causa indeterminada. |
| HSP-2 — Segurança, observabilidade e recuperação | **BLOCKED; subprova manual de backup v2 e inspeção dos 30 pacotes PASS técnico** | Cinco flags OFF; issue #27 comprovou alerta por e-mail, ACK e recuperação. Backup privado v2 run 36002104320: release cifrada imutável, 129 entradas ACL no arquivo, restore lógico isolado de 102 tenants/16 Auth/24 migrations em 77,450 s após download. PR #7 do cron guardado integrada no SHA privado 051a76d, porém variáveis de ativação ausentes mantêm schedule OFF; PR #6 do scaffold de restore de serviço integrada no SHA 10214da, 34 testes locais PASS e um symlink SKIP no Windows, sem restore executado. Não há equivalência de ACL/owner restaurada, serviço recuperado, backup agendado, 30 dias, RPO/RTO ou chave independente. Orçamento GitHub Actions US$0/Stop usage confirmado, com risco de esgotar minutos. A inspeção read-only de web/worker no `31df6086` encontrou 30/30 pacotes em revisão com hashes agregados iguais ao CI Linux do mesmo SHA; NOTICE e disposição LGPL/CC-BY/MPL seguem BLOCKED. |
| HSP-3 — Prova de 100 tenants | **PASS histórico de duração/isolamento/outbox; FAIL p95; novo SHA PENDING** | Primeiro run `bb290bc` terminou aos 998 s com 10 erros. Retry no mesmo runtime, run `662855c2dbd5`: 3.604 s, 100/100 tenants, 24.512 requests, 5.806 escritas, 584 negativas esperadas, zero erro inesperado; outbox 5.806 processados e zero pending/dead/retries. p95 login 1.964,5, Home 1.055,48, escrita 1.024,5 e leitura 793,8 ms >750 ms. Instrumentação numérica agora implantada no `31df6086`, sem nova medição hospedada ou correção. |
| HSP-4 — Production Readiness Review hospedado | **NO-GO; revisão após promoção** | Novo login convidado, smoke limitado e comparação dos 30 pacotes implantados passaram. Matriz de isolamento/FULL corrigido/carga no SHA atual ainda pendentes; p95 histórico FAIL; backup automático/restore de serviço/ACL/RPO-RTO e NOTICE/disposição jurídica continuam BLOCKED. A correção local de proveniência contextual da demo e a instrumentação adicional da Home não receberam crédito runtime. Documento real fundamentando conclusão permanece pending sob flag OFF, sem promover demo sintética a fato. Produção aberta e piloto não autorizados. |

**Subprova HSP-2 posterior:** a PR privada #11 e o run manual
`36020411581` passaram boot/saúde de uma stack sintética vazia em Ubuntu,
identidade dos serviços, portas em loopback e limpeza. Os 120 s medidos não
são RTO; não houve restore nem RPO. O bloqueio de inicialização isolada foi
reduzido, mas HSP-2/HSP-4 e o estado NO-GO permanecem. Evidência:
`docs/audit-2026-09-24/HSP4_PRIVATE_SYNTHETIC_STACK_BOOT_2026-09-24.md`.

**Preparação HSP-2 posterior:** as PRs privadas #18/#20/#21 integraram
preflight controlado pelo operador, poda fail-closed e monitor de backup.
O monitor #21 (`d8bdfb8d`) passou 88 testes sintéticos e dry-run
`36039829373`, sem leitura de release real nem nova issue; seu cron segue
OFF por padrão. Monitor e backup compartilham GitHub Actions como domínio
de falha. Issue privada #17 ainda não tem ACK humano. Nenhum desses passos
mede restore, RPO/RTO, retenção real ou alerta independente; HSP-2 segue
**BLOCKED**. [Evidência limitada](../../../audit-2026-09-24/HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md).

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
