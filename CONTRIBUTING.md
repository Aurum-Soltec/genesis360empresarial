# Contributing — Genesis 360 Empresarial

## Princípios
- PRD/ADR/contrato antes de mudança estrutural.
- Segurança e tenant isolation antes de conveniência.
- Não adicionar dependência sem justificar redução de complexidade total.
- Não introduzir números fake em produção.
- Não alterar migration já aplicada.
- Não usar LLM como source of truth transacional.

## Fluxo
1. escolha uma story canônica;
2. confirme gate/decisões pendentes;
3. crie branch curta;
4. implemente com testes;
5. rode quality gates;
6. atualize docs/traceability;
7. abra PR usando o template;
8. anexe evidências relevantes.

## Branches
Sugestões:
- `feat/V1-ST-xxx-description`
- `fix/V1-ST-xxx-description`
- `security/V1-ST-xxx-description`
- `docs/V1-ST-xxx-description`

## Commits
Conventional style recomendado:
- `feat:`
- `fix:`
- `security:`
- `test:`
- `docs:`
- `refactor:`
- `chore:`

## Mudança estrutural
Exige ADR quando altera:
- tenancy;
- source of truth;
- scoring;
- ranking;
- agent runtime;
- design system;
- principal runtime/DB;
- state machine;
- security boundary.
