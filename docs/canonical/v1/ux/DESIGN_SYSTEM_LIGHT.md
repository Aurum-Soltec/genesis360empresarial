# GENESIS LIGHT - DESIGN SYSTEM V1

## Objetivo visual

Transmitir:
**clareza, maturidade, precisão, confiança, evolução.**

A interface não deve parecer ferramenta de IA. Deve parecer infraestrutura empresarial premium.

## Tokens

| Token | Valor | Uso |
|---|---:|---|
| canvas | `#F6F8F5` | fundo global |
| surface | `#FFFFFF` | cards/painéis |
| surface-soft | `#EFF3EE` | agrupamentos |
| ink | `#111713` | texto principal |
| muted | `#657068` | texto secundário |
| subtle | `#8A948D` | metadado |
| line | `#DDE3DD` | bordas |
| line-strong | `#C7D0C8` | divisão ativa |
| genesis-lime | `#A8FF3E` | energia/assinatura, uso restrito |
| genesis-green | `#225A31` | CTA/estado positivo acessível |
| info | `#176B78` | informação |
| warning | `#9B651A` | alerta |
| danger | `#B73A3A` | risco |
| focus | `#246B34` | foco |

## Regra de cor

O lime original permanece patrimônio visual, mas não é usado como texto de corpo nem como grande fundo. Para contraste, ações principais usam verde profundo ou ink.

## Radius

Regra consistente:
- cards: 18px;
- inputs: 12px;
- buttons: 12px;
- pills/badges: 999px apenas quando semanticamente “pill”.

## Shadows

Sombras quase invisíveis:
`0 8px 28px rgba(24, 38, 28, .06)`

Borda é mais importante que sombra.

## Dashboard manager-first

Primeira viewport:
1. estado da empresa;
2. próxima decisão;
3. score/completude;
4. Top 3 prioridades;
5. missão atual;
6. caminho para solução qualificada.

Não colocar todos os módulos acima da dobra.

## Componentes

- TopNav;
- ContextSidebar;
- CompanySwitcher;
- ManagerBrief;
- MetricTile;
- PriorityList;
- ScoreSummary;
- PassportCompleteness;
- MissionNow;
- QualifiedSolutionPreview;
- DecisionConfidence;
- EmptyState;
- ErrorState;
- PermissionState;
- Skeleton;
- Dialog/Confirm;
- Toast.

## Accessibility

- WCAG 2.2 AA como baseline;
- foco visível;
- 44px em alvo touch quando possível;
- sem depender só de cor;
- reduced motion;
- contrast check obrigatório;
- labels e erro próximos ao campo.
