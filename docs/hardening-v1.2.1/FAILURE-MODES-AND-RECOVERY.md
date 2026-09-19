# Falhas, operação e recuperação

| Falha | Detecção | Contenção / recuperação | Dono funcional | Evidência exigida |
|---|---|---|---|---|
| UNKNOWN vira zero | Regressão unitária; consumidor recebe NULL+status | Corrigir coerção; reavaliar com versão nova, não alterar histórico | Metodologia / backend | Antes/depois e regressão |
| Cliente envia verified/confidence1 | Schema400; RPC42501 | Bloquear; nunca promover declaração automaticamente | Segurança / backend | Contrato estrito e pgTAP negativo |
| Resposta de aba antiga sobrescreve atual | expectedRevision divergente →409 | Reler; preservar contexto da resposta; não retry cego | Backend / UX | Duas sessões concorrentes |
| Timeout depois de commit | Cliente não confirma retorno | Recarregar estado; submissão retorna snapshot existente | Backend / UX | Injeção de falha após commit |
| Submissão concorre com resposta | Revisão / lock da linha | Um resultado apenas; resposta tardia rejeitada | Dados | Teste concorrente real |
| Falta banco ou consulta falha | Erro500, não falso vazio/403 | Mensagem sem dados do provedor; não inventar resultado | Operação | Degradação de dependência |
| Índice único detecta histórico duplicado | Migração falha | Revisar registros em homologação; não apagar “duplicados” por adivinhação | Dados / negócio | Auditoria da correção e migration test |
| Lock ausente, audit ou build falha | CI bloqueado | Resolver/auditar/corrigir; não pular gate | Plataforma | Logs e lock revisado |
| Conteúdo restrito vai ao staging | Denylist e revisão de nomes | Remover antes do commit; se já exposto, tratar incidente e rotacionar segredos pertinentes | Proprietário / segurança | Revisão de publicação |
| Evidência disponível porém falsa/irrelevante | Não há verificador homologado | Nenhum incremento de confiança por referência | Metodologia | Aprovação de fluxo de revisão |

Responsáveis nominais não foram inventados: devem ser designados pelo proprietário.

## Ordem de rollout
Não há deployment automático neste pacote. Primeiro instalar e testar em ambiente local isolado.
Depois usar homologação sem dados de clientes. Validar as15 migrações e todas as suítes.
Para migração de instalação existente: janela controlada de suspensão de gravações, backup e restore previamente ensaiados,
checagem de duplicados, aplicação das migrações, aplicação compatível, smoke e teste de fronteiras.
0013 desativa o escritor de resultado antigo: não aplicar a uma aplicação V1.2 que continue recebendo gravações.

## Rollback
Não existe autorização para “voltar ao código antigo” mantendo novas migrações e reabilitando o bug.
Preferir correção para frente com gravações suspensas. Restaurar somente a partir de procedimento ensaiado,
com consequência sobre dados explicitada e aprovação do responsável.
O pacote não contém restore testado, RTO/RPO definidos ou runbook de produção homologado.

## Bloqueios restantes
Rate limiting distribuído, SLOs, alertas e redaction operacional, backup/restore, concorrência sob carga,
segurança HTTP autenticada, fluxo de entrada, CSP e acessibilidade no navegador permanecem sem comprovação integrada.
Não usar o sucesso das verificações nativas como substituto desses controles.
