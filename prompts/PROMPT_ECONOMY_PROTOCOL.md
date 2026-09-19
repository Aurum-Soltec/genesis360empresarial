# Protocolo de economia de tokens

## Objetivo

Reduzir repetição sem perder contexto, segurança ou aceite.

## Camadas

### Camada permanente

- `AGENTS.md`
- `.project-ai/memory/project-state.json`
- ADRs
- design tokens

### Camada do épico

- `prompts/epics/EP-XX.md`
- somente requisitos do domínio

### Camada da história

- `prompts/stories/ST-XXX.md`
- arquivos diretamente afetados
- critérios e testes

## Regra 20/80

O prompt da história não repete o PRD. Ele referencia IDs e inclui apenas:

- objetivo;
- regras críticas;
- escopo;
- aceite;
- testes;
- parada;
- retorno.

## Relatório incremental

Em correção, enviar ao Antigravity:

1. relatório anterior;
2. trecho do diff ou erro;
3. prompt corretivo;
4. não reenviar todo o projeto.

## Compactação de contexto

Após cada história:

- atualizar `project-state.json`;
- registrar decisão em ADR;
- resumir implementação em no máximo 12 linhas;
- apontar commit;
- manter testes como evidência.

## Proibições

- colar todos os 144 itens de diagnóstico em prompt;
- repetir documentação já presente no repositório;
- enviar arquivos sem relevância para a história;
- pedir “faça tudo”;
- permitir interpretação livre do escopo.
