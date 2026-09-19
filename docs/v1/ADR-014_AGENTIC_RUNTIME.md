# ADR-014 --- Agentic Runtime

**Status:** ACCEPTED WITH IMPLEMENTATION GATE\
**Data:** 2026-08-18

## Contexto

A V1 precisa de inteligência agentic sem entregar autorização, score ou
verdade transacional ao LLM.

## Decisão arquitetural

Criar uma fronteira **Genesis Intelligence Runtime** separada do domínio
transacional.

O usuário interage com **Conselho Genesis**. Internamente, um
orquestrador seleciona especialistas conforme domínio, contexto e risco.

PostgreSQL/serviços Genesis continuam fonte de verdade para: -
identidade e tenant; - Passport; - score; - planos; - qualificação; -
elegibilidade; - missões; - consentimento; - outcomes; - autorização.

Agentes recebem contexto mínimo autorizado e retornam outputs
estruturados.

## Guardrails obrigatórios

-   tool allowlist;
-   schemas estritos;
-   read/write segregados;
-   least privilege;
-   confirmação para ação irreversível;
-   budgets de tempo/tokens/custo/tool calls;
-   stop conditions;
-   audit trail;
-   prompt-injection defenses;
-   fallback/abstenção;
-   kill switch;
-   evals normal/edge/adversarial;
-   model/provider abstraction.

## Framework

**Agno é candidato aprovado para spike, não dependência aprovada
automaticamente para produção.**

Na data-base, o repositório oficial do Agno declara licença Apache-2.0 e
oferece SDK/runtime para agentes. A adoção final exige: 1. pin de
versão; 2. dependency/license scan; 3. security review; 4. prova de
isolamento/autorização; 5. teste de observabilidade; 6. benchmark de
custo/latência; 7. exit strategy.

## Rejeitado

-   agentes com acesso direto irrestrito ao banco;
-   memória do framework como fonte de verdade;
-   sete chatbots independentes como UX padrão;
-   decisão crítica autônoma;
-   lock-in em um único provedor de modelo.

## Trigger de revisão

Reavaliar runtime se custo, segurança, maturidade, performance ou
licença mudarem materialmente.
