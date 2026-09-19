# ADR-022 — Genesis Precision Light V2

**Status:** ACCEPTED  
**Date:** 2026-08-28

## Context
The Wave 7 frontend was functionally coherent but still displayed generic dashboard traits:
- broad duplicated navigation;
- no functional mobile menu;
- weak active-route feedback;
- card-heavy hierarchy;
- inconsistent Result surface.

## Decision
Adopt Genesis Precision Light V2.

### References
- Taste Skill: redesign/audit discipline and anti-default visual quality.
- shadcn/ui: component anatomy and accessibility reference.
- Open Design: portable design-system package contract.

### Runtime decision
Do **not** add shadcn/Radix/font/chart runtime dependencies in Wave 8.

Reason:
the current stack can express the approved interaction model without increasing dependency surface before build verification.

## Consequences
Positive:
- no backend rewrite;
- no dependency expansion;
- mobile navigation works;
- canonical screens define a reusable grammar;
- clearer journey for non-technical managers.

Trade-off:
- some interaction primitives remain owned code;
- shadcn may still be adopted later where it materially reduces accessibility/maintenance cost.

## Revisit trigger
Adopt an external component primitive only when:
- interaction complexity is non-trivial;
- accessibility burden is recurring;
- the component removes more code/risk than it adds.
