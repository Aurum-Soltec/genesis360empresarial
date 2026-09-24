# HSP-4 — revisão operacional do artefato `6dff3c9`

**Data:** 2026-09-24 UTC. **Decisão: NO-GO COM CORREÇÕES OBJETIVAS.**
**100 TENANTS READY: NÃO. PILOTO CONTROLADO: NO-GO. PRODUÇÃO ABERTA: NO-GO.**
Esta revisão substitui o estado operacional da [revisão anterior no SHA
`31df6086`](HSP4_CORRECTIVE_GO_NO_GO_2026-09-24.md). As evidências daquele
artefato permanecem históricas. Nenhuma Wave posterior a HSP-4 começou.

## A. Executive Summary

O código enviado por CLI a web e worker do staging isolado veio de uma
worktree local limpa em `6dff3c9833ae2036f187dd1c9b3a2ad9680a20ac`, merge
do [PR #32](https://github.com/Aurum-Soltec/genesis360empresarial/pull/32),
com CI PASS. Os dois deployments terminaram SUCCESS: web `2e2690bd`
(digest `sha256:d588f39244cb6a5836eaf8e1fb0a1b7bae0f560a4421893cbad93653fb78c5b9`)
e worker `56740353`
(digest `sha256:d13cd6b36bd403afccce55beda7612fe00ae2ace9477e068e39b6287e7da14c4`).
O Railway registrou `cliMessage` com o SHA informado, mas
`meta.commitHash=null` em ambos: **não há atestação nativa do commit no
deployment**, de modo que a identidade do artefato é evidência limitada da
fonte local limpa, mensagem e digest, não um hash de commit fornecido pelo
provedor. O código contém a correção do vínculo contextual da demo integrada pelo
[PR #30](https://github.com/Aurum-Soltec/genesis360empresarial/pull/30) em
`5b992d3bea2fad71a8c8fd7b455a387f53d83b45` e instrumentação numérica
adicional da Home. A [execução autenticada FULL](HSP4_HOSTED_FULL_DEMO_5B992D3_2026-09-24.md)
no SHA `5b992d3` chegou a 52 respostas, score 51, confiança 78%, três fontes
fictícias `context_for`, zero referências por resposta, zero fontes verificadas
e cockpit **7/7**. Ela comprova o roteiro de **apresentação fictícia** nesse
SHA, sem creditar automaticamente um novo FULL no `6dff3c9`.

A rota autenticada de medição de fases da Home do
[PR #33](https://github.com/Aurum-Soltec/genesis360empresarial/pull/33)
passou CI e foi integrada na main pública como
`458aac964d1f9a7016ac1804fe99d68637a3c0b8`. Esta revisão continua
referida ao staging `6dff3c9`: ainda não há evidência de promoção da rota
nem medida hospedada produzida por ela.

A última carga integral de 100 empresas por 60 minutos pertence ao SHA
`bb290bc` e **falhou** o limite p95 ≤750 ms. No predecessor `ff864213`, o [workflow
privado SQL da migration 0024](HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md)
passou por resultado executável que exige 12 casos e rollback; o artefato
JSON privado não foi lido independentemente pelo agente. O SQL-only
pinado à fonte `6dff3c9`, run `36035020570`, também terminou **SUCCESS**:
execução e upload sanitizado passaram, sem inspeção independente do JSON.
A matriz **HTTP multi-role**, outbox sob carga e novo soak 100×60 ainda precisam de
repetição. Um ensaio source→target **sintético** passou, sem dados do staging
ou crédito de RPO/RTO; o drill de alerta de backup abriu issue privada #17,
mas não possui ACK humano comprovado. Backup automático/restore real e NOTICE/disposição
jurídica de licenças permanecem abertos.

## B. Estado das Waves HSP-0 a HSP-4

| Wave | Estado | Evidência e limite |
| --- | --- | --- |
| HSP-0 | **PARTIAL de proveniência; repositório/CI PASS** | PRs #30/#31/#32 integrados e CI PASS; uploads web/worker SUCCESS do código local limpo `6dff3c9`, mas Railway reporta `commitHash=null`; mensagem CLI e digests identificam deployments, sem atestação nativa do commit. |
| HSP-1 | **PARTIAL; demo fictícia e SQL-only PASS limitados, HTTP PENDING** | FULL/cockpit 7/7 no `5b992d3`; SQL 0024 no `ff864213` e na fonte `6dff3c9` por workflows privados fail-closed (`36031065644`/`36035020570`), JSONs não inspecionados. PR privada #19 preparou runner HTTP e passou ensaio local, sem execução hospedada membro/gestor/outro tenant. A Wave inteira não recebe PASS. |
| HSP-2 | **BLOCKED** | Alerta geral com e-mail/ACK histórico PASS; backup manual v2, boot vazio e source→target sintético PASS limitados; PR privada #18 apenas preflight sem chave/backup real; restore real, agendamento/retenção/RPO/RTO, alerta de backup com ACK e licença final pendentes. |
| HSP-3 | **FAIL de p95** | Soak histórico de 3.604 s preservou função/isolamento/outbox, mas quatro p95 excederam 750 ms; sem novo 100×60 no `6dff3c9`. |
| HSP-4 | **NO-GO** | Gates reprovados e bloqueados ainda impedem piloto e produção aberta. |

## C. PASS / FAIL / BLOCKED por gate

| Gate | Estado atual | Crédito permitido |
| --- | --- | --- |
| Artefato web/worker identificado | **PARTIAL de proveniência** | Fonte local limpa `6dff3c9`, CI PASS, deployments SUCCESS e digests específicos; Railway `meta.commitHash=null` limita atestação nativa do SHA. |
| Convite e login de membro | **PASS histórico no escopo observado** | E-mail, callback, senha definida, novo login no alias correto e somente Tenant A. |
| Demo FULL fictícia | **PASS no `5b992d3`; repetição no `6dff3c9` PENDING** | 52 respostas, relatório e cockpit 7/7; fontes contextuais não verificadas. |
| Migration 0024 e isolamento SQL/HTTP multi-role | **SQL-only PASS limitado na fonte `6dff3c9`; HTTP PENDING** | Runs privados `36031065644`/`36035020570` SUCCESS com validador fail-closed de 12 casos/rollback; JSONs não inspecionados. Atestação de commit Railway é limitada; 12/12 HTTP só histórico do `bb290bc`. |
| Alerta externo/ACK | **PASS histórico** | Issue #27: falha simulada, aviso, ACK humano e recuperação. |
| Backup automático, retenção e recuperação de serviço | **BLOCKED** | Release cifrada e restore lógico v2; boot vazio e source→target sintético passaram sem backup/credenciais reais. Nenhum restore funcional de staging, RPO/RTO ou 30 dias comprovados. |
| OSS/NOTICE/disposição jurídica | **BLOCKED** | 30 pacotes inspecionados no `25c022d8`, inclusive libvips LGPL; NOTICE final/obrigações/decisão jurídica pendentes e inspeção do artefato `6dff3c9` ainda não atribuída. |
| 100 empresas/60 min, p95 ≤750 ms | **FAIL histórico; novo SHA PENDING** | Último soak completo falhou em login, Home, escrita e leitura. |
| Flags sensíveis OFF | **PASS visual/de rota limitado no web atual enviado de `6dff3c9`** | Proprietário sintético autenticado do Tenant A abriu `/demonstracao/administracao`; Agentic, Data Upload real, Qualification Network, Real Contact e Ecosystem apareceram como DESLIGADA, com “Cinco funções sensíveis desligadas”. `/ecossistema` retornou 404 ao navegar diretamente. Prova da UI/rota nesse contexto, não inspeção bruta das variáveis de ambiente; repetir após promoção futura. |

## D. Evidências produzidas

- [FULL fictício hospedado no `5b992d3`](HSP4_HOSTED_FULL_DEMO_5B992D3_2026-09-24.md), com tempos HTTP individuais e limites explícitos.
- [Inspeção OSS do `25c022d8`](HSP4_DEPLOYED_LICENSE_BYTES_25c022d8.md): hashes dos 30 pacotes e 28 textos locais comparados ao CI do mesmo SHA; licença continua BLOCKED.
- [Backup v2 manual e restore lógico](../audit-2026-09-23/HSP4_PRIVATE_BACKUP_MANUAL_PROOF_2026-09-24.md) e [boot sintético vazio](HSP4_PRIVATE_SYNTHETIC_STACK_BOOT_2026-09-24.md).
- [Metadados dos runs privados #15/#16](HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md): source→target sintético PASS; SQL 0024 no predecessor `ff864213` e fonte `6dff3c9` PASS pelos workflows validados, artefatos JSON privados não inspecionados; issue #17 de alerta de backup aberta com ACK humano pendente.
- [Carga histórica 100×60](../audit-2026-09-23/HSP3_100_TENANTS_60M_BB290BC_2026-09-24.json), vinculada ao SHA `bb290bc`, com p95 FAIL.

## E. Mudanças realizadas e F. Problemas/correções

O PR #30 passou a vincular fontes canônicas já existentes como contexto do
diagnóstico, em vez de lhes atribuir suporte individual não revisado. Isso
resolveu o cockpit 6/7 do artefato anterior no cenário fictício: 7/7 no
`5b992d3`, preservando zero fontes verificadas. O PR #31 acrescentou tempos
numéricos da Home para identificar o gargalo. Ainda não há série hospedada
consolidada ou correção de latência comprovada. O [PR público
#32](https://github.com/Aurum-Soltec/genesis360empresarial/pull/32) passou
CI e foi integrado em `6dff3c9833ae2036f187dd1c9b3a2ad9680a20ac`,
emitindo fases da Home no stdout do Node. Os uploads CLI de uma worktree
local limpa desse SHA terminaram SUCCESS em web/worker; `commitHash=null`
no Railway limita a atestação nativa do SHA. Isso não concede PASS de
desempenho. O [PR #33](https://github.com/Aurum-Soltec/genesis360empresarial/pull/33)
integrou a rota autenticada de medição em
`458aac964d1f9a7016ac1804fe99d68637a3c0b8` após CI PASS. O tip
`7b69a9c` também passou `corepack pnpm quality` em worktree isolada:
191 testes Vitest, 34 testes nativos de hardening, lint, tipos, segurança,
integridade, OpenAPI e build de produção Next 16.3.3. A rota ainda não
recebeu crédito de deploy/execução hospedada neste relatório. Esses checks
não medem latência hospedada nem
fecha o SLO p95. Esta branch de
reconciliação altera documentação, sem mudar runtime ou arquitetura.

## G. Segurança e isolamento multi-tenant

A migration 0024 está aplicada append-only. SQL 12/12 e HTTP multi-role
12/12 passaram historicamente no `bb290bc`; 584 negativas cross-tenant
foram esperadas e observadas na carga antiga. O workflow privado
`36031065644` no predecessor `ff864213` passou: o código revisado exige 12 casos
nomeados, contagens e invariante de rollback, e o job encerra com erro se
algum falhar. Assim, **SQL-only no `ff864213` recebe PASS pelo resultado executável**;
o JSON sanitizado privado não foi lido independentemente pelo agente por
bloqueio da revisão automática. O run SQL-only `36035020570` pinado à fonte
`6dff3c9` também terminou SUCCESS: execução e upload sanitizado passaram,
com o mesmo validador fail-closed e sem leitura independente do JSON. A prova
**HTTP** exige três sessões Auth independentes de membro, gestor e outro
tenant; SQL-only não a substitui.

A PR privada #19 integrou um workflow manual para essa matriz. O ensaio
local isolado passou três logins reais de GoTrue e confirmou zero resíduo
em 11 categorias de fixtures. **Não houve run HTTP hospedado** nesta
revisão. O proprietário precisa configurar `STAGING_SUPABASE_ANON_KEY`
diretamente nos secrets da Actions privada antes do ensaio, sem enviar o
valor ao agente ou ao chat.

Na administração da demo hospedada da fonte `6dff3c9`, uma sessão de
proprietário sintético do Tenant A viu as cinco funções sensíveis como
**DESLIGADA**, inclusive Ecosystem. A navegação direta para `/ecossistema`
retornou 404, coerente com superfície desativada. Isso comprova o estado
exposto pela UI/rota naquela sessão; não é inspeção das variáveis de ambiente nem autorização
para ativar qualquer função.

## H. Auth e onboarding hospedados

O convite de teste passou HTTP 201, e-mail recebido, callback, sessão e
vínculo apenas ao Tenant A. O proprietário confirmou novo login com o alias
exato convidado e visualização somente do Tenant A. Não há senha ou link de
recuperação nesta evidência. O FULL da demo utilizou usuário fictício
autenticado; isso não acrescenta prova de onboarding em massa.

## I. Worker contínuo e J. Observabilidade/alertas

O último soak completo pareou e processou 5.806/5.806 fatos/eventos outbox,
sem pending/dead/retries, **no `bb290bc`**. Os uploads CLI web/worker do
`6dff3c9` chegaram a SUCCESS, mas não provam novo ciclo sob carga. A issue #27 fechou o drill de
alerta com notificação por e-mail, ACK humano e recuperação. A instrumentação
numérica da Home está no código enviado como `6dff3c9`; dois GETs Home
autenticados retornaram 200 em **2.287 ms e 14 ms**. Os logs filtrados por
`home_latency` ainda não mostraram eventos de fase; duas requisições e
ausência de logs não definem p95 nem causa. Faltam medidas hospedadas úteis
para isolar Auth, contexto, SQL/pool e streaming no mesmo intervalo. O drill
de alerta **específico do backup privado**, run `36031382116`, abriu a
issue privada #17; entrega da notificação, ACK humano e recuperação ainda
não foram comprovados nesta revisão.

A PR privada #21 integrou monitor de backup, com 88 testes sintéticos no CI
e dry-run `36039829373` SUCCESS. O cron desse monitor permanece OFF; o
dry-run não leu release real nem abriu issue. Como monitor e backup dependem
do GitHub Actions, isso não comprova alerta independente nem fecha a issue #17.

## K. Backup, restore, RPO e RTO

O backup privado v2 manual produziu release cifrada imutável e 129 entradas
ACL no arquivo; restore **lógico** isolado verificou 102 tenants, 16 usuários
Auth e 24 migrations. O run `36020411581` iniciou e limpou stack Ubuntu
**vazia** em loopback em 120 s; isso **não é RTO**. Um ensaio sintético de
source→target sem backup ou credenciais reais, run `36030761200`, passou
como subprova do procedimento; **não restaura o staging** nem mede RPO/RTO.
A PR privada #18 integrou preflight controlado pelo operador, com 8 testes
focados e suíte 70 PASS/1 symlink SKIP no Windows; ainda não foi executado
com chave ou backup real, portanto não concede crédito de RPO/RTO.
A PR privada #20 integrou guarda de poda que exige release cifrada imutável
da própria execução baixada, hash verificado e mais recente; listagem
malformada falha fechado. Setenta e sete testes sintéticos passaram no CI,
mas cron continua OFF e não há 30 dias de retenção observada.
O monitor da PR privada #21 também segue OFF por padrão; seu dry-run
sem release real não concede crédito de backup, restore ou RPO/RTO.
Cron permanece OFF; faltam comparação de owner/ACL/RLS após restore, cadeia
HTTP→Auth→Tenant Context→API→PostgreSQL→Outbox→Worker, RPO real ≤24 h,
RTO de serviço ≤30 min, retenção automática de 30 dias e custódia separada
da chave.

## L. Carga 100 tenants e M. p50/p95/p99/erros/saturação

Run histórico `662855c2dbd5` no `bb290bc`: **3.604 s**, 100/100 tenants,
24.512 requests, 5.806 escritas, 584 negativas esperadas, zero erro
inesperado. P95 login **1.964,5 ms**, Home **1.055,48 ms**, escrita **1.024,5
ms** e leitura **793,8 ms** contra ≤750 ms. Esses valores reprovam HSP-3.
P50/p99, pool, conexões, slow queries, quotas, CPU/memória e custo do mesmo
run permanecem na [evidência histórica](../audit-2026-09-23/HSP3_100_TENANTS_60M_BB290BC_2026-09-24.json);
não há nova série 100×60 no SHA `6dff3c9`. Os GETs individuais da demo
não permitem inferir um p95.

## N. FinOps inicial

O orçamento GitHub Actions da organização foi observado em US$0 com Stop
usage ativo; a franquia gratuita compartilhada pode esgotar e interromper
o backup autogerido. O custo Railway histórico não define custo marginal
por empresa, e o novo artefato não recebeu medição FinOps de escala.

## O. Débitos técnicos e P. Riscos para piloto

Os riscos abertos são o SLO de p95, restore/automação/custódia de backup,
NOTICE e obrigações OSS, matriz de isolamento no candidato atual e falta de
telemetria pareada para diagnosticar a latência. A demo fictícia agora é
apresentável, porém **não valida documentação real** nem fornecedores reais.
Dados de demo não se tornam fatos de produção. Qualquer cross-tenant,
perda/corrupção de dados ou vazamento de segredo reprova o gate imediatamente.

## Q. Acessos e decisões humanas pendentes

O proprietário deve manter cópia independente recuperável da chave de
backup e decidir formalmente, após o drill completo, se aceita o controle
autogerido como equivalente. O proprietário/responsável jurídico precisa
decidir as obrigações de libvips LGPL, caniuse-lite CC-BY, pacotes MPL e
demais exceções, com NOTICE final. A engenharia precisa executar os testes
protegidos sem expor credenciais no agente, chat, logs ou repositório.
Para o HTTP multi-role hospedado, o proprietário deve configurar
`STAGING_SUPABASE_ANON_KEY` no repositório privado; o runner já foi integrado,
mas a prova local não substitui esse acesso.

## R. Percentuais Foundation, MVP e V1

**Foundation 92%, MVP 82%, V1 64%** são estimativas históricas de escopo,
mantidas sem novo crédito de prontidão. O 7/7 da demo fictícia não altera
esses percentuais nem a decisão operacional.

## S. Declaração objetiva

- **100 TENANTS READY: NÃO.**
- **PILOTO CONTROLADO: NO-GO.**
- **PRODUÇÃO ABERTA: NO-GO.**

## T. Próxima ação recomendada — o que falta para fechar HSP-4

1. Preservar os SQL-only PASS dos runs `36031065644` (`ff864213`) e
   `36035020570` (fonte `6dff3c9`), sem alegar inspeção independente dos
   JSONs privados. Concluir a matriz HTTP Auth de membro, gestor e outro
   tenant no candidato final, após a configuração privada da anon key pelo
   proprietário e com limpeza da fixture. Fechar a lacuna de proveniência
   entre fonte local, digests Railway e `commitHash=null`.
2. Concluir o drill de backup protegido: restore completo isolado com
   owners/ACL/RLS, Auth/API/outbox/worker, RPO e RTO medidos; ativar e provar
   agendamento, monitor de atraso, retenção e custódia da chave.
3. Fechar NOTICE, atribuições/condições e decisão jurídica das licenças
   efetivamente presentes. Repetir a inspeção OSS no artefato atual se
   necessária para vincular a decisão ao SHA exato.
4. Coletar fases Auth/Home/SQL/pool, corrigir apenas o gargalo medido e
   repetir **100 empresas por 60 minutos** no mesmo artefato, com p95 ≤750
   ms e observação de erros, pool, conexões, slow queries, outbox, worker,
   quotas, CPU, memória e custo.
5. Reexecutar os testes afetados por qualquer correção, reconciliar
   PROJECT-STATE, Production Waves, stories/epics/gates e emitir nova
   decisão HSP-4. Não iniciar PILOT-1 sem GO e nova decisão do proprietário.
