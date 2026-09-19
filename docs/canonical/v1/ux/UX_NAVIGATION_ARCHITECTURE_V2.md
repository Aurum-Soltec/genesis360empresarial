# UX Navigation Architecture V2

## Principle
Macro navigation belongs to the topbar. Context belongs to the sidebar.

The user should never need to decide between duplicate links in both places.

## Macro modules
- Hoje
- Diagnóstico
- Evolução
- Soluções
- Conselho
- Ecossistema only when feature-enabled

## Contextual sidebars

### Hoje
- Visão executiva
- Prioridades
- Indicadores
- Histórico

### Diagnóstico
- Diagnóstico atual
- Resultado
- Evidências

### Evolução
- Missões

### Soluções
- Soluções qualificadas
- Minhas capacidades

### Conselho
- Conselho Genesis

### Company utilities
Separated from the active journey:
- Business Passport
- Documentos
- Privacidade

## Route state
`usePathname()` drives:
- active macro module;
- active contextual item;
- `aria-current="page"`.

## Mobile
Desktop nav is replaced by a real off-canvas drawer:
- macro modules;
- contextual links;
- utilities;
- backdrop;
- close button;
- Escape-to-close;
- `aria-expanded`.
