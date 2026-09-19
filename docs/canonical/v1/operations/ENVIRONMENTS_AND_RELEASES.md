# Environments & Releases

## Ambientes
### Local
Desenvolvimento e testes rápidos.

### Dev
Integração contínua de branches/PRs quando necessário.

### Staging
Espelho funcional de produção para:
- migrations;
- E2E;
- restore rehearsal;
- browser UX;
- release candidate.

### Production
Somente artefato aprovado.

## Isolamento
- projeto/banco separado por ambiente;
- secrets separados;
- service-role server-only;
- nenhum dado real obrigatório em dev;
- dados sintéticos para testes.

Os contratos executáveis estão em `config/environments/development.json`,
`staging.json` e `production.json`. `pnpm delivery:check` impede que os cinco
recursos sensíveis nasçam ligados e confirma os gates mínimos do workflow.

O workflow GitHub existe, mas sua execução remota e branch protection não foram
comprovadas porque este pacote local não possui checkout Git remoto configurado.

## Promoção
`commit → CI → artifact → staging → runtime evidence → approval → production`

Não rebuildar conteúdo diferente no momento do deploy quando puder promover o mesmo artefato.

## Migration
- append-only;
- aplicar em staging primeiro;
- backup/restore path conhecido;
- expand/contract quando mudança exigir compatibilidade.

## Rollout
V1:
- controlled cohort/pilot;
- feature flags;
- rollback simples;
- monitorar error rate/latency/DB/activation.

## Rollback
Código:
reverter release/commit.

Banco:
preferir forward fix; restore apenas quando necessário e previsto.

Feature:
desabilitar flag sensível primeiro quando seguro.
