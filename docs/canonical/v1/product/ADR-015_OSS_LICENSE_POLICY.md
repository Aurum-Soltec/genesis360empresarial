# ADR-015 --- OSS License Policy

**Status:** ACCEPTED\
**Data:** 2026-08-18

## Contexto

Genesis utilizará open source para acelerar desenvolvimento, mas o core
comercial não deve herdar obrigações incompatíveis com
distribuição/serviço proprietário por adoção inadvertida.

## Decisão

### Allowlist preferencial

-   MIT
-   Apache-2.0
-   BSD-2-Clause
-   BSD-3-Clause
-   equivalentes permissivas somente após revisão

### Deny-by-default para incorporação no core

-   AGPL
-   GPL e copyleft forte
-   SSPL/BSL/source-available e licenças não-OSI sem revisão específica
-   componentes sem licença clara

Exceções exigem ADR próprio + revisão jurídica.

## Gate obrigatório

Antes de adoção estrutural: 1. confirmar repositório oficial; 2. ler
`LICENSE`; 3. verificar versão/tag; 4. verificar `NOTICE`/atribuição; 5.
avaliar dependências transitivas materiais; 6. security/CVE review; 7.
saúde/manutenção; 8. arquitetura e isolamento; 9. TCO; 10. exit
strategy.

## CI/CD

-   SBOM;
-   license scan;
-   dependency scan;
-   política de bloqueio;
-   inventário de terceiros e notices.

## Decisões atuais

-   **Twenty:** não aprovado para incorporação no core sob a política
    atual por licença AGPL-3.0 verificada anteriormente.
-   **Agno:** licença Apache-2.0 verificada na data-base; elegível para
    spike, sujeito aos demais gates.

## Observação

Licença permissiva não equivale a aprovação técnica ou de segurança.
