# ADR-016 --- V1 Production Release Strategy

**Status:** ACCEPTED\
**Data:** 2026-08-18

## Contexto

A estratégia anterior separava demo M0, MVP M1 e Starter. A direção
atual decidiu que a próxima versão deve ser uma V1 real, pronta para
produção e validação, sem construir todo o roadmap futuro.

## Decisão

Construir um **vertical slice production-ready** do ciclo principal,
preservando o monólito modular e a stack existente sempre que os gates
forem atendidos.

Fluxo obrigatório:
`onboarding → consent → Passport → diagnóstico → score → dores → GDS → missão → capability necessária → empresas qualificadas → contato consentido → outcome`.

## Não significa

-   implementar todos os módulos históricos;
-   antecipar microserviços;
-   lançar marketplace aberto;
-   incluir acompanhamento humano;
-   automatizar domínios regulados.

## Release gate

Nenhum "pronto" sem CI verde, isolamento cross-tenant, backup/restore
testado, observabilidade, security gate, privacidade, FinOps, E2E e
evidência de deploy.
