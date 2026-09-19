# [SUPERADO] Genesis Glass Dark

> Superado para o Genesis 360 Empresarial V1 em 2026-08-18. Consultar `docs/canonical/v1/ux/DESIGN_SYSTEM_LIGHT.md`.

# Genesis Glass — Design System V1

## Princípio

A interface deve transmitir precisão, segurança, silêncio visual e inteligência. O foco não é exibir todas as capacidades do sistema, mas revelar a próxima ação.

## Direção visual

- fundo quase preto com profundidade verde;
- verde-lima como energia e progresso;
- verde Tax para sinais tributários;
- ciano apenas para informação tecnológica;
- superfícies translúcidas de baixo contraste;
- bordas finas;
- tipografia grande e editorial;
- muito espaço vazio;
- microinterações discretas;
- uma ação principal por contexto.

A referência de linguagem é minimalismo premium contemporâneo. Não copiar componentes, layouts ou marcas de terceiros.

## Tokens provisórios

Os tons abaixo foram calibrados para manter a identidade visual do dossiê. Confirmar os hexadecimais com o arquivo oficial de branding antes da produção final.

| Token | Valor | Uso |
|---|---|---|
| Black | `#050806` | fundo |
| Ink | `#0A100C` | superfícies sólidas |
| Lime | `#A8FF3E` | progresso, CTA, destaque |
| Lime Strong | `#84F20F` | gradiente e ação |
| Tax | `#00D676` | sinal tributário |
| Cyan | `#42DCFF` | tecnologia/informação |
| Text | `#F6FBF7` | texto principal |
| Muted | `#A7B4AA` | texto secundário |
| Border | `rgba(218,255,225,.13)` | borda de vidro |

## Glassmorphism com legibilidade

- opacidade de superfície entre 3,5% e 9,5%;
- `backdrop-filter` entre 18 e 24 px;
- contraste de texto conforme WCAG AA;
- vidro nunca deve ser usado sobre imagem ruidosa;
- inputs usam superfície mais sólida;
- borda visível em foco;
- modo `prefers-reduced-motion`.

## Tipografia

- usar fonte de sistema inicialmente;
- não embutir arquivos de fontes;
- títulos com tracking negativo;
- corpo entre 15 e 17 px;
- altura de linha mínima de 1,5;
- números de score com alta legibilidade.

## Layout

- desktop: sidebar 260 px + conteúdo fluido;
- tablet: sidebar recolhida;
- mobile: topbar e coluna única;
- largura máxima de leitura para textos;
- cards com raio 22–32 px;
- grid de 12 colunas conceitual.

## Componentes essenciais

- BrandMark;
- AppShell;
- GlassCard;
- Badge;
- Button;
- ProgressBar;
- ScoreOrbit;
- QuestionCard;
- DocumentSuggestion;
- ConfidenceIndicator;
- RiskCallout;
- TaxDisclosure;
- ReferralConsent;
- EmptyState;
- ErrorState;
- Skeleton;
- Toast;
- Modal de confirmação.

## Estados

Todo componente interativo deve documentar:

- default;
- hover;
- focus;
- active;
- selected;
- disabled;
- loading;
- error;
- success;
- empty;
- permission denied.

## Acessibilidade

- contraste AA;
- teclado;
- foco visível;
- `aria-*`;
- não depender apenas de cor;
- escala de texto até 200%;
- touch target mínimo 44 px;
- animação reduzida;
- mensagens de erro próximas ao campo.
