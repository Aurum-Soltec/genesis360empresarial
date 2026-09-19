# Evidência — V1.2.1 RC1

Data: 2026-09-10. Código original preservado. SHA256 do ZIP-base: `3ba66ee4e3720f57afeee0c018967f54f4f03a2b29b3cc9ffb6d0ad97253d1ed`.

## Executado
**34 testes nativos, 34 aprovados, 0 falhas**. Executam funções reais do projeto e objetos Request do Node,
sem simular a implementação do domínio. Incluem jornada determinística completa (sem navegador/HTTP/banco),
NULL versus zero, âncoras, confiança, entrada inválida, RBAC, origem, JSON, erros e preços.
Um caso percorre **625 combinações** para limites, monotonicidade e invariância à ordem.
Isso NÃO são625 testes independentes, nem evidência de carga.

Checagem semântica: **10 módulos-raiz puros e dependências**, TypeScript5.8.3.
Transpilação/sintaxe: **96 arquivos**, sem erro; não equivale à checagem semântica integral.
Ambiente executado: Node22.16.0. Alvo de execução do produto: Node24.21.0.
Vitest4.1.0/TypeScript6.0.3/Next16.3.3 não foram instalados neste ambiente.

Verificações de estrutura, caminhos OpenAPI, tokens visuais, migrações por texto,
contratos de segurança por tokens, fronteiras de importação, publicação por denylist
e integridade do candidato passaram nos seus escopos limitados.
O legado de integridade falhou como esperado: código foi alterado intencionalmente,
e **66 deltas de código/configuração** registram hashes antes/depois sem falsificar a baseline antiga.

## Reproduções antes/depois
| Caso | V1.2 original | V1.2.1 candidato |
|---|---|---|
| Uma âncora máxima + outra UNKNOWN, mesma dimensão | Score50/100, cobertura50% | ScoreNULL, cobertura50%, insufficient_data |
| Referência textual sem resolução | Confiança da resposta0,73→0,81 |0,73→0,73 |
| Zero respostas | Confiança global10% |0% |

Logs são entregues no ZIP de evidências, juntamente com JSONs produzidos pelo código original e pelo código corrigido.

## Preparado, NÃO executado
**26 asserções SQL novas** no arquivo010, incluindo acesso privilegiado,
ator indevido, autoverificação, confiança indevida, histórico de fatos, revisão, snapshot,
reenvio e tentativa de alteração após conclusão.
As oito suítes SQL anteriores e os helpers continuam no pacote.
As **12 migrações originais permanecem byte a byte**; foram acrescentadas0013–0015.

Foi acrescentado um arquivo Vitest com10 testes de contrato estrito.
Não houve execução da suíte Vitest integral, typecheck integral do projeto, buildNext,
PostgreSQL/pgTAP, APIs autenticadas, navegador, teste concorrente de múltiplas sessões,
load/stress, audit real de dependências, restore/failover ou deployment.

## Bloqueio intencional
O `pnpm-lock.yaml` novo está ausente. Manifesto não é resolução de dependências.
O verificador de lock devolveu código1, conforme o gate esperado.
O arquivo antigo está em `docs/history/`, não é alternativa de instalação.
Resolver, auditar e revisar a nova árvore com o workflow manual; depois versionar o lock e executar o CI.
O patchNext foi escolhido com fonte oficial, mas sua compatibilidade ainda não foi comprovada aqui.

## Decisão
**PW-0 parcialmente implementado; comprovação integrada pendente. Produção bloqueada.**
Este candidato fornece código, contratos, controles e testes — não certificação de segurança ou de recuperação.
