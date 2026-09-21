# Genesis Precision Light

## Product atmosphere
Genesis is not a generic admin dashboard. It is a premium decision environment for managers who may not be technical.

The desired feeling is:
- calm;
- precise;
- expensive without ornament;
- trustworthy;
- guided;
- business-first.

The system is light-only in V1. No global dark canvas.

## Composition
Use whitespace before borders and borders before shadows.

A screen should have one dominant question or decision. Supporting material is visually subordinate.

Default information order:
1. what matters now;
2. why it matters;
3. what to do next;
4. evidence/details on demand.

Avoid symmetric “four KPI cards” as the default page structure.

## Color and contrast
Canvas is a cool light neutral `#F5F8F7`; primary surfaces are white.

Genesis Deep `#0B3D3A` carries authority. Accessible Genesis Green `#08783D`
carries text actions. Technology Green `#00C853` and Genesis Lime `#7ED321`
are brand signals, not large backgrounds or body-text colors.

The official horizontal mark is served from
`/public/brand/genesis-360-empresarial.png`. Do not reconstruct it with CSS or
replace it with an approximate glyph.

Primary text must remain near-black. Secondary copy must preserve WCAG AA contrast for normal text.

Status is never represented only by color.

## Typography
Use a high-quality native/system sans stack in this Wave. The brand reference
names DIN Next, but it must not be distributed until licensed font files are
provided and approved for web embedding.

Hierarchy:
- executive display: 44–48px / 600–650;
- page title: 32–38px / 600–650;
- section: 22–26px / 600;
- card title: 16–18px / 600;
- body: 15–16px / 400;
- UI/meta: 12–14px / 500–650.

Numbers use tabular numerals.

Avoid uppercase for long labels. Small uppercase/kicker text is allowed only as a structural cue.

## Navigation
Macro navigation lives in the topbar:
- Hoje;
- Diagnóstico;
- Evolução;
- Soluções;
- Conselho;
- Ecossistema only when enabled.

Sidebar content changes with the active macro module.

Utility company navigation remains separated at the bottom:
- Business Passport;
- Documentos;
- Privacidade.

Active location must always be visually identifiable.

Mobile must have a real navigation drawer, not a decorative “Menu” badge.

## Surfaces
Four levels only:
1. canvas;
2. surface;
3. inset/subtle surface;
4. elevated overlay.

Most page sections should not be cards.

Cards are appropriate when a visual boundary communicates:
- a primary decision;
- a self-contained task;
- a selectable entity;
- an overlay/dialog.

## Controls
Minimum interactive target: 44px.

Primary button:
- one dominant primary action per context;
- dark ink or Genesis Green background;
- no gradient.

Secondary:
- white/subtle background;
- visible border;
- no “ghost” control when discoverability would suffer.

Pills are reserved for statuses, filters or compact metadata.

## Data display
Prefer:
- ordered lists;
- horizontal score bars;
- compact deltas;
- progressive detail;
- plain-language interpretation.

Avoid:
- radar charts for first-read management views;
- decorative charts;
- fake data;
- charts without an explicit decision purpose.

## Motion
Motion supports hierarchy and continuity only.

Allowed:
- drawer entrance;
- hover/focus response;
- meter transitions;
- disclosure.

No infinite motion, floating decoration or animated gradients.

Respect `prefers-reduced-motion`.

## Accessibility
Baseline: WCAG 2.2 AA.

Requirements:
- visible focus;
- keyboard navigation;
- target size ≥44px;
- textual labels for statuses;
- no color-only meaning;
- semantic headings;
- accessible mobile navigation;
- readable empty/error/loading/recovery states.

## Anti-patterns
Do not introduce:
- generic AI purple gradients;
- glassmorphism as primary language;
- card soup;
- dark global background;
- excessive shadows;
- identical dashboard tiles with no hierarchy;
- fake “live” metrics;
- unexplained acronyms before plain-language meaning;
- duplicate topbar/sidebar links without contextual reason.

## Reference use
Taste Skill informs audit discipline, anti-default visual quality and redesign-preserve behavior.

shadcn/ui informs accessible interaction/component anatomy. Wave 8 does not vendor shadcn code or add a runtime dependency.

Open Design informs the portable design-system package contract (`manifest.json`, `DESIGN.md`, `tokens.css`).

Genesis remains the source of product identity and information architecture.
