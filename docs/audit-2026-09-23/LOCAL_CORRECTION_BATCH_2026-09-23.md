# Genesis 360 — lote de correções locais de 2026-09-23

**Escopo:** manutenção do candidato V1.2.1 RC2 + Production & Scale Foundation e
fluxo demonstrativo. Branch `codex/navigation-pages-fix`. Este registro descreve
código local; não é evidência de deploy, piloto ou operação em produção.

## Mudanças com evidência executável local

| Frente | Correção | Verificação e limite |
|---|---|---|
| Identidade da empresa | Seleção única por tenant; na demo só a empresa `fictional=true` entra no roteiro. Home, Prioridades, Indicadores, Missões, Passport, Histórico, Diagnóstico, Documentos, Conselho e soluções deixam de pegar a primeira linha arbitrária. Sem seleção inequívoca, a interface informa a impossibilidade e não mostra dados de outra empresa. | Testes de escopo por empresa e build; falta repetir navegação autenticada no staging. Tenants com várias empresas reais precisam de seletor explícito em Wave futura. |
| Passport e Timeline | Formulário dos sete campos essenciais usa a API governada, marca declaração não verificada e conserva histórico; valores sensíveis não são exibidos na tela. Datas e eventos são legíveis, com paginação. A completude informa apenas presença visível ao perfil. | Testes de apresentação/formulário. Não equivale a validação independente do conteúdo empresarial. |
| Fronteira de leitura sensível | A migration append-only `0024` restringe os eventos de fatos pessoais, financeiros e restritos à leitura autorizada, inclusive na Data API. Eventos não sensíveis permanecem visíveis. | pgTAP: 106/106 assertions em 14 arquivos, banco local. Revisão estrutural e rollback em `BUSINESS_FACT_TIMELINE_READ_BOUNDARY_2026-09-23.md`; aplicação e prova hospedadas pendentes. |
| Proveniência fictícia | O pacote `DEMO:` só pode ser criado na empresa fictícia. Escritas comuns não podem reservar essas referências. Origem, payload, resumo, sensibilidade, finalidade e estado precisam corresponder ao template antes de a fonte ser contada ou reaproveitada. | Testes de conflito, spoof e escopo; dados antigos conflitantes retornam erro e exigem reconciliação, nunca correção silenciosa. |
| Relatório | Referências declaradas que não foram carregadas já não compõem uma prova completa de proveniência; contagem usa fontes efetivamente obtidas. Prévia fictícia só aparece no relatório da única empresa demonstrativa. | Testes de proveniência. Não há extração/análise de arquivo real nem confirmação de relação causal entre documento e recomendação. |
| Administração e operação | Cockpit da demo distingue última avaliação, último relatório pontuado, fontes canônicas e soluções calculadas; não chama a checklist de aprovação HSP-4. Convite administrado registra etapa de falha sem dados pessoais ou erro do provedor. Erros de Auth/banco não são mascarados como ausência de acesso ou registro. | Testes de admin, convite e falhas de leitura. O 502 hospedado do convite ainda precisa de diagnóstico no runtime. |
| Ações da jornada | O botão GDS/missão recupera estado após falha ou timeout, sem afirmar que a gravação ocorreu. | Teste de falha e sucesso; antes de repetir uma operação incerta, atualizar a tela para evitar duplicação. |

## Gates locais

- `pnpm test`: 37 arquivos, **127/127** testes.
- `supabase test db` após `supabase migration up --local`: 14 arquivos,
  **106/106** assertions; não foi executado reset remoto.
- `pnpm typecheck`, `pnpm lint`, `pnpm db:check`, `pnpm security:check`,
  `pnpm production:state-check` e `pnpm build`: PASS.
- `pnpm quality`: **PASS** no candidato local, incluindo lock, pacote público,
  contratos, manifesto de integridade, 34/34 testes nativos, 127/127 Vitest e
  build. O manifesto cobre 53 arquivos originais, 223 alterações originais e
  52 entradas de acompanhamento; é integridade local, não aprovação de runtime.

## Gates ainda abertos e ordem

1. Preservar o resultado verde de `pnpm quality` no commit exato do candidato.
2. Publicar e identificar o mesmo artefato no staging apenas após autorização
   de promoção; reexecutar migração, RLS, Auth, navegação, fluxo Full de 50
   respostas, três fontes fictícias, score, relatório/PDF, Conselho e admin.
3. HSP-4 permanece **NO-GO** até convite fim a fim, backup gerenciado com RPO
   medido, alertas com operador/ACK, aceite de licenças e prova de 100 tenants
   com p95 conforme SLO. Ver `HSP4_OPERATIONAL_RECHECK_2026-09-23.md`.
4. O upload e a análise de arquivos reais, Qualification Network, Real Contact,
   Agentic e Ecosystem continuam bloqueados por seus gates e flags. Não usar a
   apresentação sintética como prova de precisão documental ou prontidão de
   produção aberta.

**Rollback:** o aplicativo pode voltar ao commit hospedado anterior. A migration
`0024` é restritiva e append-only; uma reversão de política que reabra leitura
sensível requer análise de risco e nova migration revisada. Correções nas rotas
de escrita não alteraram contratos de score, outbox, worker ou quotas.
