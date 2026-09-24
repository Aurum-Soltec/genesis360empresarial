# HSP-4 — boot isolado de stack sintética em runner gratuito

**Data:** 2026-09-24 UTC. **Resultado deste subteste: PASS técnico limitado.**
**HSP-2: BLOCKED. HSP-4: NO-GO.** Nenhum backup foi restaurado e nenhum RPO
ou RTO de serviço foi medido.

## Artefato e execução

- Repositório privado de backup: PR #11 integrada no SHA
  `987964fc511eea4d95e03405ef12bc2283bd816b`.
- [Workflow manual `HSP-4 isolated synthetic service bootstrap`, run
  `36020411581`](https://github.com/Aurum-Soltec/genesis360-staging-backups/actions/runs/36020411581):
  `synthetic-stack` SUCCESS em Ubuntu; a referência pública do Genesis usada
  pelo ensaio foi `31df6086cb612886dc5db4a45b946ea80dde2cf1`.
- A consulta read-only do run confirmou os passos de preparação, bridge
  loopback, boot, verificação de saúde/identidade/bindings, recursos após boot
  e limpeza, todos `success`. Os números abaixo constam das linhas
  sanitizadas do log da mesma execução.

| Medida no runner | Antes | Após boot |
| --- | ---: | ---: |
| CPUs | 2 | 2 |
| RAM total | 8,32 GB | 8,32 GB |
| RAM disponível | 7,10 GB | 6,23 GB |
| Disco disponível | 14,03 GB | 8,82 GB |

O boot mais a espera por saúde duraram **120 s**. O verificador confirmou
`auth`, `db`, `inbucket`, `kong`, `pooler`, `realtime` e `storage` como
`healthy`; `edge_runtime` e `rest` estavam `running`, conforme o contrato do
ensaio. Conferiu também as identidades esperadas dos contêineres e as
portas publicadas somente no loopback da bridge Docker dedicada. A stack
vazia e a bridge foram removidas no passo de limpeza `success`.

## Crédito e limite

O ensaio supera o bloqueio técnico de **iniciar e verificar a stack vazia
em isolamento no runner Ubuntu gratuito**, inclusive a falha anterior de
health do Storage no host Windows. Usou uma stack sintética vazia, sem
credenciais do staging, backup cifrado, conteúdo decifrado ou dados de
cliente. Não testou a restauração de PostgreSQL/Auth/Storage, aplicação de
owners/ACL/RLS, login HTTP em papéis distintos, outbox/worker com dados
restaurados, retenção automática ou retorno de serviço. Os **120 s não são
RTO** e não existe RPO medido nesta execução.

Para fechar o gate, ainda é preciso realizar um restore isolado completo do
backup real sob tratamento protegido de credenciais e chave, comparar
permissões/isolamento, provar a cadeia HTTP→Auth→Tenant Context→API→Banco→
Outbox→Worker, medir RPO/RTO de serviço e comprovar agendamento, retenção e
custódia independente. O cron privado segue OFF. Nenhuma Wave posterior à
HSP-4 é liberada por este resultado.
