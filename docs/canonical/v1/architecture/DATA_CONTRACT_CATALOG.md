# Data Contract Catalog

## Tenant-owned entities
- companies
- consents
- business_facts
- business_timeline_events
- diagnostics
- answers
- score_results
- pain_findings
- cause_hypotheses
- decision_records
- missions
- mission_evidence
- mission_outcomes
- provider_capabilities
- solution_contact_requests
- audit_events
- evidence_items
- data_submission_attestations
- document_upload_sessions/items

## Global/versioned catalogs
- diagnostic_versions
- consent_versions
- consent_purposes
- mission_templates
- capabilities
- pain_capability_rules
- plan_catalog
- provider_network_policies
- data_submission_attestation_versions

## Ownership rules
- empresa é sempre ligada a tenant;
- child resource deve preservar tenant/company relation;
- catálogos publicados são imutáveis por versão;
- qualification controlada pela plataforma, não pelo provider;
- consentimento é decisão do usuário/finalidade;
- timeline/audit são append-oriented.

## Sensibilidade
Baseline:
- public
- internal
- personal
- financial
- restricted

Dados financial/restricted possuem baseline de leitura mais restritiva.

## Lifecycle
Todo tipo sensível precisa de:
- origem;
- finalidade;
- retenção;
- exclusão;
- auditoria;
- owner.
