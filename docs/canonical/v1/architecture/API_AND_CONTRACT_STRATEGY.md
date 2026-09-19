# API E CONTRATOS

## Baseline

A V1 preserva APIs internas Next.js e contratos machine-readable existentes, evoluindo para OpenAPI conforme os boundaries estabilizam.

## Convenções

- autenticação explícita;
- tenant context server-side;
- idempotência para autosave/comandos suscetíveis a retry;
- erros consistentes;
- correlation ID;
- timeout/retry definidos para dependências externas;
- validação Zod nas bordas;
- nenhuma autorização derivada de IDs externos.

## APIs prioritárias

- `/api/passport/facts`
- `/api/passport/timeline`
- `/api/consents`
- `/api/diagnostics`
- `/api/diagnostics/{id}/answers`
- `/api/diagnostics/{id}/submit`
- `/api/pains/{id}/gds`
- `/api/missions/{id}/transition`

## Evoluções planejadas

- qualification/search;
- consented contact;
- ecosystem analytics;
- agentic run;
- outcome recording.

## Regra

Contrato antes de acoplamento. Alteração breaking exige versão/migration path.
