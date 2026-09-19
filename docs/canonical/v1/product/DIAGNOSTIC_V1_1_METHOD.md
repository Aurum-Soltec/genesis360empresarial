# Diagnóstico Genesis 360 — Método V1.1

**Status:** APPROVED BASELINE / calibration with real cohorts pending  
**Date:** 2026-08-28

## Principle
The objective is not to maximize question count. It is to maximize **information yield** while preserving score comparability.

## Three layers

### 1. Stable Score Core
24 comparable maturity anchors across 12 dimensions.

Two old Essential tax questions (`TAX-001`, `TAX-002`) remain important context/risk questions but are not treated as maturity by invention. Two existing scale questions (`TAX-003`, `TAX-004`) complete the stable score anchors.

### 2. High-yield context
7 additional starting interactions capture information that improves interpretation without silently changing the Growth Score denominator.

Starting path = **31 interactions**.

### 3. Adaptive deepening
Deterministic rules select follow-ups when:
- dimension score is weak;
- confidence is low;
- user answered `Não sei` / `Responder depois`;
- evidence/context remains insufficient.

Essential normally remains around **31–42 interactions**. Full can access a larger adaptive pool but still does not force all 144 questions.

## 144 questions
The 144-question bank remains a methodology library, not a mandatory form.

Every canonical question now has machine-readable metadata:
- stage;
- purpose;
- score role;
- starter/adaptive role;
- applicability;
- sector affinity;
- response type;
- information slots.

File:
`data/diagnostic-question-metadata-v1.1.json`

## Sector logic
Sector is a prioritization signal. Hard exclusion should prefer confirmed operating traits, because two companies in the same sector can operate very differently.

Examples:
- inventory/physical assets;
- software delivery;
- regulated activity;
- sensitive personal data;
- interstate/international operations.

## Answer semantics
- `ANSWERED`: valid answer.
- `UNKNOWN`: not interpreted as maturity 0.
- `NOT_APPLICABLE`: removed from applicable denominator where allowed.
- `DEFERRED`: skipped for now, without pretending the data exists.

## Score
Growth Score is based on the stable anchor set.

Adaptive questions improve:
- cause;
- evidence;
- confidence;
- risk;
- GDS;
- personalization.

They cannot silently alter the score denominator.
