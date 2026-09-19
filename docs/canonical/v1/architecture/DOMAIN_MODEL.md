# DOMAIN MODEL

## Agregados principais

### Tenant
Organização proprietária dos dados e fronteira de autorização.

### Company
Empresa avaliada pelo Genesis.

### Business Passport
Conjunto de fatos atuais + provenance + Timeline.

### Diagnostic
Sessão versionada com respostas, coverage, confidence, scores e findings.

### Pain Finding
Dor/gap identificado por evidência.

### Cause Hypothesis
Hipótese de causa, nunca promovida automaticamente a fato.

### Decision Record
Registro GDS auditável.

### Mission
Unidade de execução com state machine.

### Capability
Capacidade de produto/serviço necessária ou ofertada.

### Provider Qualification
Qualificação de empresa para uma capability.

### Match
Resultado explicável de elegibilidade/ranking.

### Outcome
Resultado após missão/execução.

### Ecosystem
Rede/associação que distribui Genesis e recebe apenas visões autorizadas.

## Invariantes

- company pertence a tenant;
- recurso tenant-owned nunca cruza tenant;
- score é versionado;
- decisão preserva evidência;
- missão não salta estados inválidos;
- provider só aparece se elegível;
- plano não altera ranking depois da elegibilidade;
- outcome preserva origem e confiança.
