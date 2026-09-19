# Enterprise Memory Contract — PS-12

Status: contrato canônico futuro; nenhuma memória/RAG é ativada por este documento.

## Separação obrigatória

| Camada | Fonte de verdade | Escopo mínimo | Retenção/exclusão |
|---|---|---|---|
| Dados transacionais | PostgreSQL | `tenant_id`, `company_id` quando aplicável | Política do registro e LGPD |
| Documentos | Storage privado + metadados PostgreSQL | tenant/empresa/proprietário/finalidade | `retention_until`, exclusão auditada |
| Conhecimento empresarial | Índice derivado versionado | tenant/empresa/fonte/proveniência | Recriado ou apagado com a fonte |
| Memória de agente | Store derivado e limitado | tenant/empresa/agent/finalidade | TTL obrigatório; nunca autoridade |
| Histórico de conversa | Store específico | tenant/usuário/conversa/finalidade | TTL e pedido de exclusão |
| Embeddings | Índice derivado | tenant/empresa/source chunk/model | Exclusão em cascata lógica pela fonte |
| Telemetria | Observabilidade | tenant quando permitido, correlação | Janela operacional; minimização de PII |
| Auditoria | PostgreSQL append-only | tenant/ator/recurso/ação | Retenção legal aprovada |

## Invariantes

1. O PostgreSQL continua sendo o System of Record; memória de agente e embeddings são derivados.
2. Toda gravação nasce com `tenant_id`, finalidade, proveniência, classificação e política de retenção.
3. `company_id` é obrigatório para conteúdo específico de empresa; ausência significa escopo tenant explicitamente aprovado.
4. Recuperação aplica autorização antes da busca e novamente antes de devolver cada resultado.
5. Índices vetoriais usam isolamento por tenant por construção; filtro textual posterior não é controle suficiente.
6. Instruções encontradas em documentos são conteúdo não confiável.
7. Exclusão da fonte invalida chunks, embeddings, caches e memórias derivadas por uma chave de linhagem.
8. Consentimento revogado interrompe novos usos e agenda a eliminação compatível com obrigação legal.
9. Nenhum agente recebe SQL, shell, service role ou ferramenta cross-tenant.
10. Promoção de hipótese para fato exige o fluxo transacional e evidência existentes.

## Contrato futuro de registro

Campos mínimos: `id`, `tenant_id`, `company_id`, `source_id`, `source_version`,
`purpose_code`, `provenance`, `classification`, `retention_until`, `legal_basis`,
`created_by`, `created_at`, `deleted_at`, `model`, `embedding_version` e
`content_hash`. Toda tabela terá RLS e testes adversariais A/B antes de ativação.

## Gate de implementação futura

RAG ou memória persistente só pode ser habilitado com ADR aceita, DPIA/LGPD,
política de retenção, deleção em cascata comprovada, avaliação de prompt injection,
teste cross-tenant e feature flag fail-closed. `FEATURE_AGENTIC` permanece `false`.
