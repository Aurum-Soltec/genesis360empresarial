# Components

## App Topbar
Purpose: macro navigation, brand, current company, help/profile entry points.
Height: 68px desktop.
No multi-line desktop navigation.

## Context Sidebar
Purpose: only navigation relevant to the selected macro module.
Active row uses text + background + left marker, not color alone.
Utilities are separated from module navigation.

## Mobile Drawer
Real off-canvas menu.
Includes macro navigation and contextual navigation.
Must expose `aria-expanded`, labelled close control and Escape-to-close.

## Executive Brief
The first meaningful surface on Home.
Contains:
- current interpretation;
- strongest actionable finding;
- primary CTA;
- optional secondary explanation.

## Metric Pair
Use for two concepts that must be read together, e.g. Growth Score + Confidence.
Do not split into many unrelated cards.

## Ordered Priority List
Index + title + plain-language description + confidence.
No card-per-priority unless the item becomes interactive.

## Score Bar
Dimension name + numeric score + horizontal position.
Optional confidence/coverage in secondary text.

## Mission Focus
Shows state, next action and continuation CTA.
Avoid exposing internal state-machine vocabulary before human wording.

## Diagnostic Meter
Progress and Confidence are visually parallel but semantically separate.

## Question Surface
One question dominates the screen.
Secondary actions (Não sei / N.A. / depois) are visually subordinate but discoverable.

## Result Hero
Shows:
- Growth Score;
- analysis Confidence;
- current maturity interpretation;
- top actionable finding.

Technical detail appears after the first-read layer.
