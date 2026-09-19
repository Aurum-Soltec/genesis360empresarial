# Tech Stack Lock

Status: Resolvido (ST-001/ST-002 Bootstrap).

| Componente | Versão solicitada | Versão instalada | Data | Observação |
|---|---:|---:|---|---|
| Node.js | LTS compatível | v20.16.0 | 2026-06-26 | |
| pnpm | atual estável | 9.15.4 | 2026-06-26 | |
| Next.js | 16.2.x | 16.2.6 | 2026-06-26 | Atualizado de 16.2.0 para corrigir vulnerabilidades altas apontadas por `pnpm audit` |
| React | 19.2.0 | 19.2.0 | 2026-06-26 | |
| TypeScript | 6.0.0 | 6.0.3 | 2026-06-26 | Atualizado para 6.0.3 pois 6.0.0 exata não existe |
| Tailwind | 4.3.0 | 4.3.0 | 2026-06-26 | |
| Vitest | 4.1.0 | 4.1.0 | 2026-06-26 | Dependências opcionais do rolldown fixadas |
| Zod | 4.x | 4.4.3 | 2026-06-26 | |
| Supabase JS | resolver | 2.108.2 | 2026-06-26 | |
| Supabase SSR | resolver | 0.12.0 | 2026-06-26 | |
| ESLint | compatível com Next 16.2 | 9.21.0 | 2026-06-26 | Pin de compatibilidade aceito no M0; revisar após M0 |
| jsdom | compatível com Vitest/Testing Library | 24.1.0 | 2026-06-26 | Pin de compatibilidade aceito no M0; revisar após M0 |
| postcss | transitivo seguro | 8.5.10 | 2026-06-26 | Override pnpm para corrigir advisory transitivo via Next |
| @eslint/plugin-kit | transitivo seguro | 0.3.4 | 2026-06-26 | Override pnpm para corrigir advisory transitivo via ESLint |

## Evidência e pendências da auditoria ST-001/ST-002

- Build local comprovado não equivale a deploy externo de preview; URL, status HTTP, screenshot ou log de provedor seguem pendentes.
- `db:check` e presença de políticas não comprovam isolamento real entre tenants; testes cross-tenant permanecem obrigatórios em ST-016.
- Migrations aplicadas devem ser tratadas como append-only por processo/CI; o script local não prova sozinho que migrations antigas nunca serão alteradas.
- `pnpm audit` em `next@16.2.0` encontrou 16 vulnerabilidades, incluindo 8 altas; `next` foi atualizado para 16.2.6.
- Overrides pnpm foram aplicados para `postcss@8.5.10` e `@eslint/plugin-kit@0.3.4` após o audit residual em `next@16.2.6`.
