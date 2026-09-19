# Decisões técnicas do candidato

As decisões abaixo estão implementadas dentro do saneamento autorizado; sua promoção a produção depende de revisão e evidência integrada.

## ADR-H001 — Um avaliador de diagnóstico
Benefício: elimina fórmulas concorrentes para confiança e score.
Custo: padronização de contratos, novos campos e ajuste da apresentação de NULL.
Trade-off: índice global indisponível quando faltam dimensões é menos “comercialmente bonito”, mas não fabrica nota.
Política preservada: pesos existentes e limiar dimensional0,6. Nova agregação conservadora exige todas as dimensões aplicáveis suficientes.
Falha prevista: consumidores legados podem coagir NULL para0; Home/Resultado foram corrigidos, demais integrações devem seguir o contrato.
Reversibilidade: regra versionada, sem recálculo destrutivo de histórico.
Revisão: evidência metodológica de piloto que justifique outro limiar ou núcleo comparável.

## ADR-H002 — Declaração não é verificação
Benefício: elimina promoção controlada pelo cliente e confiança1 autodeclarada.
Custo: integrações legítimas não usam mais a mesma entrada genérica para criar fatos verificados.
Trade-off: sem incremento por referência, a confiança é conservadora até existir verificação real.
Falha prevista: documento irrelevante, reutilização de evidência de outro tenant, verificador sem independência.
Mitigação: referência resolvida no tenant/empresa; nenhum incremento nesta tranche; rota/RPC pública de declaração não verifica.
Reversibilidade: criar fluxo separado de revisão com autorização, finalidade, ligação evidência→afirmação, auditoria e revogação.
Revisão: metodologia de verificação e testes adversariais aprovados.

## ADR-H003 — Revisão otimista e resultado imutável
Benefício: evita lost update e regravação destrutiva na conclusão.
Custo: conflito409 exige reler o estado e novas migrações/RPCs.
Trade-off: timeout não é interpretado automaticamente como falha de gravação; interface permite recarregar sem repetir.
Instante: a revisão da resposta atualiza `evaluation_as_of`; coleta e submissão subsequentes usam esse mesmo instante.
Contexto: `context_snapshot` congela aplicabilidade do diagnóstico. Mudança empresarial relevante exige nova avaliação, não edição oculta do histórico.
Failure modes: submissão concorre com autosave; duas submissões; erro após commit; corrupção de snapshot; rascunho legado sem contexto.
Mitigação: lock da linha do diagnóstico, revisão esperada, snapshot persistido, retorno de replay e erro explícito de legado.
Reversibilidade: migrações aditivas e correção para frente; não reativar escritor antigo inseguro como “rollback”.
Revisão: testes reais de contenção, volume, conflito e política de retenção.

## ADR-H004 — Repositório público, importações restritas separadas
Benefício: permite publicação intencional sem distribuir dossiês internos por acidente.
Custo: fontes restritas são referenciadas por nome/hash, não acessíveis aos leitores do GitHub.
Trade-off: revisão técnica pública não equivale a licença aberta.
Revisão: decisão explícita de licença e autorização de novos documentos.

## ADR-H005 — Patch de segurança com gate de resolução
Benefício: evita continuar sobre Next16.2.6 após alerta oficial que recomenda16.3.3.
Custo: lock novo, possível ajuste de dependências transitivas e testes em Node24.
Trade-off: este candidato não tem instalação congelada comprovada; o CI bloqueia por esse motivo.
Reversibilidade: outro alvo corrigido e compatível pode ser escolhido com fonte/evidência; não fazer downgrade para vulnerabilidade conhecida.
Revisão: releases/advisories novos, audit ou incompatibilidade no build.
As actions ainda usam tags de major; pinagem por SHA revisado é pendência de supply-chain antes de promover produção.
