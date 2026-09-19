# Wave 0 — Implementation Report

**Data:** 2026-08-18  
**Escopo:** V1-ST-001..005

## Estado
- V1-ST-001: IMPLEMENTADO — baseline documental V1 incorporada e autoridade atualizada.
- V1-ST-002: IMPLEMENTADO — feature flags V1 deny-by-default; UI demo deixa de fixar Unique como destino estrutural.
- V1-ST-003: PARCIAL — servidor Supabase SSR + validação de usuário + seleção explícita de tenant implementados. Fluxo completo de login/session refresh ainda requer configuração/proxy e ambiente Supabase.
- V1-ST-004: PARCIAL/BLOCKER — RLS foi migrada de `current_tenant_id()` para membership-based authorization. Especificação de testes negativos criada, porém **não há prova executada cross-tenant** sem ambiente Supabase local/staging.
- V1-ST-005: IMPLEMENTADO EM SCHEMA — finalidades versionáveis/catálogo, mapeamento legado e contratos TypeScript. Fluxo UX grant/revoke será fechado na jornada de onboarding.

## Evidência executada
`node scripts/check-migrations.mjs` → PASS para `0001_core.sql` e `0002_v1_tenancy_and_consent.sql`.

## Evidência não disponível neste ambiente
`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`: pnpm/node_modules não estão disponíveis no runtime desta auditoria. Não declarar CI verde.

## Riscos / gaps
1. executar migration em Supabase local/staging e testes cross-tenant reais;
2. configurar SSR auth/session refresh conforme versão atual do Supabase/Next.js;
3. validar tipos/build com lockfile;
4. implementar UI de seleção de tenant e consentimentos;
5. nenhuma migration deve ser aplicada em produção antes de staging/rollback review.

## Próximo gate
Fechar ST-003/ST-004/ST-005 com ambiente executável e então iniciar V1-ST-006 — Business DNA facts/provenance.
