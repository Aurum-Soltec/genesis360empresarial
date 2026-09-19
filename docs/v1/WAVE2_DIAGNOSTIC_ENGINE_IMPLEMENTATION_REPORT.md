# Wave 2 — Diagnostic Engine V1
**Data:** 2026-08-18

## Implementado
- preservação do banco canônico de 144 perguntas;
- perfis ESSENTIAL (máx. 32) e FULL (144);
- seleção Essential determinística e balanceada por dimensão/fase/peso;
- sessão persistente de diagnóstico;
- autosave idempotente por diagnóstico/pergunta;
- score por dimensão determinístico usando maturidade 0–4 e peso;
- coverage/confidence;
- bloqueio de score com cobertura global < 60%;
- Top 3 pain findings derivados deterministicamente;
- persistência de scores e pain findings;
- migration 0004 incremental;
- testes unitários do engine.

## Limite deliberado
A V1-ST-011 ainda não está fechada: branching contextual por setor/porte/respostas depende de regras de aplicabilidade que precisam ser metodologicamente aprovadas. Não inventamos essas regras.

## Próxima implementação
1. regras de aplicabilidade/branching aprovadas;
2. UI real do diagnóstico consumindo APIs;
3. alimentação do Passport pelas respostas;
4. evidências/gaps mais ricos;
5. GDS.
