# Tech Stack Lock V1.2

Valores abaixo são os pins existentes no `package.json` desta baseline.

## Runtime
- Next.js `16.2.6`
- React `19.2.0`
- React DOM `19.2.0`
- Supabase SSR `0.12.0`
- Supabase JS `2.108.2`
- Zod `4.4.3`

## Tooling
- TypeScript `6.0.3`
- Tailwind CSS `4.3.0`
- ESLint `9.21.0`
- Vitest `4.1.0`

## Architecture lock
- package manager: pnpm;
- frontend/backend web: Next.js modular monolith;
- primary transactional DB: PostgreSQL/Supabase;
- auth: Supabase Auth;
- API validation: Zod;
- migrations: SQL append-only;
- tests: Vitest + pgTAP/Supabase DB tests;
- AI runtime: not production-approved; isolated spike only.

## Upgrade rule
Upgrade de versão não deve ser misturado com feature estrutural sem necessidade.

Para upgrade:
1. consultar release notes oficiais;
2. verificar breaking changes;
3. rodar quality + E2E;
4. avaliar security advisories;
5. atualizar lockfile;
6. registrar ADR se alterar arquitetura/comportamento material.
