# ADR-012 --- Qualification Engine e Rede de Soluções

**Status:** ACCEPTED\
**Data:** 2026-08-18

## Contexto

O Genesis deve conectar dores identificadas a empresas capazes de
fornecer a solução sem transformar resultado em publicidade ou endosso
comercial.

## Decisão

Separar:
`pain → required capability → eligible providers → ranked qualified providers`.

A interface usará **"Soluções qualificadas para esta necessidade"** e
**"Qualificada para atender esta necessidade"**, evitando "Genesis
recomenda contratar".

Elegibilidade mínima: 1. qualificação ativa; 2. score mínimo aplicável;
3. plano elegível ativo; 4. capability compatível; 5. compliance válido;
6. disponibilidade/capacidade compatível quando exigida.

Ranking prioriza fit, qualificação, maturidade/segurança, capacidade,
reputação/outcomes e contexto. Plano pode habilitar participação, mas
não comprar posição.

PGTI, BPO Finance, patrocinadores e empresas relacionadas seguem as
mesmas regras.

## Auditabilidade

Persistir versão da regra, fatores utilizados e explicação do match.
Mudança de regra não altera retroativamente o histórico.

## Consequências

-   confiança e neutralidade;
-   marketplace menor e controlado;
-   base para atribuição e Outcome Graph;
-   exige taxonomia versionada de dores/capabilities.

## Riscos

gaming de score, qualificação falsa, conflito de interesse, ranking
comprado, baixa capacidade de atendimento.

## Controles

recertificação, evidência, auditoria, thresholds, anti-gaming,
disclosure de conflito e monitoramento de outcomes.
