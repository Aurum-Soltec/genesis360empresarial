# FRONTEND ARCHITECTURE

## Stack

- Next.js App Router;
- React;
- TypeScript;
- Tailwind CSS v4;
- CSS variables para tokens;
- Server Components por padrão;
- Client Components apenas onde interação exige.

## Dependências UI

Não adicionar biblioteca automaticamente sem atualizar lockfile e OSS gate.

Candidatos aprováveis:
- Radix Primitives para comportamento acessível;
- Phosphor Icons para ícones;
- Motion para motion de complexidade real.

## Boundaries

- `app/`: routes/composition;
- `components/`: primitives e product components;
- `lib/`: view models, rules, adapters;
- `data/`: question bank e taxonomias versionadas;
- `design/`: tokens e navigation machine-readable.

## Regra de componente

Todo componente crítico documenta:
- estados;
- a11y;
- loading;
- error;
- permission;
- empty;
- telemetry.

## Responsive

- desktop: topbar 72px + sidebar 240px;
- tablet: sidebar recolhível;
- mobile: topbar + drawers/tabs;
- conteúdo usa max-width funcional e não “hero marketing” gigante.
