# ADR-013 --- Mission Engine e Gamificação por Evolução

**Status:** ACCEPTED\
**Data:** 2026-08-18

## Contexto

O diagnóstico só cria valor sustentável se recomendações virarem
execução e resultados mensuráveis. LLM livre não deve inventar a
metodologia operacional.

## Decisão

Criar uma **Mission Library versionada**. IA personaliza e sequencia
missões, mas templates e critérios de conclusão permanecem governados.

### State machine

`SUGGESTED → ACCEPTED → IN_PROGRESS → EVIDENCE_PENDING → COMPLETED → OUTCOME_PENDING → OUTCOME_RECORDED`

Alternativos: `PAUSED`, `BLOCKED`, `CANCELLED`, `EXPIRED`.

### Contrato mínimo do template

-   id/version;
-   domínio/capability;
-   triggers;
-   pré-requisitos;
-   objetivo;
-   passos;
-   critérios de conclusão;
-   evidência exigida;
-   KPI/outcome;
-   esforço/prazo sugerido;
-   risco;
-   segmentos aplicáveis;
-   regras de follow-up.

## Gamificação

Gamificação não recompensa clique, login ou consumo de IA. Recompensa
completude útil, execução, evidência, melhoria e outcome.

Níveis: 1. Diagnosticada 2. Estruturando 3. Em Evolução 4. Qualificada
5. Referência 6. Alta Maturidade

Capital Ready é trilha separada.

## Consequências

-   comparabilidade entre empresas;
-   menor alucinação;
-   criação de dataset de execução/outcome;
-   biblioteca exige governança editorial e versionamento.

## Trigger de revisão

Permitir missões totalmente geradas somente quando evals demonstrarem
equivalência/superioridade e houver guardrails por risco.
