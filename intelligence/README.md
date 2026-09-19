# Genesis Intelligence Runtime — Pydantic AI Slim Spike

**Status:** SPIKE ONLY  
**Framework candidate:** `pydantic-ai-slim==2.33.0`  
**Verified upstream release date:** 2026-08-21  
**License:** MIT

This directory is intentionally isolated from the Next.js runtime.

## Non-negotiable boundary

The agent:
- receives no `DATABASE_URL`;
- receives no Supabase service-role key;
- never selects tenant identity itself;
- uses authored Genesis read tools only;
- does not calculate transactional scores;
- does not authorize;
- does not mutate Business Facts, rankings or consent.

## Spike use case

Produce a **GDS draft** from:
1. Business Passport context;
2. diagnostic summary;
3. evidence linked to one pain.

The output is structured and remains a draft until Genesis domain rules accept it.

## Why Slim

The full `pydantic-ai` install brings providers, CLI, MCP, Evals, Web UI and other integrations. This spike starts with `pydantic-ai-slim` only. Provider/eval extras are opt-in.

## Acceptance gate

Pydantic AI is adopted only if it beats a minimal custom orchestration layer on:
- less glue code;
- typed tools/output;
- testability;
- observability path;
- provider portability;
- no privilege expansion;
- acceptable latency/cost;
- clean exit path.

No Web UI, MCP, web-fetch, Temporal or extra provider is enabled by default.
