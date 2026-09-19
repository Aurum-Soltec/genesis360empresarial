# Security Production Baseline

## Trust model
Default deny.

### Browser
Untrusted for authorization decisions.

### Next server
Trusted application boundary, but every request still validates:
- authenticated user;
- active tenant;
- membership/role;
- consent/purpose when applicable;
- resource ownership.

### Database
RLS is defense-in-depth and mandatory for tenant-owned tables.

### Service role
Server-only. Never exposed to browser/agent.

### Agentic
Untrusted probabilistic component with authored tools only.

## High-risk abuse cases
1. tenant A lê/escreve tenant B;
2. user forja tenant/company IDs;
3. provider altera própria qualification;
4. plan tier compra ranking;
5. consent bypass;
6. upload de conteúdo malicioso/ilegal;
7. prompt injection aciona tool indevida;
8. secret aparece em log;
9. outbox dispara efeito duplicado;
10. admin path amplia privilégio.

## Required controls
- RLS negative tests;
- composite relation integrity;
- trusted RPCs for critical writes;
- idempotency;
- least privilege roles;
- sensitivity-aware reads;
- secure secrets management;
- dependency scanning/SBOM;
- audit trail;
- correlation IDs;
- feature kill switches;
- safe logs/redaction.

## Production blockers
- SEV0/SEV1 unresolved;
- cross-tenant pgTAP failing;
- service-role in client bundle;
- critical/high dependency vulnerability without acceptance;
- restore untested;
- upload enabled without scan/retention/access controls;
- agentic enabled without eval/budget/kill switch.
