# Adendo canônico — saneamento V1.2.1 RC1

Data: 2026-09-10. Base: PRD V1.2 e aprovação do proprietário nesta conversa.
Não é um PRD de produto novo nem substitui as 12 dimensões, a biblioteca ou a jornada canônica.

## Precedência
As decisões explícitas do proprietário em 2026-09-10 superam hipóteses comerciais anteriores.
`data/commercial-plans.json` é a referência executável de preço: Free0, Start9900 e Pro29700 centavos de real por mês.
Os dossiês históricos não foram reescritos: suas ressalvas sobre o preço do Pro estão superadas apenas nesse ponto.

## Critérios de saneamento
| ID | Contrato | Evidência de aceite |
|---|---|---|
| SAN-001 | UNKNOWN/DEFERRED não representam zero e zero respondido permanece válido. | Testes de scoring e reprodução antes/depois. |
| SAN-002 | Dimensão com cobertura abaixo0,6 fica sem nota; índice global não renormaliza silenciosamente dimensões ausentes. | Teste16/24 e agregação. |
| SAN-003 | Coleta, persistência, Home e Resultado usam o mesmo valor global de confiança e sua versão. | Avaliador único; testes de domínio; homologação HTTP/banco ainda requerida. |
| SAN-004 | Cliente não promove origem/verificação/confiança. | Schemas estritos, SQL declaration-only, testes de contrato e negativos SQL. |
| SAN-005 | Escrita privilegiada exige papel; tenant não pode vir livremente do payload. | API guards, matriz deny-by-default, testes negativos SQL/HTTP. |
| SAN-006 | Resposta concorrente não sobrescreve silenciosamente revisão mais nova. | expectedRevision obrigatório; teste SQL e futuro teste concorrente de duas sessões. |
| SAN-007 | Conclusão persiste snapshot atômico; reenvio não reinventa IDs ou eventos de resultado. | Testes SQL de persistência/replay e HTTP integrado. |
| SAN-008 | Publicação não inclui fontes restritas, credenciais ou caches. | Revisão das exclusões e scanner limitado do pacote. |
| SAN-009 | Atualização de segurança exige resolução real e execução reproduzível. | Lock, audit, quality e database verdes; não há aceite por manifesto sozinho. |
| SAN-010 | Free/Start/Pro não implicam checkout ou recursos sensíveis liberados. | Catálogo, SQL de preço e testes de configuração. |

## Contratos e estados
No domínio, score e coverage são razões0..1. No banco e na interface, score e confidence globais são0..100.
`score:null` significa insuficiência/não aplicabilidade, nunca zero. Status acompanha a nota.
Os24 anchors atuais são universais e não permitem autodeclarar “Não se aplica”.
Os campos declarados continuam úteis, mas não representam auditoria ou validação profissional.
Respostas guardam referências acessíveis da mesma empresa. Referência existente não prova pertinência,
qualidade ou validação independente; por isso o incremento de confiança por referências está desligado.

A política de escrita desta tranche é conservadora: owner/admin/manager escrevem dados de negócio.
member/specialist/auditor não recebem escrita geral; consentimento e declaração próprios não promovem papel.
Delegação por missão/atribuição deve ter contrato específico antes de ser liberada.

## Não objetivos desta tranche
Implementar provedor de pagamento, inventar cotas, criar login incompleto para parecer “pronto”,
ativar upload/fornecedores/Conselho, calibrar scores com clientes inexistentes,
definir RTO/RPO ou escala sem impacto de negócio/workload.
