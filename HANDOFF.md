# HANDOFF — continuar sem reconstruir contexto
Versão1.2.1-rc.1; 2026-09-10.

O usuário aprovou saneamento da V1.2, código público e preços Free0/Start99/Pro297.
ZIP original intacto; pacote público separado; nenhum acesso de escrita ao GitHub foi usado.

Ler nesta ordem: PROJECT-STATE.md → START_HERE_V1_2_1.md → adendo PRD → ARCHITECTURE-DECISIONS.md
→ VALIDATION-RESULTS.json → REVIEWABLE-CODE-DELTA.json.

Mudanças relevantes: `lib/diagnostic-scoring.ts`, `lib/diagnostic-evaluation.ts`,
`lib/server/diagnostic-state.ts`, `lib/http-security.ts`, `lib/authz.ts`, APIs de mutação,
UI Diagnóstico/Home/Resultado/Missões, migrações0013–0015.
As regras originais não foram apagadas do histórico; o escritor de resultado legado foi desativado.

Não repetir estes erros: declarar produção pronta por testes nativos; usar lock antigo;
dar verified/confidence1 ao cliente; transformar NULL em zero; tirar média de confianças dimensionais na Home;
fazer retry automático após timeout de escrita; alterar fatos com SQL destrutivo; publicar dossiês restritos.

Próxima execução: publicar pacote saneado, resolver lock real e tipos Node24, revisar audit, rodar qualidade e banco.
Usar logs reais para corrigir incompatibilidades. Primeiro ciclo integrado precisa de entrada autenticada e provisionamento,
que não estão implementados nesta tranche. Só depois avançar para cobrança, IA ampliada, rede e documentos.

GatePW-0 não encerrado. Produção bloqueada. RTO/RPO, carga, quotas, responsáveis e licença não foram inventados.
