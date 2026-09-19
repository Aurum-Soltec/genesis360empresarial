# Wave 3 — Diagnostic UX + Pain/Cause/GDS
**Data:** 2026-08-18

## Implementado
- jornada `/diagnostico-v1` com início, progresso, autosave e conclusão;
- resultado `/resultado-v1` com score/cobertura/confiança reais;
- política conservadora de applicability;
- projeção auditável inicial diagnóstico → Passport;
- schema de `cause_hypotheses`;
- schema de `decision_records`;
- contrato GDS;
- fallback GDS determinístico que explicitamente NÃO inventa causa-raiz;
- endpoint para criar Decision Record a partir de pain finding;
- RLS/tenant guards para novos domínios.

## Pendências deliberadas
- catálogo metodológico de branching por setor/porte;
- enriquecimento de evidências;
- hipóteses de causa via regras/agent com evals;
- ligação do GDS ao Mission Engine;
- execução real de lint/typecheck/test/build/migrations/cross-tenant.

## Próximo gate
Mission Engine V1 + corrigir divergência de seleção Essential na UI antes de release.
