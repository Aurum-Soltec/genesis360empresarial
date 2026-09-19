# ADR-018 — Agentic Runtime Spike: Pydantic AI Slim

**Status:** ACCEPTED FOR SPIKE / NOT PRODUCTION-APPROVED  
**Date:** 2026-08-28

## Candidate
`pydantic-ai-slim==2.33.0` (MIT), isolated Python runtime.

## Why
- minimal package option;
- typed dependencies/tools;
- structured outputs;
- TestModel/eval path;
- optional provider integrations;
- no need for AgentOS/control plane.

## Boundary
The agent never receives:
- `DATABASE_URL`;
- Supabase service role;
- direct table access;
- tenant selection authority.

Phase 1 exposes exactly three read tools:
- Passport;
- deterministic diagnostic summary;
- pain evidence.

## Competition
The candidate must beat a minimal custom orchestration layer. Agno SDK remains fallback.

## Adoption gate
No decision until:
- pinned dependency scan passes;
- 10-case golden set passes;
- latency/cost measured;
- observability path proven;
- no Genesis state is stored inside framework-specific memory;
- exit path is documented.
