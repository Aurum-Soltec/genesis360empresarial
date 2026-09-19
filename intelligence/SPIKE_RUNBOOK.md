# Pydantic AI Slim vs Minimal Genesis Orchestrator — Runbook

## Candidate A — minimal Genesis wrapper
Already present in:
- `lib/intelligence/minimal-gds-orchestrator.ts`
- `lib/intelligence/gds-draft.ts`

It uses existing Zod and adds no runtime dependency.

## Candidate B — Pydantic AI Slim
Isolated in `/intelligence`.

## Required comparison
Use the same model/provider, temperature, prompts, three read-only tools and golden cases.

Measure:
1. framework-specific LOC;
2. dependency/SBOM delta;
3. typed output/tool failures;
4. normal/edge/adversarial eval pass rate;
5. p50/p95 orchestration overhead;
6. trace quality;
7. retry/fallback ergonomics;
8. provider switch effort;
9. cold-start/memory;
10. exit cost.

## Decision rule
Prefer **minimal custom** when Pydantic AI does not materially improve safety, evals or operability.

Prefer **Pydantic AI Slim** only when the measured reduction in glue/testing/observability is greater than the dependency and Python-runtime cost.

Agno SDK remains fallback and should only be benchmarked if both candidates fail an important requirement.
