# Agentic Runtime Spike Scorecard

| Criterion | Minimal custom | Pydantic AI Slim | Agno SDK |
|---|---:|---:|---:|
| Glue LOC | measure | measure | measure |
| Typed tool schemas | measure | measure | measure |
| Structured output | measure | measure | measure |
| Test model / eval ergonomics | measure | measure | measure |
| OTel path | measure | measure | measure |
| Provider portability | measure | measure | measure |
| Dependency count | measure | measure | measure |
| Cold start | measure | measure | measure |
| p50/p95 latency overhead | measure | measure | measure |
| Cost/run | same model | same model | same model |
| Exit cost | measure | measure | measure |

## Pass conditions

Pydantic AI becomes preferred only if:
- no DB credential appears in runtime;
- only authored read tools are available in phase 1;
- all 10 golden cases pass required invariants;
- no framework-specific state becomes Genesis source of truth;
- measured glue/operability is better than minimal custom;
- security/dependency scan passes the pinned release.

Until then: **candidate, not production dependency**.
