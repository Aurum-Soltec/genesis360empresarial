# ADR-019 — End-to-End Core e Matching Fail-Closed

**Status:** ACCEPTED  
**Data:** 2026-08-28

## Decisão

### 1. O ciclo operacional V1
`Pain → GDS → Mission → Evidence → Outcome → Timeline`

### 2. O ciclo de rede
`Pain → Capability → Eligibility → Neutral Ranking → Consented Contact`

### 3. Cross-tenant
Dados de providers de outros tenants não são liberados por RLS ao consumidor.
O matching é calculado por serviço confiável e retorna somente campos aprovados.

### 4. Policy pending = no result
Se threshold, capability mapping ou plan eligibility não estiverem publicados:
**zero provider é exibido**.

### 5. Plano
Plan é gate de elegibilidade. Não participa do score de ranking.

### 6. Missing evidence
Ausência de outcome/capacity score não equivale automaticamente a desempenho ruim.
O ranking renormaliza pesos entre componentes disponíveis.

### 7. Outcome
Outcome sempre cria Timeline.
Atualização de Passport ocorre apenas quando mission template versionado declara explicitamente uma key de projeção.

## Alternativas rejeitadas
- permitir browser ler provider tables cross-tenant;
- hardcode de threshold;
- Pro ganhar peso de ranking;
- LLM criar capability;
- LLM publicar provider match;
- update genérico de Passport a partir de texto livre.
