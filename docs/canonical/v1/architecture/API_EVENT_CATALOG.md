# API & Event Catalog

## HTTP domains
### Tenant
`POST /api/tenant/active`

### Consent/Governance
`POST /api/consents`
`GET /api/attestations/current`
`POST /api/attestations`
`POST /api/upload-sessions`

### Passport/Evidence
`GET|POST /api/passport/facts`
`GET /api/passport/timeline`
`GET|POST /api/evidence`

### Diagnostic
`POST /api/diagnostics`
`GET /api/diagnostics/{id}/state`
`PUT /api/diagnostics/{id}/answers`
`POST /api/diagnostics/{id}/submit`

### Decision/Mission
`POST /api/pains/{id}/gds`
`POST /api/decisions/{id}/missions`
`POST /api/missions/{id}/transition`
`POST /api/missions/{id}/evidence`
`POST /api/missions/{id}/outcome`

### Solutions
`GET /api/solutions`
`POST /api/solutions/contact`

OpenAPI canônico: `/docs/API/openapi.yaml`.

## Eventos duráveis
- mission status changed;
- mission outcome recorded;
- solution contact requested;
- data submission attestation accepted;
- demais eventos mapeados pelos triggers/outbox atuais.

## Regras
- nenhuma chamada externa crítica dentro de trigger;
- outbox claim/lease/complete/fail/dead;
- payload de evento minimizado;
- idempotency key obrigatória;
- consumer futuro deve ser idempotente.
