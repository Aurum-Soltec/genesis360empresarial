# TEST STRATEGY V1

## Pirâmide por risco

### Unit
- scoring;
- applicability;
- mission transitions;
- eligibility/ranking;
- validation schemas.

### Integration
- Supabase/RLS;
- auth/tenant;
- migrations;
- consent;
- persistence.

### Contract
- API input/output;
- agent tool schemas;
- compatibility.

### E2E
- first-value journey;
- mission/outcome;
- qualified solution;
- consented contact.

### Security
- A->B tenant;
- privilege escalation;
- ID enumeration;
- injection;
- agent/tool abuse.

### Performance
- diagnosis autosave;
- result computation;
- dashboard;
- matching.

### AI Evals
- normal;
- edge;
- adversarial;
- groundedness;
- unsupported claims;
- tool correctness;
- policy violation.

## Evidência
`RF/RNF -> TEST -> EVID -> GATE`
