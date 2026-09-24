# HSP-4 — metadados de ensaios privados de recuperação e SQL

**Data:** 2026-09-24 UTC. Este registro público contém apenas identidades
de PR/run e resultados de jobs/steps. Não contém conexão, senha, backup,
dados restaurados ou saída SQL. O artefato privado de resultado SQL **não
foi lido independentemente pelo agente**: a revisão automática rejeitou a
leitura/download por possível conteúdo sensível. Nenhum atalho foi usado.

**Estado vigente:** o [relatório HSP-4 do `458aac9`](HSP4_CURRENT_REVIEW_458AAC9_2026-09-24.md)
substitui as pendências históricas desta página. A matriz HTTP hospedada passou
12 verificações fail-fast nos runs privados `36062309891` e `36062480126`,
com crédito limitado ao sucesso do workflow e sem inspeção independente do
artefato privado. A seção de preparação abaixo descreve o estado anterior a
esses runs; o gate de backup/restore real e a decisão HSP-4 seguem BLOCKED e
NO-GO, respectivamente.

## Recuperação sintética sem dados de staging

A [PR privada #15](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/15)
foi integrada em `52f047ac0016e50527a1294c7a131d7364802c1a`. O [run manual
`36030761200`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36030761200)
foi informado como `SUCCESS` para o ensaio **sintético** source→target.
Ele não usou credenciais nem backup do staging real. O teste reduz o risco do
procedimento de restauração isolada, mas não mede RPO/RTO do serviço real,
não comprova equivalência de owners/ACL/RLS de dados restaurados e não ativa
o agendamento/retentor. O ensaio protegido com dados reais continua aberto.

A [PR privada #18](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/18)
foi integrada em `352811cf15325065ff9c320c216c43b5c2946001` como
**preflight**, não como restore. Exige identidade e idade de owner sob
custódia do operador fora dos repositórios, tmpfs sem swap, release privada
imutável, validações de cifra/ACL/Storage e stack isolada em loopback. Oito
testes focados e a suíte de 70 passaram, com um symlink SKIP no Windows.
Não houve execução com chave ou backup real do staging; nenhum RPO/RTO,
retenção, owner/ACL equivalente ou retorno do serviço recebe crédito.

A [PR privada #20](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/20)
foi integrada em `c3adbe3c57e943ffc8712f6fe4e9ff05e5f22dc0`. A
poda de retenção agora exige que a release imutável **desta execução** tenha
sido baixada, tenha hash verificado e seja a mais recente; listagem
malformada falha fechado. O CI unitário passou **77 testes sintéticos**.
Cron continua OFF. Sem execução real, história de 30 dias, backup e restore
medidos, essa guarda de código não dá PASS ao gate de retenção ou RPO/RTO.

A [PR privada #21](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/21)
foi integrada em `d8bdfb8d4065883d76852cca2ad908baf626f8a9`.
O CI passou **88 testes sintéticos** e o [dry-run manual
`36039829373`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36039829373)
terminou `SUCCESS`. O monitor permanece com cron OFF por padrão. O dry-run
não leu uma release real nem abriu issue; portanto só comprova preparação do
workflow. Monitor e backup compartilham o domínio de falha do GitHub Actions:
não há alerta independente, backup automático comprovado, restore ou RPO/RTO.
Uma consulta limitada aos metadados de issues abertas após o dry-run mostrou
somente a issue privada #17 existente, ainda sem ACK humano.

A [PR privada #22](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/22)
foi integrada na main privada em
`7759ac15e15220f56b6a5ed3888738f9c3d27238` (head de PR
`44953e`). O CI unitário terminou PASS. O [run sintético
`36063130004`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36063130004)
terminou SUCCESS. O resumo sanitizado informado registra **3 usuários
Auth, 2 tenants, 24 migrations, 4 eventos outbox processados**, paridade
de catálogo e `same_tenant_role_matrix_tested=true`. Também registra
`storage_bytes_restored_from_backup=false`: não houve prova de restauração
dos bytes de Storage a partir de backup. O tempo até o worker, **188,167
s**, pertence à stack **sintética**, sem backup real do staging, e **não
é RTO de serviço**. O resumo informou `public_sha` igual a
`458aac964d1f9a7016ac1804fe99d68637a3c0b8`,
`migrated_catalog_parity=true` e cleanup final PASS. A PR privada #24
de documentação foi integrada na main privada
`735026d598c1cdd2fd16941513905ac76d001a29`, sem novo crédito de
runtime. O agente não inspecionou independentemente o artefato
privado completo. O cron de backup permanece OFF; restore real, retenção,
RPO/RTO e HSP-2 continuam BLOCKED.

## Fronteira SQL hospedada da migration 0024

A [PR privada #16](https://github.com/Aurum-Soltec/genesis360-staging-backups/pull/16)
foi integrada em `fe544825801465558f4ca821defb88767626a66e`.
O [workflow `HSP-4 hosted 0024 SQL isolation`, run
`36031065644`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36031065644)
terminou `SUCCESS` nesse SHA. Metadados de GitHub Actions mostram `success`
para conferir SQL/revisão/SHA indicado, configurar TLS verificado, executar
a transação SQL com membro/gestor/outro tenant e salvar evidência sanitizada.
O código revisado do workflow/validador exige **12 casos nomeados**, suas
contagens e o invariante de resíduo/rollback `[0,0,1,0]`; falha em qualquer
um encerra o job com erro. O sucesso do job dá **PASS ao subgate somente SQL
por resultado executável do workflow**. Como o JSON privado não pôde ser
lido pelo agente, esta página não afirma inspeção independente de suas
linhas ou valores. A matriz **HTTP → Auth → Tenant Context → API** com
sessões distintas no artefato hospedado permanece PENDING.

Após o merge do PR público #32, o workflow foi repetido com pin da fonte
`6dff3c9833ae2036f187dd1c9b3a2ad9680a20ac` no [run
`36035020570`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36035020570).
O run, a execução SQL e o upload da evidência sanitizada terminaram
`SUCCESS`. O validador fail-closed segue exigindo os 12 casos nomeados e
rollback. O JSON privado **também não foi lido independentemente** pelo
agente; o PASS é limitado ao resultado executável do workflow e à fonte
pinada, não comprova a matriz HTTP nem resolve `meta.commitHash=null` dos
uploads Railway.

## Preparação da matriz HTTP multi-role

A PR privada #19 integrou um workflow manual de HTTP multi-role. Em ensaio
**local isolado**, três logins reais do GoTrue passaram e as 11 categorias
de fixtures terminaram sem resíduo. Isso valida preparação do runner, **não**
o isolamento HTTP no staging. A execução hospedada ainda depende de o
proprietário configurar `STAGING_SUPABASE_ANON_KEY` diretamente nos secrets
do GitHub Actions privado; nenhum valor deve ser compartilhado em chat,
logs ou repositório. Até o run protegido passar com membro, gestor e outro
tenant, o gate HTTP permanece PENDING.

## Drill de alerta de backup

O run privado `36031382116` para ensaio de alerta sem dados abriu a
[issue privada #17](https://github.com/Aurum-Soltec/genesis360-staging-backups/issues/17).
O **ACK humano ainda está pendente**; abertura de issue isolada não comprova
recebimento externo, reconhecimento ou recuperação, portanto não recebe PASS. O drill
histórico da issue pública #27 comprova o alerta geral do staging, não o
controle de atraso do backup privado.

**HSP-2 permanece BLOCKED e HSP-4 permanece NO-GO.** Nenhum dos três
resultados comprova restore real, backup automático/retido, RPO/RTO de
serviço ou liberação de piloto.
