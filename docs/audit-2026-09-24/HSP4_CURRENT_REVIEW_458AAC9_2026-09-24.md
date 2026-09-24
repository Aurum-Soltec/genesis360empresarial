# HSP-4 — revisão operacional do staging na fonte `458aac9`

**Data:** 2026-09-24 UTC. **Decisão: NO-GO COM CORREÇÕES OBJETIVAS.**
**100 TENANTS READY: NÃO. PILOTO CONTROLADO: NO-GO. PRODUÇÃO ABERTA: NO-GO.**
Esta revisão atualiza a [revisão do staging anterior](HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md).
Nenhuma Wave posterior a HSP-4 começou. Resultados históricos não recebem
crédito automático no novo artefato.

## A. Executive Summary

O [PR público #33](https://github.com/Aurum-Soltec/genesis360empresarial/pull/33)
passou CI e foi integrado na main em
`458aac964d1f9a7016ac1804fe99d68637a3c0b8`. Web Railway
`65ede85d-f918-4ccf-b161-a9396d6c702a` e worker Railway
`8e460f0f-4c6b-4506-b490-90682b5b1b4d` chegaram a **SUCCESS** a
partir de worktree limpa e detached nesse SHA exato. Essa é proveniência
da fonte local e dos deployments identificados. O Railway reportou web
digest `sha256:108dd4d9b0d33b5bd60d5df4fce63ca3dee62f7fc6136675d7ec6612803a613b`
e worker digest `sha256:8318678e1197f06d97390dbf43629bfb88bea97963eda892ffd7ee9b234e2163`,
mas `meta.commitHash=null` em ambos. A ligação do SHA vem do checkout
limpo e da mensagem de deploy, sem atestação nativa do commit pelo provedor.

A nova rota opt-in `/api/ops/home-timing` respondeu **401** sem sessão.
A tentativa de navegação direta autenticada no Chrome/IAB terminou
`ERR_BLOCKED_BY_CLIENT` no navegador, sem resposta HTTP autenticada dessa
tentativa. O workflow privado da PR #23 obteve depois **16/16 amostras
numéricas** no claim `458aac9`: total p50 **799,01 ms**, p95 **1.337,44
ms**; tenant context p50/p95 **504,71/709,60 ms** e dashboard
**284,31/810,15 ms**. A fixture era escassa, sem diagnóstico/pains; isso
indica custo em fases remotas e picos, mas não isola causa definitiva nem
comprova correção. A última carga completa
100 empresas × 60 minutos, no `bb290bc`, falhou p95 ≤750 ms. O run privado
HTTP multi-role `36062309891` e seu guard independente passaram no claim
`458aac9`: o runner fail-fast permite inferir 12/12, com artefato
sanitizado não inspecionado e proveniência Railway sem commitHash nativo.
Backup operacional, licença final e conclusão
fundamentada em documentos reais seguem abertos.

## B. Estado de cada Wave HSP-0 a HSP-4

| Wave | Estado | Limite da evidência |
| --- | --- | --- |
| HSP-0 | **PARTIAL** | PR #33/CI PASS; web e worker SUCCESS de fonte local limpa `458aac9`, com digests; `meta.commitHash=null` impede atestação nativa do SHA. |
| HSP-1 | **PARTIAL; HTTP multi-role PASS limitado** | FULL fictício 7/7 no `5b992d3`; SQL-only 0024 no `6dff3c9`; run hospedado `36062309891` e guard `36062480126` SUCCESS no claim `458aac9`, 12/12 inferidos do runner fail-fast, artefato não inspecionado. |
| HSP-2 | **BLOCKED** | PRs privadas #22/#25 passaram apenas restauração sintética, inclusive 71 bytes fictícios iguais por byte/SHA; `storage_bytes_restored_from_backup=false`. PR #27 sinalizou falha intencional; e-mail/ACK humano confirmados, mas dry-run de recuperação `36069498641` só retornou `dry_run_pass` sem release/DB/Storage e issue #17 segue OPEN. Backup/restore real, retenção, RPO/RTO e licença final pendentes. |
| HSP-3 | **FAIL** | Último 100×60 excedeu p95; runs privados `36063913391` (16 amostras escassas) e `36068483011` (200 GETs em um tenant scored com três dores; p95 1.229,81 ms, 77/200 >750 ms) não substituem 100×60 nem isolam causa definitiva. |
| HSP-4 | **NO-GO** | Gates operacionais de segurança, recuperação e desempenho sem PASS no candidato. |

## C. PASS / FAIL / BLOCKED por Gate

| Gate | Estado | Evidência permitida |
| --- | --- | --- |
| Repositório/CI e deploy | **PARTIAL** | PR #33 CI PASS; deployments web/worker SUCCESS a partir da fonte local limpa `458aac9`, com digests; `meta.commitHash=null`. |
| Auth/onboarding | **PASS histórico limitado** | Convite, callback, novo login no alias exato e Tenant A apenas em candidato anterior; não é matriz multi-role no atual. |
| Demo FULL fictícia | **PASS histórico no `5b992d3`** | 52 respostas/cockpit 7/7; sem análise de documentação real e sem repetição no `458aac9`. |
| SQL 0024 / HTTP multi-role | **SQL histórico PASS limitado; HTTP atual PASS limitado** | SQL run `36035020570` no `6dff3c9`; HTTP run `36062309891` e guard `36062480126` SUCCESS no claim `458aac9`, 12/12 inferidos pelo runner fail-fast. Artefatos privados não inspecionados independentemente; Railway `meta.commitHash=null`. |
| Cinco flags sensíveis OFF | **PASS visual/de rota limitado no web atual `458aac9`** | Após reload real da IAB em `/demonstracao/administracao`, owner sintético do Tenant A viu resumo “Cinco funções sensíveis desligadas” e Agentic, Data Upload real, Qualification Network, Real Contact e Ecosystem como DESLIGADA; `/ecossistema` retornou 404. Escopo da UI/rota nessa sessão; sem leitura bruta de env ou prova em outros serviços. |
| Rota de medição da Home | **PASS limitado de telemetria; SLO FAIL histórico** | 401 anônimo; navegação direta autenticada bloqueada no cliente. Run `36063913391` mediu 16 amostras escassas; PR privada #26/run `36068483011` passou 200 GETs autenticados (100 membro/100 gestor) em um tenant scored com três dores: p50/p95/p99 728,55/1.229,81/1.758,33 ms, 77/200 >750 ms. Região do runner e método de score não validados; sem inferência de 100×60 ou causa fechada. |
| Alerta geral | **PASS histórico; alerta de backup PARTIAL** | Issue pública #27 com e-mail, ACK e recuperação. PR privada #27/run `36067885407` induziu falha pré-secrets/DB/Storage, job de alerta SUCCESS e menção ao proprietário na issue privada #17; e-mail externo e ACK humano confirmados. Run `36069498641` foi somente dry-run sintético de wiring, sem recuperação real; issue #17 OPEN. |
| Backup, restore, RPO/RTO | **BLOCKED** | PR #22/run `36063130004` SUCCESS na stack sintética (3 Auth, 2 tenants, 24 migrations, 4 outbox; 188,167 s até worker não-RTO); PR #25/run `36067300522` igualou 71 bytes fictícios source→target por byte/SHA, catálogo/owner/ACL/RLS/cleanup. `storage_bytes_restored_from_backup=false`; sem restore real de staging ou agendamento observado. |
| OSS/NOTICE | **PASS técnico limitado de bytes; BLOCKED jurídico/NOTICE** | Inspeção read-only dos web/worker atuais `458aac9` comparou 30/30 hashes de pacotes com CI em cada serviço, encontrou 28 LICENSE/NOTICE e 3 binários nativos, zero pacote ausente; IDs/digests dos deployments inalterados antes/depois. [Evidência versionada](HSP4_OSS_NOTICE_REVIEW_458AAC/HOSTED_IMAGE_BYTES_458AAC.md). NOTICE final e decisão LGPL/CC-BY/MPL seguem pendentes. |
| 100 tenants/60 min, p95 ≤750 ms | **FAIL histórico; candidato PENDING** | Último run `bb290bc` excedeu p95; nenhuma repetição no `458aac9`. |

## D. Evidências produzidas

- [PR #33](https://github.com/Aurum-Soltec/genesis360empresarial/pull/33): CI PASS e merge `458aac9`; deployments web `65ede85d-f918-4ccf-b161-a9396d6c702a` SUCCESS às 20:49:32Z e worker `8e460f0f-4c6b-4506-b490-90682b5b1b4d` SUCCESS às 20:50:27Z de worktree limpa detached no mesmo SHA, com digests indicados acima; ambos `meta.commitHash=null`.
- [HTTP multi-role hospedado no claim `458aac9`](HSP4_HOSTED_HTTP_MULTIROLE_458AAC9_2026-09-24.md): run `36062309891`, jobs exercise/independent-residue-guard e backstop `36062480126` SUCCESS; 12/12 inferidos por runner fail-fast, artefato sanitizado id `10834806637` (511 bytes, SHA-256 registrado) não inspecionado independentemente.
- Rota `/api/ops/home-timing`: 401 anônimo; tentativa autenticada por navegação direta no Chrome/IAB `ERR_BLOCKED_BY_CLIENT`, sem resposta HTTP e sem tempos.
- [Medição privada limitada da Home](HSP4_HOSTED_HOME_TIMING_458AAC9_2026-09-24.md): PR #23/CI unit PASS, run `36063913391` e backstop `36064075371` SUCCESS, schema numérico 16/16, artefato sanitizado id `10834954067`; fixture escassa, sem SLO 100×60.
- [Segunda medição autenticada da Home](HSP4_HOSTED_HOME_TIMING_458AAC9_2026-09-24.md): PR privada #26 integrada em `5ba5bcf13ef8149cdafd6aecb840334a85c33c16`, CI PASS; run `36068483011` PASS, 200 GETs em um tenant scored/três dores, limpeza primária e guard com 14 categorias sem resíduo, artefato sanitizado id `10837144687`; p95 1.229,81 ms, sem crédito 100×60.
- Administração da demo no web atual `458aac9`: reload autenticado de proprietário sintético do Tenant A exibiu as cinco flags DESLIGADA; navegação direta `/ecossistema` deu 404. Evidência apenas da UI/rota nessa sessão.
- [PR privada #22 e run sintético `36063130004`](HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md): CI unitário e workflow SUCCESS; resumo sanitizado de Auth/tenants/migrations/outbox, sem bytes Storage restaurados de backup e sem RTO real.
- [PRs privadas #25/#27 e runs `36067300522`/`36067885407`](HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md): 71 bytes fictícios iguais source→target, invariantes de catálogo/owner/ACL/RLS/cleanup; falha intencional antes de secrets/DB/Storage sinalizada na issue #17, com e-mail e ACK humano confirmados. Dry-run `36069498641` apenas comprovou wiring, sem recuperação real; issue OPEN.
- Inspeção OSS temporária read-only nos deployments atuais web/worker `458aac9`: **30/30 hashes de pacotes iguais ao CI em cada serviço**, 28 LICENSE/NOTICE, 3 binários nativos e nenhum pacote ausente; IDs/digests inalterados antes/depois e chave temporária removida. [Arquivo detalhado versionado](HSP4_OSS_NOTICE_REVIEW_458AAC/HOSTED_IMAGE_BYTES_458AAC.md). Essa subprova técnica não é NOTICE final nem aceite jurídico.
- [Revisão anterior A–T](HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md), [FULL fictício](HSP4_HOSTED_FULL_DEMO_5B992D3_2026-09-24.md), [SQL e recuperação sintética](HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md) e [carga histórica 100×60](../audit-2026-09-23/HSP3_100_TENANTS_60M_BB290BC_2026-09-24.json).

## E. Mudanças realizadas e F. Problemas/correções

O PR #33 adicionou uma rota opt-in autenticada para medir fases do backend
da Home. A verificação anônima confirmou negação 401. O navegador bloqueou
a navegação autenticada com `ERR_BLOCKED_BY_CLIENT`; isso é limite daquela
tentativa de coleta, não prova de erro de servidor. O workflow privado da
PR #23 obteve depois 16 medidas numéricas válidas por via protegida; a PR
privada #26 ampliou a amostra para 200 GETs de um tenant com três dores,
mas o p95 continuou acima de 750 ms. Não houve
mudança de arquitetura, PostgreSQL, Supabase, tenancy, RLS ou fronteira de
acesso confiável para contornar o bloqueio.

## G. Segurança e isolamento multi-tenant

O SQL-only da migration 0024 passou por workflow fail-closed no candidato
anterior `6dff3c9`; o resultado JSON privado não foi lido
independentemente. O run HTTP privado `36062309891` hospedado no claim
`458aac9` terminou SUCCESS nos jobs de exercício e guard independente,
com backstop `36062480126` SUCCESS. O runner revisado contém 12 assertions
fail-fast; 12/12 e ausência de resíduo são inferidos do sucesso executável,
sem leitura independente do artefato sanitizado `10834806637`. A
proveniência ainda depende de checkout/mensagem/digests porque Railway
`meta.commitHash=null`. O último soak histórico observou 584 negativas
cross-tenant esperadas e zero erro inesperado, mas não transfere PASS de
100×60 para o novo artefato. Após reload real da IAB na administração do
web `458aac9`, proprietário sintético do Tenant A viu as cinco flags como
DESLIGADA e o resumo de cinco funções desligadas; `/ecossistema` retornou
404 ao navegar diretamente. Isso comprova a
apresentação da UI/rota nessa sessão, sem inspecionar env bruto ou outros
serviços; manter false em cada promoção.

## H. Auth e onboarding hospedados

Convite, e-mail, callback, senha definida, novo login no alias exato e
vínculo somente ao Tenant A passaram historicamente. A resposta 401 da
nova rota sem sessão mostra proteção anônima no candidato atual; não prova
login autenticado nessa rota nem onboarding multi-tenant novo.

## I. Worker contínuo e J. Observabilidade/alertas

O worker `8e460f0f-4c6b-4506-b490-90682b5b1b4d` está em SUCCESS;
isso não comprova novo processamento outbox contínuo ou sob carga. O
último soak histórico processou 5.806/5.806 eventos sem pending/dead.
A issue pública #27 comprovou alerta geral e ACK. A PR privada #27/run
`36067885407` induziu falha intencional de snapshot antes de secrets,
banco e Storage; o job de alerta terminou SUCCESS e mencionou
`@hudsonlcustodio` na issue privada #17 (comentário `5823303209`). O
proprietário confirmou recebimento por e-mail e metadados da issue mostram
ACK humano às 22:44:52Z. Entrega e ACK recebem PASS limitado. O run
`36069498641` terminou check SUCCESS às 22:49:03Z, porém o monitor
retornou `dry_run_pass` de fixture sintética, sem ler release/DB/Storage ou
secrets e sem atualizar a issue #17, ainda OPEN. Recuperação real e alerta
de backup completo permanecem PENDING.
O agendamento privado `36041370015` terminou **SKIPPED** em 18:27Z:
backup automático continua OFF; os nomes de variáveis de habilitação,
restore de serviço, custódia, equivalência e trava de gasto não estavam
configurados. O monitor privado #21 passou dry-run
sem release real nem nova issue, com cron OFF e domínio de falha compartilhado
com GitHub Actions. A rota de fases gerou 16 amostras protegidas pelo run
`36063913391`, com fixture escassa; não são série representativa 100×60.

## K. Backup, restore, RPO e RTO

Release cifrada e restore lógico isolado, boot vazio e source→target
sintético são provas limitadas. PRs privadas #18/#20/#21 preparam preflight,
retenção fail-closed e monitor. A PR privada #22 integrada no SHA
`7759ac15e15220f56b6a5ed3888738f9c3d27238` passou CI unitário;
run sintético `36063130004` SUCCESS com resumo sanitizado de 3 Auth,
2 tenants, 24 migrations, 4 eventos outbox processados, matriz de papéis
do mesmo tenant testada e paridade de catálogo. O campo
`storage_bytes_restored_from_backup=false` impede crédito de restore dos
bytes de Storage. O tempo até worker de **188,167 s** é sintético e **não
é RTO**. O resumo informou `public_sha=458aac9` e cleanup final PASS;
PR privada #24 foi apenas documentação (main `735026d598c1cdd2fd16941513905ac76d001a29`).
O agente não inspecionou independentemente o artefato privado.
A PR privada #25 (`0d94e17fddca631e3bdbd1ef3c4c083cca94e19b`),
run `36067300522` SUCCESS, comparou **71 bytes fictícios** source→target
por bytes/SHA e conferiu catálogo, owner, ACL, RLS e limpeza. O campo
`storage_bytes_restored_from_backup=false` continua: não houve restore
dos bytes de Storage de um backup real. Cron e monitor permanecem OFF. Faltam
backup automático com retenção observada, restore isolado do serviço e
equivalência owner/ACL/RLS, RPO real ≤24 h, RTO de serviço ≤30 min e
custódia independente da chave. **HSP-2 continua BLOCKED.**

## L. Carga de 100 tenants e M. p50/p95/p99/erros/saturação

Run histórico `662855c2dbd5` no `bb290bc`: 3.604 s, 100/100 tenants,
24.512 requests, 5.806 escritas, 584 negativas esperadas, zero erro
inesperado. P95 login 1.964,5 ms, Home 1.055,48 ms, escrita 1.024,5 ms e
leitura 793,8 ms excederam ≤750 ms. P50/p99, pool, conexões, slow queries,
quotas, CPU/memória e custo dessa série constam na evidência histórica.
No `458aac9`, o run limitado `36063913391` validou 16/16 amostras
numéricas: total p50/p95 **799,01/1.337,44 ms**, tenant context
**504,71/709,60 ms**, dashboard **284,31/810,15 ms**; auth user p50
**138,91 ms**, membership **147,18/526,88 ms**, quota
**149,82/456,06 ms**, seleção de empresa **139,31/407,04 ms** e
diagnóstico **141,29/432,50 ms**. A fixture não tinha pains. Percentis de
fases não são aditivos. O residual calculado **por amostra**
`tenant_context − auth_user − active_cookie − max(membership, quota)`
teve p50/p95/máximo **0,40/0,49/0,49 ms** em 16 amostras completas;
Auth user p95/máximo **182,30 ms**. Isso indica overhead local pequeno
e predominância de chamadas remotas nessa fixture, mas
não isola causa definitiva, não representa Home com dados reais e não
substitui uma nova série 100×60. A PR privada #26/run `36068483011`
mediu 200 GETs autenticados em um tenant scored com três dores (100 membro,
100 gestor; cleanup primário e guard 14/14 categorias sem resíduo): total
p50/p95/p99/máximo **728,55/1.229,81/1.758,33/3.902,15 ms**, com
**77/200 >750 ms**; membro p95 **1.237,05 ms**, gestor p95 **1.133,92 ms**.
Fases p95: context **637,76**, Auth **182,05**, membership **164,33**,
quota **411,05**, dashboard **719,51**, company **182,37**, diagnostic
**381,97** e pains **194,07 ms**. Nas 77 lentas, as medianas
context/dashboard foram **516,24/446,28 ms**; dentro do contexto,
Auth/membership/quota **139,08/142,62/271,70 ms**; dentro do dashboard,
company/diagnostic/pains **144,14/143,75/142,07 ms**. As fases sugerem
round trips remotos e cauda de quota, mas não causalidade fechada; não somar
percentis. Região do runner GitHub não verificada como Brasil e método de
score da fixture não validado. **HSP-3 continua FAIL; falta 100×60.**

## N. FinOps inicial

O orçamento GitHub Actions US$0/Stop usage e custo Railway histórico não
fornecem custo marginal por tenant do novo artefato. Não houve nova medição.

## O. Débitos técnicos e P. Riscos para piloto

P95 reprovado mesmo na amostra de 200 GETs, medição ainda não
representativa de 100 empresas/60 minutos e causa não isolada,
proveniência nativa do SHA, backup de serviço, NOTICE/licença e fundamento
documental real são riscos de piloto.
O bloqueio de navegador na rota de medição não autoriza relaxar Auth, RLS
ou controles de segurança. Cross-tenant, perda/corrupção de dados ou
vazamento de segredo causariam FAIL imediato.

## Q. Acessos e decisões humanas pendentes

O proprietário configurou apenas a publishable anon key
`STAGING_SUPABASE_ANON_KEY` diretamente no Actions privado, sem revelar o
valor. O run HTTP hospedado ocorreu; eventual repetição afetada por correção
de código deve preservar essa custódia. Backup exige
chave sob custódia independente e decisão formal sobre controle autogerido;
responsável jurídico deve fechar NOTICE e obrigações LGPL/CC-BY/MPL. A
equipe deve ampliar a medição autenticada de um tenant para 100×60,
incluindo região do cliente e método de score validados,
preservando Auth e sem expor credenciais. O bloqueio local do navegador
não representa o resultado do servidor.

## R. Percentuais Foundation, MVP e V1

**Foundation 92%, MVP 82%, V1 64%** permanecem estimativas históricas de
escopo, sem novo crédito de prontidão operacional pelo deploy da rota.

## S. Declaração objetiva

- **100 TENANTS READY: NÃO.**
- **PILOTO CONTROLADO: NO-GO.**
- **PRODUÇÃO ABERTA: NO-GO.**

## T. Próxima ação recomendada

1. Usar as 16 amostras iniciais e os 200 GETs com três dores como triagem,
   medir a carga representativa com Auth/contexto/dashboard e diagnosticar causa específica antes de
   corrigir. Repetir 100 empresas por 60 minutos com p95 ≤750 ms no
   candidato corrigido; as amostras curtas não satisfazem o SLO. `getClaims`
   no core e mudança regional são hipóteses, sem implementação ou ADR;
   qualquer canário regional deve medir também login navegador brasileiro →
   Auth e Home com diagnóstico/três dores, condicionado a slot e orçamento
   Free. Migração real exigiria ADR/residência, Auth/Storage/ACL/RLS/backup
   e novo 100×60; nenhuma promoção regional foi autorizada ou executada.
2. Preservar a prova HTTP Auth multi-role limitada do run `36062309891` e
   repetir apenas se uma correção a afetar; preservar as cinco flags OFF
   observadas na UI/rota e testar worker/outbox no candidato. Registrar
   proveniência sem atribuir ao Railway atestação
   não observada.
3. Executar backup agendado, restore real isolado com ACL/RLS/serviços e
   RPO/RTO; fechar monitor de atraso e ACK, custódia da chave e decisão do
   controle equivalente.
4. Fechar NOTICE/licenças no artefato final, reconciliar gates e repetir
   testes afetados. Emitir nova decisão HSP-4 antes de qualquer piloto.
