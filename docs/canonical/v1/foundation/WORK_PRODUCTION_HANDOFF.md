# Work Production Handoff

## Missão da próxima sessão
Transformar a baseline V1.2 em **runtime-verified release candidate** sem rewrite.

## Prompt recomendado para o Work

```text
Você está trabalhando no Genesis 360 Empresarial.

Leia, nesta ordem:
1. 00_PRODUCTION_START_HERE.md
2. docs/canonical/v1/foundation/MASTER_INDEX.md
3. docs/canonical/v1/00_PROJECT_STATE.md
4. docs/canonical/v1/product/PRD_GENESIS_360_V1_CANONICO.md
5. docs/canonical/v1/foundation/PRODUCTION_FOUNDATION_BLUEPRINT.md
6. docs/canonical/v1/delivery/PRODUCTION_WAVES_MASTER.md
7. docs/canonical/v1/delivery/STORIES_MASTER.md
8. docs/canonical/v1/gates/GATES.json
9. docs/canonical/v1/risks/RISKS.json
10. AGENTS.md

Classifique o trabalho como GZ-C / IMPLEMENTATION.

Não faça rewrite.
Não altere arquitetura sem ADR.
Não invente decisões PEND.
Não habilite feature sensível para completar demo.

Primeiro execute PW-0:
- V1-ST-104 GitHub bootstrap
- V1-ST-105 migrations 0001→0012
- V1-ST-106 pgTAP
- V1-ST-107 lint/typecheck/test/build

Registre EVIDENCE e atualize gates.
Somente corrija falhas comprovadas.
```

## Critério de handoff saudável
Ao terminar cada onda, atualizar:
- PROJECT_STATE;
- DECISIONS;
- PENDING_DECISIONS;
- RISKS;
- GATES;
- CHANGELOG;
- STORIES;
- release evidence.

## Nunca declarar
- production-ready sem runtime;
- security-safe sem tests;
- backup-ready sem restore;
- AI-safe sem evals;
- LGPD-compliant apenas porque existe checkbox.
