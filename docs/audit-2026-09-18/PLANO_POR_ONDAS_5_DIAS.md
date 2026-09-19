# Plano por ondas — Genesis 360 Empresarial

**Capacidade bruta:** 80 horas de desenvolvimento (2 pessoas × 5 dias × 8 h).  
**Compromisso planejado:** 60 horas.  
**Reserva:** 20 horas para falhas de integração, revisão, nova execução e documentação.  
**Alvo:** candidato RC2 para piloto interno controlado do núcleo individual.

## Regras de execução

- Uma única fila priorizada; cada item tem responsável principal e revisor.
- Pull requests pequenos, revisão cruzada e integração pelo menos duas vezes ao dia.
- Nenhum item é concluído sem código/contrato, teste, recibo, documentação e rollback proporcional ao risco.
- Toda correção de banco é migration append-only.
- Rede, contato real, upload, agentic, fiscal e integrações externas ficam desativados durante os cinco dias.
- Falha de política, consentimento, tenant, score ou evidência fecha o fluxo.
- O Codex prepara testes, revisa diffs, mantém recibos e ajuda a investigar; não substitui o aceite dos dois desenvolvedores.

## Agenda crítica dos cinco dias

| Dia | Dev A | Dev B | Integração/aceite | Horas planejadas |
|---|---|---|---|---:|
| 1 — baseline | Corrigir TypeScript, flags, privacidade e build | Atualizar dependências, lock, lint e reproduzir banco isolado | Instalação congelada, build verde, auditoria sem alta, migração limpa | 12 |
| 2 — fronteiras | Corrigir parser e criação de missão | Corrigir consentimento, ranges e fail-closed da qualificação | Testes adversariais de API e domínio verdes | 12 |
| 3 — ciclo | Corrigir transições concorrentes e evidência | Corrigir score ausente e consistência diagnóstico/resposta | Ciclo individual completo com dois tenants | 12 |
| 4 — E2E/operação | Implementar E2E autenticado e RLS negativo | Instrumentar erros, outbox e smoke de recuperação | E2E, DB, observabilidade e rollback ensaiados | 12 |
| 5 — estabilização | Corrigir regressões; acessibilidade/smoke | Evidências, runbook, release candidate | Todos os gates; reunião GO/NO-GO | 12 |

As 20 horas restantes são reserva conjunta. Se a reserva cair abaixo de 8 horas antes do final do dia 3, cortar trabalho P1 e preservar apenas correções P0, evidência e rollback.

## Onda 0 — contenção e baseline reproduzível (P0, dias 1–2)

| ID | Trabalho | Dono | Est. | Dependência | Aceite |
|---|---|---:|---:|---|---|
| W0-01 | Congelar escopo do RC2 no núcleo individual | ambos | 0,5 h | — | Lista de rotas e flags assinada |
| W0-02 | Registrar hash do pacote fonte e ferramentas | Codex/A | 0,5 h | — | Manifesto de evidência |
| W0-03 | Alinhar Node 24.21 e pnpm 10.32.1 | A | 0,5 h | W0-02 | Instalação congelada repetível |
| W0-04 | Corrigir tipo nulo da tela de privacidade | A | 0,5 h | W0-03 | Typecheck cobre retorno nulo |
| W0-05 | Corrigir defaults Zod das flags | A | 1 h | W0-03 | Flags ausentes e válidas testadas |
| W0-06 | Corrigir tipagem `ProcessEnv` nos testes | A | 0,5 h | W0-05 | Testes compilam |
| W0-07 | Atualizar PostCSS para versão corrigida | B | 1 h | W0-03 | >=8.5.23 resolvido e testado |
| W0-08 | Atualizar Vitest/mocker para versão corrigida | B | 1 h | W0-03 | >=4.1.11; suíte passa |
| W0-09 | Reavaliar alinhamento `@types/node` com runtime 24 | B | 0,5 h | W0-03 | Decisão registrada; typecheck verde |
| W0-10 | Corrigir os dois erros de lint | B | 1 h | W0-03 | Lint exit 0 |
| W0-11 | Excluir artefatos pesados da varredura sem ocultar fonte | B | 0,5 h | W0-10 | Lint conclui em tempo definido |
| W0-12 | Gerar novo lock e revisar delta transitivo | ambos | 1 h | W0-07/08 | Lock revisado, sem versão flutuante |
| W0-13 | Executar audit de produção e desenvolvimento | Codex/B | 0,5 h | W0-12 | Sem alta/crítica; moderadas justificadas |
| W0-14 | Obter build limpo e guardar artefato | A | 1 h | W0-04/05/06/12 | `next build` exit 0 |
| W0-15 | Subir Supabase em portas isoladas | B | 1 h | W0-03 | Projeto isolado saudável |
| W0-16 | Aplicar todas as migrations do zero | B | 1 h | W0-15 | Sem erro; schema hash guardado |
| W0-17 | Corrigir harness pgTAP, caso necessário | B | 1 h | W0-16 | `supabase test db` executa specs reais |
| W0-18 | Executar RLS cruzada com dois tenants | ambos | 1 h | W0-17 | Leituras/escritas cruzadas negadas |
| W0-19 | Confirmar isolamento do service role | A | 0,5 h | W0-14 | Nenhum segredo em bundle/log/resposta |
| W0-20 | Atualizar baseline de integridade somente após revisão | ambos | 0,5 h | todos | Delta intencional documentado |

## Onda 1 — entrada segura, autorização e consentimento (P0, dias 2–3)

| ID | Trabalho | Dono | Est. | Aceite |
|---|---|---:|---:|---|
| W1-01 | Fazer erro de JSON malformado retornar 400 | A | 0,5 h | RPC não é chamado |
| W1-02 | Exigir `application/json` e retornar 415 | A | 0,5 h | RPC não é chamado |
| W1-03 | Aplicar limite real de corpo e retornar 413 | A | 0,5 h | Corpo grande não é parseado |
| W1-04 | Remover fallbacks que apagam erro de parser em mutações | A | 1 h | Busca cobre todas as rotas críticas |
| W1-05 | Definir vínculo canônico consent-version-purpose | B | 0,5 h | Decisão registrada no contrato |
| W1-06 | Criar constraint/FK ou RPC de consentimento atômico | B | 1,5 h | Versão de outra finalidade é rejeitada |
| W1-07 | Tornar decisão mais recente determinística | B | 0,5 h | Desempate por ID/versão testado |
| W1-08 | Isolar consentimento por empresa e usuário | B | 0,5 h | Quatro combinações negativas passam |
| W1-09 | Testar revogação concorrente antes do contato | ambos | 1 h | Revogação vence; nenhum contato criado |
| W1-10 | Tornar leitura de política fail-closed | B | 0,5 h | Erro e ausência bloqueiam |
| W1-11 | Rejeitar números não finitos e fora da faixa | A | 1 h | Parser, domínio e DB cobertos |
| W1-12 | Definir `unknown` quando capacidade é obrigatória | ambos | 0,5 h | Regra aprovada; teste exato |
| W1-13 | Manter `FEATURE_REAL_CONTACT=false` no RC2 | B | 0,25 h | Smoke confirma 404/indisponível |
| W1-14 | Auditar status de tenant suspenso | A | 0,75 h | Contrato e teste definem bloqueio |
| W1-15 | Revisar auditoria/evento de todas as mutações | Codex/ambos | 1 h | Matriz rota→audit/trace/event completa |

## Onda 2 — diagnóstico e verdade exibida (P0/P1, dias 3–4)

| ID | Trabalho | Dono | Est. | Aceite |
|---|---|---:|---:|---|
| W2-01 | Preservar score global nulo na tela Indicadores | A | 0,5 h | Ausente aparece como “—” |
| W2-02 | Eliminar recomputação de score canônico na UI | A | 0,5 h | UI usa snapshot/versionamento |
| W2-03 | Testar 24 âncoras, 31 interações e FULL | A | 0,75 h | Caminhos determinísticos completos |
| W2-04 | Validar coerência resposta↔maturidade | B | 1 h | Combinação impossível é rejeitada |
| W2-05 | Manter TEC002 derivado e versionado | B | 0,5 h | Casos de opção cobertos |
| W2-06 | Separar desconhecido de zero em API/UI | A | 0,75 h | Casos parciais não são penalizados |
| W2-07 | Testar cobertura por dimensão | A | 0,5 h | Global só surge com regra satisfeita |
| W2-08 | Validar semanticamente information slots | B | 1 h | Slots vazios/ruins não elevam confiança |
| W2-09 | Rotular confiança como qualidade informacional | A | 0,5 h | Cópia não sugere probabilidade |
| W2-10 | Versionar regras e snapshots em todas as respostas | B | 0,75 h | Reprocessamento preserva histórico |
| W2-11 | Criar casos dourados de score e confiança | ambos | 1 h | Fixtures aprovadas por produto |
| W2-12 | Testar submissão repetida/idempotente | B | 0,75 h | Sem duplicação ou drift |

## Onda 3 — decisão, missão, evidência e resultado (P0/P1, dias 3–4)

| ID | Trabalho | Dono | Est. | Aceite |
|---|---|---:|---:|---|
| W3-01 | Bloquear conclusão se template falhar | A | 0,5 h | Retorna 5xx seguro; sem update |
| W3-02 | Validar requisitos de evidência no banco | A | 1 h | Ausência/inconsistência fecha fluxo |
| W3-03 | Exigir estado e revisão esperados no update | B | 1 h | Concorrência retorna 409 |
| W3-04 | Conferir linha afetada/retornada | B | 0,5 h | Zero linhas nunca retorna sucesso |
| W3-05 | Testar duas transições simultâneas | ambos | 1 h | Uma vence; outra recebe conflito |
| W3-06 | Propagar actor, trace e correlation id | B | 0,75 h | Evento liga requisição à mutação |
| W3-07 | Testar graph completo de estados | A | 0,75 h | Só arestas canônicas passam |
| W3-08 | Testar evidência de outro tenant | A | 0,5 h | Sempre negada e auditada |
| W3-09 | Tornar criação idempotente por decisão | B | 0,75 h | Retry não duplica missão |
| W3-10 | Validar resultado antes/depois e unidade | A | 1 h | Range/unidade obrigatórios |
| W3-11 | Rever sensibilidade de valores no histórico | ambos | 0,5 h | Política de acesso explícita |
| W3-12 | Ensaiar rollback lógico de transição falha | B | 0,75 h | Nenhum estado parcial |

## Onda 4 — integração, operação e gate do RC2 (P0/P1, dias 4–5)

| ID | Trabalho | Dono | Est. | Aceite |
|---|---|---:|---:|---|
| W4-01 | Criar dois usuários e dois tenants sintéticos | B | 0,5 h | Fixture sem dado real |
| W4-02 | E2E de convite/login/seleção de tenant | A | 1 h | Primeiro acesso funciona |
| W4-03 | E2E Passaporte→resultado | A | 1 h | Jornada autenticada completa |
| W4-04 | E2E prioridade→missão→evidência→resultado | A | 1 h | Ciclo de valor completo |
| W4-05 | E2E cruzado de leitura e escrita | B | 1 h | Nenhum dado cruza tenant |
| W4-06 | E2E de consentimento e revogação | B | 0,75 h | Estado e UI coerentes |
| W4-07 | Smoke mobile e teclado | A | 0,75 h | Navegação e foco funcionam |
| W4-08 | Scanner de acessibilidade no caminho crítico | A | 0,75 h | Sem violação crítica |
| W4-09 | Medir p95 local do caminho crítico | B | 0,75 h | Baseline registrada, sem timeout |
| W4-10 | Instrumentar erros, latência e correlation id | B | 1 h | Painel/log distingue falhas |
| W4-11 | Testar outbox, retry e idempotência | B | 1 h | Falha injetada recupera uma vez |
| W4-12 | Ensaiar backup/restore do banco isolado | ambos | 1 h | RPO/RTO medidos |
| W4-13 | Criar runbook de incidente e rollback | Codex/ambos | 0,75 h | Comandos e responsáveis revisados |
| W4-14 | Executar quality gate completo duas vezes | ambos | 1 h | Duas execuções verdes |
| W4-15 | Gerar SBOM e relatório de licenças | B | 0,5 h | Artefatos anexados ao RC2 |
| W4-16 | Fixar Actions por commit e proteger promoção | B | 0,5 h | CI reproduz o gate local |
| W4-17 | Revisar pacote público saneado | ambos | 0,75 h | Sem handoff, segredo ou dado privado |
| W4-17A | Rejeitar `.env` e nomes sensíveis em qualquer profundidade | B | 0,25 h | Fixture aninhada faz o scanner falhar |
| W4-18 | Fazer reunião GO/NO-GO com evidências | ambos | 0,5 h | Decisão e exceções assinadas |

## Ondas posteriores — inventário completo

Estas ondas não cabem nos cinco dias. Elas devem entrar em execução somente depois do RC2 interno e das decisões pendentes correspondentes.

### Onda 5 — produto do núcleo e método

- W5-01 validar ICP e problema com entrevistas; W5-02 definir métrica de ativação; W5-03 medir conclusão do diagnóstico; W5-04 medir missão iniciada/concluída; W5-05 medir retorno em 7/30 dias.
- W5-06 calibrar score com amostra real; W5-07 validar 24 âncoras; W5-08 validar 31 interações; W5-09 calibrar confiança; W5-10 aprovar taxonomia de dores.
- W5-11 definir impacto/urgência; W5-12 criar desempate; W5-13 validar templates de missão; W5-14 governar versões; W5-15 montar painel de drift.

### Onda 6 — privacidade, evidência e upload

- W6-01 aprovar textos legais; W6-02 versionar attestation; W6-03 implementar concessão/revogação; W6-04 exportar histórico; W6-05 atender exclusão/retenção.
- W6-06 storage privado; W6-07 URL assinada curta; W6-08 limite por tipo/tamanho; W6-09 antivírus/content scan; W6-10 quarentena.
- W6-11 extração segura; W6-12 proveniência; W6-13 expiração; W6-14 exclusão verificável; W6-15 testes de arquivo hostil.

### Onda 7 — rede de soluções e contato

- W7-01 aprovar threshold; W7-02 aprovar capacidade; W7-03 aprovar capability fit; W7-04 aprovar pesos; W7-05 aprovar caps.
- W7-06 consumir `ranking_weights`; W7-07 neutralidade por invariantes; W7-08 tie-break determinístico; W7-09 explicação do ranking; W7-10 ausência de política fail-closed.
- W7-11 onboarding de provider; W7-12 qualificação versionada; W7-13 expiração; W7-14 evidência de capacidade; W7-15 suspensão.
- W7-16 consentimento específico; W7-17 contato transacional atômico; W7-18 rate limit; W7-19 antiabuso; W7-20 revogação concorrente.
- W7-21 feedback/outcome; W7-22 disputa; W7-23 auditoria comercial; W7-24 revisão jurídica; W7-25 piloto fechado.

### Onda 8 — inteligência assistida

- W8-01 comparar orquestrador TS e spike Pydantic; W8-02 decidir por ADR; W8-03 corpus de avaliação; W8-04 casos adversariais; W8-05 prompt injection.
- W8-06 não tratar documento como instrução; W8-07 citações/evidência; W8-08 recusa e fallback; W8-09 orçamento/tokens; W8-10 timeout.
- W8-11 privacidade do provedor; W8-12 retenção; W8-13 redaction; W8-14 observabilidade; W8-15 replay.
- W8-16 human evaluation; W8-17 regressão; W8-18 feature flag; W8-19 kill switch; W8-20 rollout gradual.

### Onda 9 — operação, escala e resiliência

- W9-01 SLO/SLI; W9-02 alertas; W9-03 tracing; W9-04 logs estruturados; W9-05 dashboards.
- W9-06 carga; W9-07 stress; W9-08 soak; W9-09 concorrência; W9-10 limites por tenant.
- W9-11 PITR/backup; W9-12 restore recorrente; W9-13 continuidade; W9-14 rotação de segredo; W9-15 gestão de acesso.
- W9-16 incident response; W9-17 tabletop; W9-18 DAST; W9-19 pentest; W9-20 correção e reteste.

### Onda 10 — entrega, governança OSS e supply chain

- W10-01 repositório Git real; W10-02 branch protection; W10-03 CODEOWNERS; W10-04 commits assinados; W10-05 changelog.
- W10-06 dependabot/renovate; W10-07 actions fixadas; W10-08 proveniência de build; W10-09 assinatura de artefato; W10-10 SBOM por release.
- W10-11 scanner de segredo; W10-12 scanner de licença; W10-13 política de exceção; W10-14 inventário de forks; W10-15 plano de atualização.
- W10-16 ambientes separados; W10-17 promoção imutável; W10-18 canary; W10-19 rollback ensaiado; W10-20 evidência de release.

### Onda 11 — lançamento e aprendizagem comercial

- W11-01 coorte piloto; W11-02 critérios de entrada; W11-03 consentimento da pesquisa; W11-04 suporte; W11-05 canal de incidentes.
- W11-06 funil; W11-07 ativação; W11-08 tempo até valor; W11-09 retenção; W11-10 resultado de missão.
- W11-11 disposição a pagar; W11-12 teste de plano; W11-13 churn qualitativo; W11-14 NPS/CSAT contextual; W11-15 revisão quinzenal.
- W11-16 decisão de escala; W11-17 capacidade operacional; W11-18 orçamento; W11-19 roadmap aprovado; W11-20 encerramento de hipóteses inválidas.

## Gate diário

No fim de cada dia registrar: commit/hash, testes executados, falhas abertas, horas gastas, reserva restante, mudança de risco e decisão do dia seguinte. Nenhum “passou antes” vale para o RC2: todo recibo deve apontar para o hash atual.

## Regra de corte

Se build e banco não estiverem verdes ao final do dia 2, a entrega de cinco dias muda automaticamente para **pacote técnico corrigido, sem piloto**. Se isolamento de tenant, consentimento ou transição de missão continuarem falhando ao final do dia 4, a decisão obrigatória é **NO-GO**. Nenhuma demonstração visual ou promessa comercial compensa esses gates.
