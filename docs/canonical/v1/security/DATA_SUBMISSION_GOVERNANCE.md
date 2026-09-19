# Data Submission Governance

## Separation of concepts

### Data Submission Attestation
The user declares legitimacy to provide the content.

### Privacy / purpose notice
GENESIS explains why and how the content is processed.

### Consent / legal basis
Handled independently where applicable.

### GENESIS obligations
The user's declaration does not transfer GENESIS obligations.

## Canonical draft text

### Declaration
Declaro que possuo os direitos, poderes, autorizações ou outra legitimidade necessária para disponibilizar à GENESIS as informações, documentos e demais conteúdos enviados para processamento nas finalidades apresentadas. Declaro também que sou responsável pela legitimidade do conteúdo que disponibilizo.

### Explicit warning
Não envie material cuja divulgação, compartilhamento ou processamento seja proibido ou viole direitos autorais, deveres de confidencialidade, contratos, propriedade intelectual, sigilo ou direitos de terceiros. Envie somente o conteúdo necessário para a finalidade apresentada e não envie senhas, tokens, chaves privadas ou outras credenciais de acesso.

### GENESIS responsibility
A declaração do usuário não substitui, reduz nem transfere as obrigações independentes da GENESIS relativas à segurança da informação, privacidade, proteção de dados pessoais, LGPD, contratos, propriedade intelectual e demais leis e obrigações aplicáveis. O usuário responde pela legitimidade do conteúdo que disponibiliza; a GENESIS continua respondendo pelas obrigações que lhe forem aplicáveis após receber e processar esse conteúdo.

## Audit
The system records:
- authenticated user;
- tenant;
- company;
- attestation version;
- content hash;
- purpose;
- scope;
- timestamp.

No IP/device fingerprint is required by default merely to prove the attestation.

## Upload gate
No upload session can be created unless:
1. an active attestation version exists;
2. the user accepted that exact active version;
3. company/tenant/user/purpose match.

If the version is retired, a new attestation is required.

## Current release status
The text is seeded as **draft**, not active. `FEATURE_DATA_UPLOAD=false`.

Activation requires legal/privacy review and completion of binary-upload controls:
- content type/size allowlist;
- malware/content scan;
- storage encryption/access control;
- retention/deletion;
- safe logging;
- backup/restore policy.
