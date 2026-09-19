# Agent / Tool Abuse Review

## Must prove
- agent has no DB credentials;
- tenant identity is supplied by trusted runtime;
- tools are allowlisted and typed;
- phase-1 tools are read-only;
- every tool validates authorization outside the LLM;
- prompt/document content cannot alter policy;
- no arbitrary URL fetch;
- no shell with network + credentials;
- budgets, stop conditions and kill switch exist before writes;
- normal, edge and adversarial evals pass.

## Adversarial cases
- indirect prompt injection in evidence;
- request for cross-tenant data;
- request to override score;
- request to rank a paying provider higher;
- attempt to obtain secrets/tool schemas.
