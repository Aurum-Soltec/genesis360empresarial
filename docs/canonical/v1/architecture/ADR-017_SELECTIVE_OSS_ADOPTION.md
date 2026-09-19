# ADR-017 — Selective OSS Adoption

**Status:** ACCEPTED  
**Date:** 2026-08-28

## Context
The Genesis V1 already has a coherent Next.js/Supabase modular core. Full CRM/ERP/agent control planes would duplicate boundaries.

## Decision
Adopt patterns, not platforms:
- Deskcomm-inspired DB invariant testing and durable event log/outbox;
- Comp CRM-inspired Evidence Ledger and agent-without-DB-credentials boundary;
- curated security skills as internal review artifacts;
- Pydantic AI Slim only as isolated spike.

## Consequences
Positive:
- faster foundation verification;
- stronger evidence/provenance;
- safer agent architecture;
- no new production infrastructure.

Negative:
- some implementation remains ours;
- pattern provenance must be maintained;
- agent framework decision remains pending.

## Rejected now
Paperclip runtime, Hermes runtime, AgentOS, CRM/ERP incorporation, Temporal, OPA, Semantica runtime, Forms.md runtime, ScrapeGraph runtime.
