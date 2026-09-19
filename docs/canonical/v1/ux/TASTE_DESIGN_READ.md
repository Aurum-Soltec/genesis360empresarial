# TASTE DESIGN READ - GENESIS 360 EMPRESARIAL

**Fonte metodológica:** Taste Skill, baseline consultada em 2026-08-18.

## Leitura do brief

Produto:
- SaaS B2B para gestores de PMEs;
- confiança, clareza e inteligência contínua;
- uso recorrente, não landing page;
- decisões empresariais e dados potencialmente sensíveis.

Direção pedida:
- Apple/Tesla inspired, sem cópia;
- light theme;
- ultra clean;
- alto contraste;
- fluido;
- premium sem ostentação;
- dashboard direto para gestor;
- topbar para módulos principais;
- sidebar para submenus/contexto.

## Dials aplicados

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 4`
- `VISUAL_DENSITY: 4`

Justificativa:
- variância moderada para fugir de dashboard genérico sem sacrificar clareza;
- motion funcional, não cinematográfico;
- densidade média: há dados, mas a primeira viewport deve priorizar decisão.

## Anti-default aplicado

Não usar:
- dark mesh;
- AI purple gradient;
- glassmorphism generalizado;
- três cards iguais como padrão de todas as seções;
- excesso de badges;
- eyebrows acima de todo título;
- status dots decorativos;
- fake dashboards;
- números inventados;
- 6 linhas de headline;
- animação infinita sem função;
- Inter como escolha explícita padrão.

## Tema

Uma única família de tema: light. Tints claros podem variar sem inversão para dark.

## Motion

- entrada sutil de painel;
- transições de 160-240ms;
- layout change apenas quando ajuda orientação;
- sem autoplay decorativo;
- respeitar `prefers-reduced-motion`.

## Typography

Usar system UI de alta qualidade sem distribuir fonte:
`-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`.

Quando uma fonte oficial de marca for aprovada, criar ADR antes de incorporar.
