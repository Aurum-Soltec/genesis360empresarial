# Genesis 360 Empresarial

**Inteligência para pequenas e médias empresas crescerem com maturidade.**

> Entenda seu negócio. Decida melhor. Evolua continuamente.

## Estado
Production Foundation Master V1.2.

A fundação funcional e documental está consolidada, mas o projeto **não é declarado production-ready até os gates runtime serem executados**.

## Comece aqui
Leia [`00_PRODUCTION_START_HERE.md`](00_PRODUCTION_START_HERE.md).

Documentação canônica:
`docs/canonical/v1/foundation/MASTER_INDEX.md`.

## Produto
O Genesis organiza o ciclo:

`Business Passport → Diagnóstico → Score/Confidence → Prioridade → GDS → Missão → Evidência → Outcome → Timeline`

Rede:

`Necessidade → Capability → Qualification → Eligibility → Ranking neutro → Consentimento → Contato`

## Stack
- Next.js / React / TypeScript
- Supabase / PostgreSQL
- Zod
- Tailwind
- Vitest + pgTAP

Arquitetura: monólito modular.

## Repositório
Target oficial:
`https://github.com/Aurum-Soltec/genesis360empresarial`

## Primeira execução
```bash
pnpm install --frozen-lockfile
pnpm work:check
pnpm security:check
pnpm db:check
pnpm quality
```

Quando Supabase local estiver disponível:
```bash
supabase test db
```

## Produção
Siga:
`docs/canonical/v1/delivery/PRODUCTION_WAVES_MASTER.md`.

Não habilite feature sensível sem seu gate.
