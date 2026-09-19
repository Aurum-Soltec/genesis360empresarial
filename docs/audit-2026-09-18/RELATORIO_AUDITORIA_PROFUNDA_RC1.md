# Auditoria profunda do Genesis 360 Empresarial V1.2.1 RC1

**Data:** 18/09/2026  
**Prazo informado:** 5 dias  
**Equipe informada:** 2 pessoas de desenvolvimento, com suporte do Codex  
**Estado auditado:** pacote local e pacote público interno RC1, sem acesso a produção

## Parecer executivo

O conceito do produto é coerente e a arquitetura escolhida pode sustentar o núcleo individual. O ciclo `Passaporte → Diagnóstico → Prioridade → Decisão → Missão → Evidência → Resultado` é claro, auditável e gera valor sem depender da rede de fornecedores. As regras canônicas de isolamento por tenant, neutralidade comercial, consentimento e falha fechada também apontam na direção correta.

O RC1 atual **não está pronto para produção nem para um piloto externo**. A compilação falha, a auditoria de dependências encontrou vulnerabilidades, a execução integrada do banco ainda não foi comprovada e dez testes adversariais expuseram comportamentos incorretos em pontos de negócio e de segurança. Os testes existentes que passam demonstram uma base útil, mas não anulam essas falhas.

Em cinco dias, duas pessoas conseguem preparar um **candidato a piloto interno controlado do núcleo individual**, desde que a rede, contato real, upload binário, automações agentic e integrações externas permaneçam desativados. Tentar concluir todo o escopo V1 e promover para produção nesse prazo não é um plano defensável.

## O que foi efetivamente auditado

- Integridade do ZIP de handoff e comparação byte a byte com os arquivos locais.
- Integridade dos 474 arquivos da cópia pública interna RC1.
- PRD, adendo de hardening, estado do projeto, ADRs, backlog, gates e documentação de arquitetura.
- Manifesto direto e árvore resolvida com 558 entradas de dependência.
- Código de entrada, tenant, consentimento, diagnóstico, score, dores, decisão, missão, evidência, resultado, qualificação e contato.
- Migrações e testes SQL por análise estática; a execução completa do banco está registrada separadamente como pendente até a inicialização isolada terminar.
- Scripts de contrato, segurança, confiança, design, pacote público, migrações e integridade.
- Compilação Next.js, verificação TypeScript, lint, testes nativos e 31 testes adversariais adicionais.

Não houve acesso a credenciais, dados ou infraestrutura de produção. Também não se afirma uma auditoria linha a linha do código-fonte de cada dependência upstream. A análise de terceiros cobre a árvore realmente resolvida, avisos publicados, política OSS e os limites de confiança usados pelo Genesis.

## Evidência reproduzível

O ensaio foi executado numa cópia isolada em `.audit-work/rc1/genesis360empresarial`, usando Node 24.21.0, pnpm 10.32.1 e Supabase CLI 2.117.0. A cópia de origem permaneceu intacta. Os recibos estão nesta pasta.

| Verificação | Resultado | Interpretação |
|---|---:|---|
| Lockfile | passou | O manifesto exato pôde ser resolvido e instalado de forma congelada na cópia isolada. |
| Cópia pública | passou | O conteúdo esperado do pacote público está presente. |
| Contrato OpenAPI | passou | O verificador estático não encontrou divergência coberta por suas regras. |
| Design system | passou | Os invariantes automatizados do Genesis Precision Light passaram. |
| Contratos de segurança | passou | Os padrões estáticos já codificados passaram. |
| Fronteiras de confiança | passou | Os padrões estáticos já codificados passaram. |
| Migrações, análise estática | passou | Nomes e padrões cobertos pelo script estão consistentes. |
| Testes nativos de hardening | **34/34 passaram** | Incluem 625 combinações internas de autorização/estado. |
| Testes adversariais novos | **21/31 passaram; 10 falharam** | As falhas são achados do produto, descritos abaixo. |
| Vitest com um worker | **36/37 passaram; 1 falhou** | A expectativa de `feature-flags.test.ts` não inclui `dataUpload`; o teste e o contrato estão dessincronizados. |
| Vitest paralelo padrão | **instável** | Um arquivo passou e 11 workers não responderam; o gate precisa usar uma configuração estável e investigada. |
| TypeScript | **falhou** | Há erros na privacidade, flags e testes. |
| Build Next.js | **falhou** | Parou na etapa TypeScript; não existe artefato implantável comprovado. |
| Lint | **não concluiu em 300 s e registrou 2 erros/4 avisos** | O gate precisa ser corrigido e ter tempo previsível. |
| Auditoria de dependências | **falhou** | 2 entradas altas e 3 moderadas, relativas a quatro avisos únicos. |
| Scanner público com `.env` aninhado sintético | **falhou em detectar** | O verificador retornou sucesso com `audit-synthetic/.env`; o arquivo foi removido ao fim do teste. |
| Integridade do hardening na cópia | diferença esperada do ensaio | O `config.toml` isolado recebeu apenas projeto/portas exclusivos para não interferir em outro Supabase local. Não é defeito da origem. |
| Integridade do pacote original | passou | 53 arquivos originais monitorados e 66 mudanças registradas; o próprio verificador esclarece que isso não aprova produção. |
| Supabase isolado | **runtime pendente** | Duas tentativas, de 420 s e 361 s, expiraram durante o download da imagem oficial, antes de aplicar migrations. Nenhum contêiner da auditoria ficou criado. |

Recibos principais: [build.json](build.json), [typecheck.json](typecheck.json), [lint.json](lint.json), [native.json](native.json), [adversarial.json](adversarial.json), [vitest.json](vitest.json), [database-start.json](database-start.json) e [dependency-audit.json](dependency-audit.json). Os `.log` de mesmo nome contêm a saída sanitizada. O resultado com um worker está resumido em [vitest-single-worker.json](vitest-single-worker.json).

## Achados bloqueadores

### P0 — precisa ser resolvido antes de qualquer piloto

1. **Não há build implantável.** `app/privacidade/page.tsx` indexa um retorno possivelmente nulo. `lib/feature-flags.ts` usa defaults incompatíveis com Zod 4.4.3. Os testes de flags criam objetos incompatíveis com `ProcessEnv`. O build termina com código 1.
2. **Dependências conhecidamente vulneráveis.** O override prende PostCSS em 8.5.10, atingido por três avisos; a correção cumulativa exige ao menos 8.5.23. Vitest e `@vitest/mocker` 4.1.0 são atingidos pelo mesmo aviso e exigem ao menos 4.1.11. A atualização precisa preservar build e testes, em vez de alterar apenas o número da versão.
3. **Criação de missão aceita corpos inválidos.** O tratamento `readJsonBody(...).catch(() => ({}))` transforma JSON malformado, tipo de conteúdo incorreto e corpo acima do limite num objeto vazio; o handler prossegue e executa a criação. Três testes independentes esperavam 400, 415 e 413 e receberam 201.
4. **Conclusão de missão falha aberta quando a regra de evidência não pode ser lida.** Erro na busca do template vira lista vazia e a transição conclui com 200. A indisponibilidade da política deve bloquear a conclusão e gerar trilha operacional.
5. **Transição pode declarar sucesso sem alterar registro.** O handler retornou 200 quando o update afetou zero linhas. A operação deve validar linha retornada, estado/revisão esperados e conflito concorrente.
6. **Consentimento não comprova vínculo entre versão e finalidade.** Uma versão ativa apresentada como `AI_PROCESSING` autorizou `QUALIFIED_MATCHING` no teste em processo. É necessária uma relação canônica de versão, finalidade e empresa, validada no banco e no servidor. O teste demonstra uma lacuna de contrato; um bypass remoto autenticado ainda precisa ser provado pelo E2E.
7. **Gate de capacidade não falha fechado para estado desconhecido.** Com capacidade explicitamente obrigatória, `unknown` foi considerado elegível. A decisão metodológica precisa ser formalizada; até lá, a rede deve permanecer desligada.
8. **Valores numéricos não finitos podem aprovar qualificação.** `NaN` em score de qualificação ou fit de capacidade atravessou o motor como elegível. Banco, parser e domínio precisam restringir valores finitos e faixas de 0 a 100.
9. **Indicador ausente é mostrado como pontuação calculada.** Um diagnóstico incompleto, com score global canônico nulo, foi renderizado como 53/100 ao converter `null` para zero e calcular média local. Isso altera o significado do score e pode orientar decisão incorreta.
10. **Banco integrado e RLS ainda não têm recibo runtime deste RC1.** Scripts estáticos passaram, porém isso não comprova migrações aplicadas, RLS real, concorrência nem funções. O gate exige instância isolada, migração limpa e testes negativos multi-tenant.

### P1 — necessário para um piloto interno confiável

11. O lint excede cinco minutos e registra violações no componente de navegação; o gate não tem duração previsível.
12. O scanner do pacote público não bloqueia um `.env` aninhado quando seu conteúdo não casa com a heurística estreita. A regra deve rejeitar nomes sensíveis em qualquer profundidade e ter fixtures positivas/negativas.
13. Não há jornada autenticada completa em HTTP e navegador para dois tenants, revogação de consentimento e missão concorrente.
14. A tela de privacidade resume decisões por finalidade sem uma experiência completa para conceder/revogar e sem deixar evidente empresa, versão e vigência.
15. A qualificação lê thresholds da política, mas usa pesos de ranking constantes no código e não consome `ranking_weights` versionado. Política e resultado podem divergir.
16. Erros de infraestrutura na busca de soluções são reduzidos a ausência de resultado. Observabilidade precisa distinguir `sem elegível`, `política ausente` e `falha de leitura`.
17. O contrato de resposta de diagnóstico permite inconsistência entre resposta escolhida e maturidade informada fora da exceção TEC002. É preciso definir quem deriva a maturidade e rejeitar combinações inválidas.
18. `informationSlots` aceita estruturas genéricas com validação semântica limitada; confiança pode subir com conteúdo preenchido, porém pouco confiável.
19. O outbox e as tentativas existem no banco, mas não há worker operacional comprovado, alarme, idempotência ponta a ponta nem ensaio de recuperação.
20. O fluxo de autenticação/primeiro acesso não está completo para um usuário real. `enable_signup=false` requer processo de convite, recuperação e suporte operacional testados.
21. Não há baseline executada de desempenho, acessibilidade, backup/restore, observabilidade, retenção e resposta a incidentes.

### P2 — produto válido, mas incompleto

22. Upload está corretamente bloqueado, porém ainda faltam armazenamento, varredura de conteúdo, retenção, exclusão e teste de abuso.
23. O Passaporte é principalmente leitura; a edição governada e a proveniência completa ainda precisam de jornada de produto.
24. Dores usam uma derivação determinística simples; impacto, urgência e desempate precisam de método aprovado e casos dourados.
25. Confiança é uma heurística de qualidade informacional, ainda sem calibração empírica. Não deve ser apresentada como probabilidade.
26. A rede de soluções depende de políticas ainda pendentes: thresholds, capacidade, pesos, elegibilidade, neutralidade, consentimento, cópia legal e contato.
27. Não há evidência de validação comercial: ativação, conclusão do diagnóstico, adoção de missão, retorno, resultado e disposição a pagar.
28. O repositório público consultado está vazio; a fonte auditada é o pacote local. Publicação futura deve partir somente do pacote saneado e passar por scanner, SBOM e revisão de licença.
29. Os workflows ainda precisam fixar ações por commit, gerar SBOM, guardar artefatos, impedir promoção sem gates e comprovar rollback.

## Avaliação da coerência

| Dimensão | Avaliação | Evidência/limite |
|---|---|---|
| Problema e proposta de valor | forte | Liga diagnóstico a execução e resultado; hipótese comercial ainda não validada. |
| Arquitetura modular | adequada | Next.js + Supabase e regras determinísticas cabem na equipe; exige fechar runtime e operação. |
| Multi-tenant | bem desenhado por contrato | RLS e tenant explícito são requisitos centrais; falta recibo integrado deste candidato. |
| IA | direção correta | IA subordinada a regras; spike Python ainda não é serviço de produção nem tem avaliação robusta. |
| Diagnóstico | promissor | 24 âncoras e caminho de 31 interações são coerentes; sem calibração externa e com erro de exibição do score ausente. |
| Missões | diferencial potencial | Conecta decisão a evidência, mas os achados de criação e transição impedem confiança atual. |
| Rede de fornecedores | alto risco se antecipada | Neutralidade está bem declarada; política, capacidade, consentimento e contato não estão suficientemente fechados. |
| Operação | insuficiente | Falta build, DB integrado, E2E, restore, desempenho e observabilidade comprovados. |
| Prazo de cinco dias | viável apenas para candidato interno reduzido | Requer congelamento de escopo e execução do plano crítico. |

## Decisão recomendada

**GO condicionado para desenvolvimento intensivo do núcleo individual.**  
**NO-GO atual para produção, piloto externo, contato real, rede, upload e agentic.**

O próximo gate só deve mudar para GO quando todos os P0 estiverem corrigidos, o build for verde, as migrações forem aplicadas do zero, os testes multi-tenant e adversariais passarem, e houver uma jornada E2E autenticada com evidência. A decisão de lançamento pertence a produto, segurança e operação; uma suíte verde sozinha não resolve pendências legais e metodológicas.

## Atualização RC2 — 2026-09-19

Os dez P0 acima foram remediados e verificados no escopo congelado do núcleo
individual. O recibo consolidado está em
`RC2_P0_REMEDIATION_EVIDENCE.md`, com resultado estruturado em
`RC2_VALIDATION_RESULTS.json`. O candidato passa para piloto interno
controlado; o gate de produção continua bloqueado pelas condições operacionais
e E2E descritas no recibo RC2.

## Critério de sucesso para os cinco dias

Ao final do quinto dia, o resultado defensável é um RC2 que:

1. instala e compila de forma reproduzível;
2. não possui vulnerabilidade alta conhecida na árvore resolvida;
3. aplica migrações do zero e passa RLS/SQL em ambiente isolado;
4. conclui o ciclo individual com dois tenants sintéticos sem vazamento;
5. corrige os dez testes adversariais ou documenta, aprova e testa uma regra canônica substituta;
6. mantém rede, contato, upload e agentic desligados;
7. possui evidência, rollback e decisão formal de GO/NO-GO para piloto interno.

O plano executável e o inventário completo de trabalho estão em [PLANO_POR_ONDAS_5_DIAS.md](PLANO_POR_ONDAS_5_DIAS.md).
