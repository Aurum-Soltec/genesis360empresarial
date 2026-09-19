# Production Kickoff Checklist

## Repository
- [ ] ZIP extraído
- [ ] remote configurado
- [ ] primeiro commit
- [ ] main protegida
- [ ] CI acionada
- [ ] issue labels/milestones criados

## Environment
- [ ] Node/pnpm versões corretas
- [ ] `.env` local sem secrets versionados
- [ ] Supabase local/staging
- [ ] migrations bootstrap
- [ ] pgTAP

## Build
- [ ] install frozen
- [ ] lint
- [ ] typecheck
- [ ] unit
- [ ] build
- [ ] db:check

## Security
- [ ] dependency scan
- [ ] secret scan
- [ ] SBOM
- [ ] cross-tenant tests
- [ ] role tests

## UX
- [ ] Executive Home
- [ ] Diagnostic
- [ ] Result
- [ ] mobile
- [ ] keyboard
- [ ] 200% zoom

## Operations
- [ ] observability
- [ ] backup
- [ ] restore
- [ ] rollback
- [ ] incident owner

## Sensitive feature flags
Manter OFF até gate:
- upload;
- real contact;
- qualification network quando política não aprovada;
- agentic writes/autonomy;
- ecosystem analytics quando consent/policy não aprovados.
