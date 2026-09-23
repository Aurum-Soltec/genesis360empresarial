# Auditoria de fundação, produto e experiência — 23/09/2026

## Escopo e decisão

Código local auditado: `55967dd8c47285fed0b29f36a3c97e9a48c1d4bd`, branch
`codex/navigation-pages-fix`. O PR #25 contém somente `e72f6b6`; os três commits
seguintes estão locais e **não** foram publicados. O staging examinado foi
`https://web-production-76d1b.up.railway.app/`, autenticado como owner no
tenant fictício A. `PROJECT-STATE.md` identifica seu artefato anterior como
`cfdf876e5539f02e6b40d2b491adc80973fbb775`. Não se atribui evidência
hosted ao HEAD local.

**Decisão:** a fundação de segurança e o núcleo determinístico estão presentes,
mas a intenção completa da V1 e a análise de documentos reais não estão
implantadas. A demonstração sintética de sete etapas funciona no staging, com
limites explicitados na interface. **NO-GO para apresentá-la como prova de análise
documental precisa ou para piloto/produção aberta.** Há falhas de integridade de
conteúdo, acessibilidade e um gate de baseline quebrado. Uma apresentação guiada
e honestamente rotulada como simulação pode ser ensaiada internamente; corrigir
os itens P0/P1 antes da reunião externa.

## Comparação com a intenção canônica

| Capacidade | Estado observado | Base |
|---|---|---|
| Auth, tenant explícito, RLS, trusted boundary, quotas | Implementados; 95 testes SQL locais passaram; evidência hospedada anterior de isolamento | `lib/tenant-context.ts`; `lib/server/trusted-data-access.ts`; migrations `0007`, `0018`–`0023` |
| Diagnóstico, score, cobertura e confiança | Núcleo determinístico e fluxo Full implementados; 50 respostas concluídas no tenant demo | `lib/diagnostic-evaluation.ts`; `app/diagnostico-v1`; relatório hospedado |
| Business Passport e Timeline | Persistência/contratos implementados; tela atual só resume presença/status de sete campos, sem edição local | `app/api/passport/facts/route.ts`; `app/passaporte/page.tsx` |
| Dor, GDS, decisão, missão e outcome | Contratos e APIs presentes; relatório não incorpora `decision_records` e não valida causa-raiz | `lib/gds.ts`; `lib/report-insights.ts`; `app/resultado-v1/page.tsx` |
| Documentos | Três registros sintéticos demonstrativos, zero verificados; upload binário real desligado | `app/documentos/page.tsx`; `app/api/demo/evidence/route.ts`; `app/api/upload-sessions/route.ts` |
| Recomendações de serviços/empresas | Capacidades e três empresas fictícias derivadas das menores dimensões; sem qualificação comercial real | `lib/demo-solution-preview.ts` |
| Conselho | Três sínteses determinísticas e somente leitura; agentes/tools desligados | `lib/council-insights.ts`; `app/conselho/page.tsx` |
| Administração | Cockpit restrito ao owner/admin do tenant demo; não é backoffice global | `app/demonstracao/administracao/page.tsx` |
| Worker/outbox | Fila e consumo operacional; handlers de eventos de domínio são no-op | `workers/outbox-worker.mjs` |

Ausências como upload real, Qualification Network, contato real, Agentic e
Ecosystem são **congelamentos deliberados** de `RC2_SCOPE_FREEZE_2026-09-19.md`,
não regressões que autorizem ativação durante HSP. O gap é a distância entre a
simulação atual e a promessa de analisar arquivos reais e recomendar provedores
qualificados com precisão.

## Achados prioritários

1. **P0 para confiança da apresentação — proveniência aparenta ser mais forte que é.** `app/diagnostico-v1/journey.tsx:194-203` anexa os mesmos até três IDs sintéticos a **toda** resposta. `app/api/diagnostics/[id]/answers/route.ts:54-65` só confirma a existência e empresa; não verifica pertinência documental. O staging mostra **50 respostas com evidência, 3 fontes vinculadas e 0 verificadas**. A interface avisa que são fictícias/não verificadas, mas “50 com evidência” pode ser entendido como 50 respostas documentalmente fundamentadas. `lib/diagnostic-answer-quality.ts:112-124` fixa força da evidência em 0,35 e consistência em 0,5; o score de confiança de 78% não comprova validação independente. Exigir vínculo por pergunta, relevância e linguagem de “referência declarada” até revisão verificável.
2. **P0 para integridade de produto — rotas legadas publicadas.** `/diagnostico` exibe formulário fixo com botões “Não sei” e “Continuar” sem ação (`components/question-card.tsx`); `/resultado` mostra score fictício **64**, enquanto o relatório canônico do mesmo tenant mostra **55**. `/cto-tax` e `/referral` usam cenário DEMO-001/Empresa Aurora fixos. Todas abriram no staging; `/ecossistema` também é acessível por URL apesar da flag desligada. As cinco páginas não invocam `requirePageTenantContext`; `proxy.ts:25-28` ainda passa adiante sem credenciais Supabase em configuração incompleta. Não se observou vazamento real, mas o conteúdo é enganoso e o fail-closed é incompleto. Bloquear, redirecionar ou isolar essas superfícies sob tenant/flag de demonstração após revisão do contrato.
3. **P1 — falha de banco vira ausência de dados em duas telas.** `app/diagnostico-v1/page.tsx:10-35` e `app/demonstracao/page.tsx:21-31` ignoram `error` das consultas. Parte das telas locais já recebeu tratamento equivalente, mas essas ainda podem mostrar empresa ausente ou etapa pendente durante falha operacional.
4. **P1 — origem do pacote demo pode divergir.** Diagnóstico escolhe as três primeiras fontes com prefixo `DEMO:%` (`app/diagnostico-v1/page.tsx:23-35`); Documentos/cockpit contam três referências canônicas exatas (`lib/demo-scenario.ts`). O cockpit hospedado tem nove registros no ledger, três canônicos e zero verificados. Testar cenário contaminado e referenciar apenas os IDs canônicos adequados a cada pergunta.
5. **P1 — CTA condicional quebrado.** `/demonstracao` mostra “Abrir central” a qualquer papel (`app/demonstracao/page.tsx:39,64`); para não owner/admin, `/demonstracao/administracao` responde 404 (`page.tsx:12`). O link não deve ser oferecido sem elegibilidade.
6. **P1 — contraste e foco aquém do design exigido.** `--g-faint: #74827f` (`app/globals.css:16`) dá 4,01:1 no branco e cerca de 3,8:1 no canvas, abaixo de 4,5:1 para texto normal em WCAG 2.2 AA. A borda de foco verde a 30% (`:88`) equivale a cerca de 1,3:1 no branco; precisa de sinal visual mais nítido. O gate `scripts/check-design-system.mjs:118-125` verifica somente cinco pares e não detecta isso.
7. **P2 — mobile e semântica.** A escala do diagnóstico cai a 8 px em até 640 px (`app/globals.css:1681`), abaixo da meta interna de 12–14 px. Topbar/sidebar usam alvo de 42 px diante do contrato de 44 px. Home e relatório anunciam confiança desconhecida como 0 ao leitor de tela via `aria-valuenow={... ?? 0}` (`app/page.tsx:132`; `app/resultado-v1/page.tsx:213`). A topbar usa “Empresa ativa” sem nome/troca do tenant (`components/app-navigation.tsx:267-270`). Histórico expõe códigos internos/UUIDs (`app/historico/page.tsx:58-71`).
8. **P1 de gate — verificador de baseline desatualizado.** `pnpm production:state-check` falha: **esperava 22 rotas API, encontrou 23** (`scripts/check-production-scale-baseline.mjs:29`). A nova rota deve ser inventariada e o gate reconciliado. `pnpm quality` não executa esse verificador (`package.json:13-27`), de modo que qualidade verde não equivale a baseline HSP aprovada.

## Testes e limites da evidência

- No HEAD local, `pnpm quality` passou: lock/public/work/security, lint,
  TypeScript, **34/34 testes nativos**, **81/81 Vitest** e build Next.js.
  `pnpm db:check` validou 23 migrations; `pnpm delivery:check` passou.
- `supabase test db` local passou **95/95** em 13 arquivos, inclusive RLS,
  cross-tenant, consentimento, papéis, missões e hardening.
- `pnpm audit --audit-level high` consultou o registry e retornou
  “No known vulnerabilities found”. Isso não é garantia de ausência de falhas.
- Staging: navegação autenticada verificou telas distintas, as sete etapas,
  relatório, soluções, Conselho e administração; 15 páginas centrais/demonstrativas
  renderizaram a 320 px sem rolagem horizontal ou imagem quebrada. Cliques reais
  “Prioridades” (lateral) e “Soluções” (superior) abriram seus destinos. Também
  se comprovou que páginas legadas servem conteúdo fixo. A amostra de relatório
  em 375/768/1280 px não apresentou overflow. Isso não certifica todos os
  estados, papéis, contraste por pixel ou interações.
- A auditoria de rotas anterior registrou 22/22 rotas e 20/20 links HTTP PASS
  no artefato hospedado; ela só media disponibilidade/overflow, não veracidade
  nem interação. Não há novo E2E hospedado para `55967dd`.
- PR #25 segue aberto no commit remoto `e72f6b6`; quality remoto está vermelho,
  database/CodeQL verdes. A correção local de integridade ainda não foi enviada.

## HSP-4 e encaminhamento

`GENESIS_360_HSP_0_4_FINAL_REPORT_2026-09-20.md` mantém **NO-GO**: a prova
funcional histórica de 100 tenants passou sem cross-tenant, mas p95 hospedado
excedeu o SLO de 750 ms (dashboard 1.474,87 ms), convite retornou 502, e
backup gerenciado/retenção, paging externo e decisão de licenças/SBOM não tiveram
fechamento operacional comprovado. As correções posteriores de código não
recebem PASS sem repetição dos gates no mesmo artefato. Percentuais documentados:
Fundação **92%**, MVP **82%**, V1 **64%**; esta auditoria não os aumenta.

Ordem recomendada: (1) fechar rotas legadas e CTA para perfis comuns;
(2) corrigir proveniência e leitura fail-closed, com teste de registros demo
extras; (3) corrigir contraste, foco, escala mobile e semântica; (4) reconciliar
baseline, ampliar testes de páginas/API e repetir CI; (5) publicar o **mesmo**
artefato revisado somente após autorização específica e repetir fluxo hosted e
gates afetados. Upload/extração/verificação de arquivo real, provedores reais e
Agentic exigem as futuras Waves aprovadas, sem ativação implícita.
