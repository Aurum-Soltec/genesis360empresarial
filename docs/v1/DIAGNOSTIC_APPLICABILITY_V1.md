# Diagnostic Applicability V1
**Status:** PARTIALLY APPROVED / conservative production baseline

## Regra aprovada
1. pergunta inativa nunca é aplicável;
2. perfil ESSENTIAL/FULL define escopo inicial;
3. dentro do escopo, pergunta ativa permanece aplicável por padrão;
4. nenhuma exclusão por setor, porte ou resposta anterior será inventada sem regra canônica versionada;
5. regras futuras devem registrar `rule_id`, condição, justificativa metodológica, versão e testes;
6. LLM não decide sozinho se uma pergunta crítica deixa de ser aplicável.

## Motivo
O banco atual possui dimensão, fase, peso e attention signal, mas não contém uma taxonomia completa e inequívoca de regras de branching por setor/porte. A baseline conservadora evita falsa metodologia.
