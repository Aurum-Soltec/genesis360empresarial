 > **ATUALIZAÇÃO V1.2.1 RC1 — 2026-09-10:** para executar ou continuar o projeto, prevalecem
> `PROJECT-STATE.md`, `START_HERE_V1_2_1.md` e o adendo `docs/canonical/v1/product/PRD_HARDENING_V1_2_1.md`.
> O texto abaixo é a baseline histórica; seus “passes” não comprovam este candidato.

# Genesis 360 Empresarial — Production Foundation Master

**Baseline:** V1.2  
**Data:** 2026-08-28  
**Estado:** FOUNDATION LOCKED BY CONTRACT / RUNTIME VERIFICATION PENDING  
**Repositório alvo:** `https://github.com/Aurum-Soltec/genesis360empresarial`

Este pacote é a baseline consolidada para iniciar a produção do **Genesis 360 Empresarial** no ChatGPT Work ou em ambiente local.

## O que este pacote contém
- aplicação full-stack existente;
- 12 migrations e 10 suites SQL;
- PRD canônico;
- arquitetura;
- modelo de domínio/dados/APIs/eventos;
- segurança, LGPD e governança;
- UX Genesis Precision Light V2;
- diagnóstico adaptativo V1.1;
- Business Passport;
- GDS;
- Mission Engine;
- Qualification Network fail-closed;
- Agentic spike isolado;
- 132 requisitos canônicos;
- 103 stories existentes;
- backlog de produção enriquecido;
- ondas, gates, riscos e handoff;
- GitHub bootstrap e políticas de contribuição.

## Ordem de leitura no Work
1. `00_PRODUCTION_START_HERE.md`
2. `docs/canonical/v1/foundation/MASTER_INDEX.md`
3. `docs/canonical/v1/00_PROJECT_STATE.md`
4. `docs/canonical/v1/product/PRD_GENESIS_360_V1_CANONICO.md`
5. `docs/canonical/v1/foundation/PRODUCTION_FOUNDATION_BLUEPRINT.md`
6. `docs/canonical/v1/delivery/EPICS_MASTER.md`
7. `docs/canonical/v1/delivery/STORIES_MASTER.md`
8. `docs/canonical/v1/delivery/PRODUCTION_WAVES_MASTER.md`
9. `docs/canonical/v1/gates/GATES.json`
10. `docs/canonical/v1/foundation/WORK_PRODUCTION_HANDOFF.md`

## Regra de início
Não expandir superfície funcional antes de executar os gates runtime da Foundation.

O primeiro trabalho de produção é **verificar e endurecer a fundação atual**, não redesenhá-la.

## Fonte de verdade
Em conflito:
1. segurança/legal/privacidade;
2. este baseline V1.2;
3. PRD canônico;
4. ADRs aceitos;
5. contratos/migrations;
6. backlog;
7. docs V3 históricos.

## Evidência dos pacotes de origem
- Foundation V1 enviado pelo usuário: `d00586fb9f6cc2cf281ed1a8474bcf319ce08b3727f359c4e01d971de57875e0`
- Wave 8 consolidada: `3c7ac0a7141a8011602a82bec49d255681571428bd1c553819dad5e42d2fab6e`

A Wave 8 já continha todos os caminhos do Foundation V1 enviado e os artefatos incrementais posteriores.
