# ADR-020 — Adaptive Diagnostic + Confidence Engine

**Status:** ACCEPTED  
**Date:** 2026-08-28

## Decision
- Preserve 144 questions as a library.
- Use 24 stable score anchors.
- Start with 31 high-yield interactions.
- Select follow-ups deterministically.
- Keep Progress and Confidence separate.
- `Unknown` never equals maturity zero.
- Text length never equals answer quality.
- Adaptive questions do not silently change the Growth Score denominator.

## Why
This protects:
- UX;
- comparability;
- future benchmark quality;
- auditability;
- methodology stability.

## Complexity
No new runtime platform or dependency is introduced.
