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
`ERR_BLOCKED_BY_CLIENT` no navegador, sem resposta HTTP autenticada da
rota. Portanto, nenhuma medição hospedada de fases foi obtida e não há
diagnóstico causal ou correção comprovada do p95. A última carga completa
100 empresas × 60 minutos, no `bb290bc`, falhou p95 ≤750 ms. Backup
operacional, HTTP multi-role no candidato, licença final e conclusão
fundamentada em documentos reais seguem abertos.

## B. Estado de cada Wave HSP-0 a HSP-4

| Wave | Estado | Limite da evidência |
| --- | --- | --- |
| HSP-0 | **PARTIAL** | PR #33/CI PASS; web e worker SUCCESS de fonte local limpa `458aac9`, com digests; `meta.commitHash=null` impede atestação nativa do SHA. |
| HSP-1 | **PARTIAL** | FULL fictício 7/7 no `5b992d3`; SQL-only 0024 no `6dff3c9`; HTTP com membro, gestor e outro tenant no `458aac9` PENDING. |
| HSP-2 | **BLOCKED** | Backup/restore real, retenção, RPO/RTO, alerta específico e licença final pendentes. |
| HSP-3 | **FAIL** | Último 100×60 excedeu p95; rota de medição nova ainda sem resultado autenticado. |
| HSP-4 | **NO-GO** | Gates operacionais de segurança, recuperação e desempenho sem PASS no candidato. |

## C. PASS / FAIL / BLOCKED por Gate

| Gate | Estado | Evidência permitida |
| --- | --- | --- |
| Repositório/CI e deploy | **PARTIAL** | PR #33 CI PASS; deployments web/worker SUCCESS a partir da fonte local limpa `458aac9`, com digests; `meta.commitHash=null`. |
| Auth/onboarding | **PASS histórico limitado** | Convite, callback, novo login no alias exato e Tenant A apenas em candidato anterior; não é matriz multi-role no atual. |
| Demo FULL fictícia | **PASS histórico no `5b992d3`** | 52 respostas/cockpit 7/7; sem análise de documentação real e sem repetição no `458aac9`. |
| SQL 0024 / HTTP multi-role | **SQL histórico PASS limitado; HTTP PENDING** | Run privado `36035020570` no `6dff3c9`, com JSON privado não inspecionado; três sessões HTTP no `458aac9` faltam. |
| Cinco flags sensíveis OFF | **PASS visual histórico no `6dff3c9`; atual PENDING** | UI de proprietário sintético mostrou cinco DESLIGADA e `/ecossistema` 404 no candidato anterior. |
| Rota de medição da Home | **PARTIAL** | 401 anônimo; navegação autenticada bloqueada no cliente antes de obter resposta. Nenhum tempo de fase. |
| Alerta geral | **PASS histórico** | Issue pública #27 com e-mail, ACK e recuperação. Alerta de backup #17 ainda sem ACK. |
| Backup, restore, RPO/RTO | **BLOCKED** | Ensaios lógicos/sintéticos e preparação de monitor sem restore real de serviço ou agendamento observado. |
| OSS/NOTICE | **BLOCKED** | Inspeção de pacotes em imagem anterior; decisão jurídica e NOTICE final pendentes. |
| 100 tenants/60 min, p95 ≤750 ms | **FAIL histórico; candidato PENDING** | Último run `bb290bc` excedeu p95; nenhuma repetição no `458aac9`. |

## D. Evidências produzidas

- [PR #33](https://github.com/Aurum-Soltec/genesis360empresarial/pull/33): CI PASS e merge `458aac9`; deployments web `65ede85d-f918-4ccf-b161-a9396d6c702a` SUCCESS às 20:49:32Z e worker `8e460f0f-4c6b-4506-b490-90682b5b1b4d` SUCCESS às 20:50:27Z de worktree limpa detached no mesmo SHA, com digests indicados acima; ambos `meta.commitHash=null`.
- Rota `/api/ops/home-timing`: 401 anônimo; tentativa autenticada por navegação direta no Chrome/IAB `ERR_BLOCKED_BY_CLIENT`, sem resposta HTTP e sem tempos.
- [Revisão anterior A–T](HSP4_CURRENT_REVIEW_6DFF3C9_2026-09-24.md), [FULL fictício](HSP4_HOSTED_FULL_DEMO_5B992D3_2026-09-24.md), [SQL e recuperação sintética](HSP4_PRIVATE_SYNTHETIC_AND_SQL_METADATA_2026-09-24.md) e [carga histórica 100×60](../audit-2026-09-23/HSP3_100_TENANTS_60M_BB290BC_2026-09-24.json).

## E. Mudanças realizadas e F. Problemas/correções

O PR #33 adicionou uma rota opt-in autenticada para medir fases do backend
da Home. A verificação anônima confirmou negação 401. O navegador bloqueou
a navegação autenticada com `ERR_BLOCKED_BY_CLIENT`; isso é limite da
tentativa de coleta, não prova de erro de servidor nem de tempos. Não houve
mudança de arquitetura, PostgreSQL, Supabase, tenancy, RLS ou fronteira de
acesso confiável para contornar o bloqueio.

## G. Segurança e isolamento multi-tenant

O SQL-only da migration 0024 passou por workflow fail-closed no candidato
anterior `6dff3c9`; o resultado JSON privado não foi lido
independentemente. O ensaio HTTP de membro, gestor e outro tenant segue
pendente no `458aac9`. O último soak histórico observou 584 negativas
cross-tenant esperadas e zero erro inesperado, mas não transfere PASS de
isolamento para o novo artefato. Cinco flags foram vistas desligadas na UI
anterior; revalidar a configuração e as rotas no candidato atual.

## H. Auth e onboarding hospedados

Convite, e-mail, callback, senha definida, novo login no alias exato e
vínculo somente ao Tenant A passaram historicamente. A resposta 401 da
nova rota sem sessão mostra proteção anônima no candidato atual; não prova
login autenticado nessa rota nem onboarding multi-tenant novo.

## I. Worker contínuo e J. Observabilidade/alertas

O worker `8e460f0f-4c6b-4506-b490-90682b5b1b4d` está em SUCCESS;
isso não comprova novo processamento outbox contínuo ou sob carga. O
último soak histórico processou 5.806/5.806 eventos sem pending/dead.
A issue pública #27 comprovou alerta geral e ACK; a issue privada #17 de
backup permanece OPEN, atribuída ao proprietário e com zero comentários/ACK.
O agendamento privado `36041370015` terminou **SKIPPED** em 18:27Z:
backup automático continua OFF; os nomes de variáveis de habilitação,
restore de serviço, custódia, equivalência e trava de gasto não estavam
configurados. O monitor privado #21 passou dry-run
sem release real nem nova issue, com cron OFF e domínio de falha compartilhado
com GitHub Actions. A rota de fases ainda não gerou telemetria autenticada.

## K. Backup, restore, RPO e RTO

Release cifrada e restore lógico isolado, boot vazio e source→target
sintético são provas limitadas. PRs privadas #18/#20/#21 preparam preflight,
retenção fail-closed e monitor, mas cron e monitor permanecem OFF. Faltam
backup automático com retenção observada, restore isolado do serviço e
equivalência owner/ACL/RLS, RPO real ≤24 h, RTO de serviço ≤30 min e
custódia independente da chave. **HSP-2 continua BLOCKED.**

## L. Carga de 100 tenants e M. p50/p95/p99/erros/saturação

Run histórico `662855c2dbd5` no `bb290bc`: 3.604 s, 100/100 tenants,
24.512 requests, 5.806 escritas, 584 negativas esperadas, zero erro
inesperado. P95 login 1.964,5 ms, Home 1.055,48 ms, escrita 1.024,5 ms e
leitura 793,8 ms excederam ≤750 ms. P50/p99, pool, conexões, slow queries,
quotas, CPU/memória e custo dessa série constam na evidência histórica;
nenhuma série 100×60 ou tempo de fase autenticado foi obtido no `458aac9`.

## N. FinOps inicial

O orçamento GitHub Actions US$0/Stop usage e custo Railway histórico não
fornecem custo marginal por tenant do novo artefato. Não houve nova medição.

## O. Débitos técnicos e P. Riscos para piloto

P95 reprovado, falta de telemetria causal, HTTP multi-role atual, backup de
serviço, NOTICE/licença e fundamento documental real são riscos de piloto.
O bloqueio de navegador na rota de medição não autoriza relaxar Auth, RLS
ou controles de segurança. Cross-tenant, perda/corrupção de dados ou
vazamento de segredo causariam FAIL imediato.

## Q. Acessos e decisões humanas pendentes

O nome do secret `STAGING_SUPABASE_ANON_KEY` ainda está ausente no Actions
privado e o workflow HTTP multi-role não possui runs hospedados. O
proprietário deve configurá-lo diretamente no Actions privado para o run,
sem compartilhar o valor. Backup exige
chave sob custódia independente e decisão formal sobre controle autogerido;
responsável jurídico deve fechar NOTICE e obrigações LGPL/CC-BY/MPL. A
equipe precisa obter medição autenticada por meio que preserve Auth e não
exponha credenciais, sem interpretar o bloqueio local do navegador como
resultado do servidor.

## R. Percentuais Foundation, MVP e V1

**Foundation 92%, MVP 82%, V1 64%** permanecem estimativas históricas de
escopo, sem novo crédito de prontidão operacional pelo deploy da rota.

## S. Declaração objetiva

- **100 TENANTS READY: NÃO.**
- **PILOTO CONTROLADO: NO-GO.**
- **PRODUÇÃO ABERTA: NO-GO.**

## T. Próxima ação recomendada

1. Medir fases autenticadas da Home no `458aac9` preservando Auth; distinguir
   bloqueio de cliente de resposta do servidor. Isolar gargalo antes de
   corrigir e repetir 100 empresas por 60 minutos com p95 ≤750 ms.
2. Repetir HTTP Auth membro/gestor/outro tenant e confirmar isolamento,
   flags e worker/outbox no candidato; registrar proveniência do artefato
   sem atribuir ao Railway atestação não observada.
3. Executar backup agendado, restore real isolado com ACL/RLS/serviços e
   RPO/RTO; fechar monitor de atraso e ACK, custódia da chave e decisão do
   controle equivalente.
4. Fechar NOTICE/licenças no artefato final, reconciliar gates e repetir
   testes afetados. Emitir nova decisão HSP-4 antes de qualquer piloto.
