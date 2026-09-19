# GENESIS 360 V1 --- GAP ANALYSIS CANÔNICO

**Baseline:** 2026-08-18\
**Gate:** GZ-C → implementação controlada\
**Comparação:** PRD V1 canônico × `genesis360v3-main`

## 1. Veredito executivo

O repositório V3 deve ser **evoluído, não reescrito**. A stack,
estrutura Next.js, scoring determinístico inicial, migration base, RLS
inicial, consentimentos, audit log, CI e dataset diagnóstico são ativos
preserváveis.

O principal gap é que a maior parte do ciclo V1 ainda existe como
especificação, demo ou contrato, não como fluxo persistido end-to-end.

## 2. Inventário verificado no repositório

-   Next.js 16.2.6 / React 19.2 / TypeScript 6 / Tailwind 4.
-   Supabase/PostgreSQL e Zod.
-   Vitest e CI GitHub Actions.
-   1 migration `0001_core.sql`.
-   144 perguntas no `diagnostic-master.json`.
-   24 perguntas no `diagnostic-m0.json`.
-   scoring determinístico em `lib/scoring.ts`.
-   tabelas: tenants, memberships, companies, consent_versions,
    consents, diagnostic_versions, diagnostics, answers, score_results,
    tax_assessments, referrals, audit_events.
-   UI existente: home, diagnóstico, resultado, CTO-Tax e referral.
-   55 story prompts V3 e documentação extensa.

## 3. Matriz de preservação

  ----------------------------------------------------------------------------
  Componente V3                Estado                  Decisão V1
  ---------------------------- ----------------------- -----------------------
  Next.js/React/TS             implementado            PRESERVAR

  Supabase/Postgres            implementado inicial    PRESERVAR

  UI shell/design              protótipo               PRESERVAR/EVOLUIR

  diagnostic-master 144        ativo de conteúdo       PRESERVAR e versionar

  diagnostic-m0 24             demo                    PRESERVAR como perfil
                                                       essencial, revisar

  scoring.ts                   unitário inicial        PRESERVAR e evoluir
                                                       para rules engine

  schema tenants/memberships   parcial                 REFATORAR tenant
                                                       context

  consent_versions/consents    parcial                 EVOLUIR por finalidade

  audit_events                 fundação                EVOLUIR
                                                       append-only/coverage

  tax_assessments/referrals    demo legado             ENCAPSULAR; fora do
                                                       caminho crítico V1

  Business Twin docs           especificado            SUPERADO por
                                                       Passport/DNA/Timeline
                                                       V1

  Bronze/Prata/Ouro/Platinum   especificado            SUPERADO por
                                                       Free/Start/Pro

  Unique hardcoding/referral   legado demo             REMOVER do core;
                                                       generalizar

  CI                           implementado            PRESERVAR e endurecer

  OpenAPI V3                   especificação           RECONCILIAR com
                                                       contratos V1
  ----------------------------------------------------------------------------

## 4. Gaps por domínio

### GAP-P0-01 --- Tenant/auth

RLS existe, porém `current_tenant_id()` seleciona a primeira membership.
Isso não suporta tenant ativo explícito nem prova isolamento
cross-tenant.

### GAP-P0-02 --- Diagnóstico end-to-end

Há conteúdo e scoring, mas a página atual é demo; faltam sessão real,
branching, autosave, submit, versionamento efetivo, cálculo persistido e
resultado real.

### GAP-P0-03 --- Passport/DNA/Timeline

Não existem entidades V1 para fatos com source, captured_at, confidence,
sensitivity e verification status.

### GAP-P0-04 --- Pain/Cause/GDS

Resultado atual está hardcoded. Faltam pain findings, evidence links,
root-cause hypotheses, decision records e versionamento das regras.

### GAP-P0-05 --- Mission Engine

Não existem schema/state machine/library/outcome operacional.

### GAP-P0-06 --- Qualification Engine

Não existem capabilities, provider qualification, eligibility, score
threshold, rule version ou ranking explicável.

### GAP-P0-07 --- Planos/entitlements

ST-041 existe como especificação, mas Free/Start/Pro V1 e budgets não
estão implementados.

### GAP-P0-08 --- Produção

Faltam evidências atuais de cross-tenant tests, restore testado,
deploy/rollback, SLO/workload, observabilidade completa e security
release gate.

### GAP-P1-01 --- Agentic Runtime

ST-039 prevê contratos/evals, mas runtime V1, context assembly, tool
authorization, budgets, kill switch e Conselho Genesis não estão
implementados.

### GAP-P1-02 --- Ecosystem

Não existe domínio de ecossistema, membership institucional,
branding/configuração e analytics agregado.

### GAP-P1-03 --- Matching/outcomes

Referral legado é específico de Tax/Unique; precisa virar fluxo genérico
necessidade → capability → empresa qualificada → contato consentido →
outcome.

### GAP-P1-04 --- Gamificação

Growth Score existe parcialmente; níveis, critérios objetivos e
progressão por evidência/outcome não existem.

## 5. Drift documental

-   README ainda define M0/M1/V1 Starter e Antigravity.
-   planos Bronze/Prata/Ouro/Platinum estão superados.
-   Business Twin deve ser reinterpretado como Passport/DNA/Timeline.
-   "recomendação de parceiro" deve migrar para "soluções qualificadas
    para esta necessidade".
-   acompanhamento humano embutido em planos está superado.
-   Unique deixa de ser regra estrutural do produto.

## 6. Riscos bloqueantes

1.  isolamento tenant não comprovado;
2.  mistura entre demo e produção;
3.  ausência de modelo de qualificação anti-gaming;
4.  IA antes de contratos determinísticos;
5.  coleta de Big Data sem finalidade/proveniência;
6.  ranking influenciado comercialmente;
7.  ausência de evidência de restore/rollback;
8.  custo de IA sem budgets.

## 7. Conclusão

**Não reescrever.** Criar migrations incrementais, preservar contratos
úteis e fechar primeiro o vertical slice V1 production-ready.
