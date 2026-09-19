# E2E Journey Matrix

## E2E-01 New manager
`sign-in → tenant → company → Passport → diagnostic → result`

Assert:
- no fake result;
- autosave;
- progress;
- confidence;
- tenant IDs not client-trusted.

## E2E-02 Decision
`result → pain → GDS → mission`

Assert:
- cause not invented;
- idempotent GDS/mission;
- evidence references preserved.

## E2E-03 Mission
`accept → in progress → evidence → complete → outcome`

Assert:
- invalid transitions blocked;
- required evidence enforced;
- Timeline updated.

## E2E-04 Provider network
`pain → capability → eligible provider → contact`

Assert:
- fail-closed without policy;
- plan tier not in ranking;
- consent required;
- provider data sanitized.

## E2E-05 Cross tenant
Tenant A attempts B resources.

Assert:
- API deny;
- RLS deny;
- no existence leak in response shape where applicable.

## E2E-06 Privacy
`purpose decision → revoke/deny → gated feature`

Assert:
- feature behavior matches current effective decision.

## E2E-07 Upload governance
`attestation → upload session`

Assert:
- inactive/retired version blocks;
- wrong tenant/company/user/purpose blocks;
- binary upload stays disabled until pipeline is approved.

## E2E-08 UX mobile
Home/Diagnostic/Result at small width.

Assert:
- real mobile drawer;
- focused diagnostic;
- no clipped CTA;
- keyboard/focus behavior.
