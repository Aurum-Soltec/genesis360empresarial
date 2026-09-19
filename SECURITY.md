# Security Policy

## Escopo
Genesis 360 Empresarial trata dados empresariais e potencialmente dados pessoais/sensíveis. Vulnerabilidades de isolamento, autorização, secrets, upload, agent tools e supply chain têm prioridade.

## Não reportar em issue pública
Não publicar:
- secrets;
- PII;
- documentos reais de clientes;
- exploit funcional contra produção;
- dados cross-tenant.

## Classes prioritárias
- cross-tenant disclosure;
- auth bypass;
- privilege escalation;
- provider self-qualification;
- consent bypass;
- unsafe upload;
- prompt/tool injection;
- secret leakage;
- SQL/RLS bypass;
- dependency compromise.

## Processo interno
1. classificar severidade;
2. conter;
3. preservar evidência;
4. corrigir com teste regressivo;
5. revisar impacto em dados;
6. comunicar conforme obrigação aplicável;
7. atualizar threat model.

Antes de produção pública, definir canal privado de security reporting no GitHub/organização.
