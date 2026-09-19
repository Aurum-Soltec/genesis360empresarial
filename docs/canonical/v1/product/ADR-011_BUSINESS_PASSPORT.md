# ADR-011 --- Genesis Business Passport

**Status:** ACCEPTED\
**Data:** 2026-08-18

## Contexto

O V3 previa um Business Digital Twin completo. Para a V1, a necessidade
real é memória empresarial estruturada, temporal, compreensível para PME
e útil para diagnóstico, personalização, qualificação, matching e
aprendizado.

## Decisão

Adotar **Genesis Business Passport** como experiência de produto e
manter **Business DNA + Business Timeline** como conceitos internos. O
Passport é a primeira implementação pragmática do futuro Business
Digital Twin.

Cada fato relevante deve poder carregar `value`, `source`,
`captured_at`, `confidence`, `sensitivity`, `verification_status` e
escopo/finalidade de uso.

O estado atual e a evolução histórica serão preservados. PostgreSQL
permanece a fonte de verdade na V1.

## Consequências positivas

-   reduz complexidade do "Digital Twin" inicial;
-   linguagem mais clara para PME;
-   cria contexto acumulativo para agentes;
-   suporta qualificação e matching;
-   prepara Big Data/Outcome Graph sem graph DB precoce.

## Trade-offs

-   exige modelagem temporal e proveniência desde cedo;
-   aumenta disciplina de dados;
-   completude não pode virar incentivo para coleta excessiva.

## Rejeitado

-   twin em tempo real conectado a dezenas de sistemas na V1;
-   documento JSON monolítico sem proveniência;
-   graph database como requisito inicial.

## Trigger de revisão

Revisar quando integrações contínuas, volume histórico ou consultas de
relacionamento tornarem o modelo relacional inadequado.
