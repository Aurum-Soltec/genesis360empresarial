# DATA ARCHITECTURE

## Estrutura temporal

Cada fato relevante deve carregar:
- valor;
- source;
- captured_at;
- confidence;
- sensitivity;
- verification_status;
- purpose_codes;
- valid_from / valid_to.

## Business DNA
Estado atual consultável.

## Business Timeline
Eventos e versões históricas.

## Outcome Intelligence
Relações para aprendizado:

`contexto + pain + decision + mission + capability + provider + outcome`

Na V1 isso permanece relacional. Graph DB só entra com workload que justifique.

## Data quality

Métricas mínimas:
- completeness;
- freshness;
- source distribution;
- verified ratio;
- conflict rate;
- missing required facts;
- stale fact ratio.

## Big Data guardrails

- não inferir causalidade de correlação;
- benchmark exige coorte mínima;
- não expor dado individual em dashboard institucional;
- agregados devem suportar suppression policy;
- consentimento/finalidade precisam ser verificáveis.
