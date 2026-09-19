# Privacy & Data Register

## Data classes

| Domain | Example | Sensitivity | Purpose baseline | Retention decision |
|---|---|---|---|---|
| Identity | user id/email | personal | authentication/operation | define with provider/legal |
| Company | trade name/sector | internal/public | core operation | business lifecycle |
| Passport | financial/process facts | internal/financial/restricted | diagnosis/intelligence | policy required |
| Diagnostic | answers/scores | internal/financial | diagnosis | policy required |
| Evidence | docs/metrics | varies/restricted | validation | purpose-specific |
| Consent | decision/version | personal/audit | compliance | legal retention |
| Attestation | user/version/hash/time | personal/audit | submission legitimacy | legal retention |
| Mission | action/evidence/outcome | internal | evolution | business lifecycle |
| Qualification | provider status | internal/public subset | network | recertification lifecycle |
| Audit | actions/resources | restricted | security/compliance | security/legal policy |
| Agent traces | prompts/tool metadata | internal/restricted | AI operation/evals | minimized/time-bound |

## Principles
- minimization;
- purpose limitation;
- access control;
- retention by class;
- delete/rectify workflow;
- auditability;
- no generic “LGPD consent” checkbox;
- attestation does not waive Genesis obligations.

## Before production
Define operationally:
- privacy notice owner;
- DSR/access/correction/deletion path;
- retention schedule;
- subprocessors;
- incident notification process;
- international transfer assessment when applicable;
- legal basis per processing purpose.
