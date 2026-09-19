# TRACEABILITY

| Objective | Requirements | Architecture/ADR | Stories | Gate |
|---|---|---|---|---|
| Clareza | DIAG/PASS | ADR-011 | 006-017 | PRODUCT |
| Execução | GDS/MISSION | ADR-013 | 017-022,060 | PRODUCT |
| Soluções | QUAL | ADR-012 | 023-030,061-063 | PRODUCT/SEC |
| Inteligência | AI | ADR-014 | 031-036 | AI |
| Big Data | DATA | Passport/Timeline | 006-009,021,043,064 | DATA |
| Escala | RNF | ADR-016 | 045-052 | PROD |
| UX premium clara | UX | Taste/Genesis Light | 053-059 | UX |

## Wave 6 traceability

| Objective | Contract | Stories | Evidence target |
|---|---|---|---|
| Decision → execution | `create_mission_from_decision` | ST-060 | pgTAP W6-02 |
| Mission → capability | `mission_capability_requirements` | ST-061 | pgTAP W6-04 |
| Qualified providers | `loadQualifiedSolutionsForPain` | ST-062/072/073/074 | unit + integration |
| Consented contact | `solution_contact_requests` | ST-063 | pgTAP + API E2E |
| Outcome learning | `record_mission_outcome` | ST-064 | pgTAP W6-03 |
| Durable effects | outbox complete/fail | ST-075 | DB integration |
| Agent complexity gate | minimal orchestrator | ST-076 | spike scorecard |
