# Confidence Thermometer V1.1

## User-facing distinction

**Progress** answers: “How much of the diagnostic path have I traversed?”

**Confidence** answers: “How reliable is the current analysis?”

They are never merged.

## Versioned baseline weights
- critical coverage: 35%;
- information completeness: 25%;
- evidence/provenance: 20%;
- consistency: 10%;
- freshness: 10%.

These weights are an approved V1.1 baseline and must be calibrated against real validation data before becoming a long-term benchmark.

## Anti-gaming rule
Long text does not increase confidence by itself.

Textual questions define information slots. Completeness rises when the expected information is present, not because the user typed more characters.

## Guidance
Low confidence generates constructive recommendations, for example:
- complete essential questions;
- add missing structured detail;
- attach evidence to a critical claim;
- revisit an unknown/deferred answer.

The UI speaks about **analysis confidence**, never about a “bad user answer”.
