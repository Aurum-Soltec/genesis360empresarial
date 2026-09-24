# Leitura de fatos sensíveis no Passport e na Timeline — 2026-09-23

## Problema e evidência

A hipótese inicial de que `business_facts_member_select` ainda permitiria a leitura de valores financeiros por qualquer membro **não se confirma no estado atual**. A migration `0011_v1_least_privilege_rbac.sql` remove essa política e instala `business_facts_sensitivity_select`: valores `personal`, `financial` e `restricted` exigem papel `owner`, `admin` ou `manager`. O teste `008_role_access.test.sql` verifica que `member` vê apenas o fato `internal`, enquanto `manager` vê ambos. `GET /api/passport/facts` usa o cliente autenticado e, portanto, está submetido a essa RLS.

Existe uma exposição indireta de **metadados**, não do campo `business_facts.value`: a política `business_timeline_member_select`, criada na migration `0007_v1_security_evidence_outbox.sql`, permite a qualquer membro ler eventos de seu tenant. A RPC `record_business_fact`, na migration `0014_v1_2_1_declaration_trust.sql`, registra `subject_type='business_fact'`, `subject_id`, `payload.factKey` e `source_ref` na Timeline mesmo quando o fato é `personal`, `financial` ou `restricted`. `GET /api/passport/timeline` devolve `payload.factKey` sem filtro de sensibilidade; a Data API autenticada ainda pode ler diretamente `source_ref`. O contrato `DEC-032` e `DATA_CONTRACT_CATALOG.md` exigem fronteira de leitura mais restrita para fatos sensíveis.

## Impacto

Um membro comum pode inferir a existência e a categoria de um fato confidencial por `factKey`; no acesso direto à tabela, também pode obter `source_ref`. Não há evidência de exposição do valor do fato por esse caminho. A gravidade depende do conteúdo real desses metadados, por isso o controle deve impedir a leitura do evento associado ao fato sensível sem restringir o histórico ordinário.

## Alternativas

1. Redigir apenas a resposta HTTP. Insuficiente: a tabela possui `SELECT` para `authenticated` e a Data API continua disponível.
2. Restringir toda a Timeline a `owner/admin/manager`. Seguro, mas retira sem necessidade o histórico de missões e fatos não sensíveis de membros comuns.
3. Aplicar RLS à Timeline para que eventos cujo `subject_type='business_fact'` sejam visíveis somente quando o fato referenciado for legível para o mesmo ator, tenant e empresa. Conserva o restante da Timeline e fecha também a Data API. **Recomendado.**

## Implementação proposta e gate

Adicionar migration append-only `0024` que substitui somente `business_timeline_member_select`. Para um evento de fato, exigir ID UUID válido, vínculo a `business_facts` no mesmo tenant e empresa, e autorização equivalente a `DEC-032`; referências inválidas ou fatos apagados falham fechado. Preservar a leitura dos demais eventos por membros do tenant. Testar via pgTAP: member não vê evento financeiro/restrito/pessoal nem `source_ref`, vê evento interno e de missão; manager vê todos no seu tenant; ator de outro tenant não vê nada. Não usar service role na rota HTTP nem desabilitar RLS.

Rollback proporcional: reinstalar a política anterior somente se uma regressão legítima de leitura for comprovada e com análise de risco, pois o rollback reabriria os metadados sensíveis. Após qualquer correção, repetir pgTAP e os gates de segurança afetados. O teste local não recebe crédito de runtime hospedado.

## Resultado local

A migration `0024_sensitive_passport_timeline_reads.sql` implementa a alternativa 3. A suíte `012_sensitive_fact_timeline.test.sql` cobre valores e eventos sob papéis `member`, `manager` e `owner`, IDs inválidos, troca de empresa dentro do mesmo tenant e outro tenant. A migration foi aplicada somente ao banco local de testes, sem reset. `supabase test db` passou com 14 arquivos e 106 assertions; `pnpm db:check` validou 24 migrations e `pnpm security:check` passou. Staging ainda exige aplicação da migration e reexecução dos gates afetados; não há crédito de runtime hospedado.
