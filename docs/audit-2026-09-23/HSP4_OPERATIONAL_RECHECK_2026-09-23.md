# HSP-4 — Rechecagem operacional limitada

Data: 2026-09-23

Escopo: evidência versionada e código local, sem alteração do staging nem teste de carga novo.
Decisão: **NO-GO**. Um relatório local não substitui a repetição dos gates no artefato hospedado.

| Gate | Estado desta rechecagem | Evidência e limite | Próxima prova objetiva |
|---|---|---|---|
| Convite administrado | **BLOCKED** | `docs/audit-2026-09-20/hsp1-hosted-invite.json` registra HTTP 502, sem recebimento/callback. O 502 histórico **não prova** que SMTP seja a causa. O candidato local agora distingue nos logs as etapas Auth, membership e audit, sem expor e-mail ou erro do provedor; ainda não foi promovido ao staging. | Promover o candidato, observar a etapa sanitizada que falha; usar caixa postal controlada e comprovar convite, recebimento, callback e membership no tenant correto. |
| Backup gerenciado e RPO | **BLOCKED** | `docs/audit-2026-09-20/hsp2-hosted-logical-restore.json` prova restore **lógico manual** em 3,179 s e contagens do snapshot, não backup automático/retido. Não há ID e timestamp de snapshot gerenciado nem observação da idade do último ponto recuperável. | Evidência de backup automático, retenção exigida, integridade e restore isolado de snapshot gerenciado; medir RPO pela diferença entre incidente simulado e ponto efetivamente recuperável. |
| RTO do restore lógico isolado | **PASS limitado** | 3,179 s contra alvo de 1.800 s, em dataset pequeno com dois tenants; não equivale a RTO da recuperação operacional completa em volume de piloto. | Drill em volume representativo com cronômetro até serviço íntegro e autenticação operacional. |
| Alertas e atendimento | **BLOCKED** | `.github/workflows/staging-monitor.yml` define probes a cada 15 min e cria issue com assignee em falha. Não há execução hospedada comprovada do drill, recebimento externo, acknowledgement humano ou tempo de reação. Issue atribuída não equivale a paging comprovado. | Falha simulada controlada, execução do workflow, notificação recebida por operador nomeado, acknowledgement registrado, recuperação e fechamento; sem expor credenciais. |
| 100 tenants: função e isolamento | **PASS histórico limitado** | `docs/audit-2026-09-20/hsp3-100-tenants-load.json`: 100 tenants, 10 sessões, 3.600,9 s, 18.610 requests, 600 negações cross-tenant esperadas, zero falha funcional. O artefato mudou depois desta data; repetir após promoção. | Executar o mesmo fluxo fim a fim no mesmo artefato promovível e conservar IDs de run/deploy, resultados e amostras. |
| 100 tenants: SLO p95 | **FAIL** | Alvo 750 ms; login 2.103,47 ms em apenas 10 amostras, tenant switch 756,06 ms, dashboard 1.474,87 ms e escrita 1.166,55 ms. CPU web 5,9%, memória 22,6%, 19 conexões e zero deadlock no fim da janela (`hsp3-hosted-metrics.json`). Estes dados tornam latência de rede/round trips plausível, **não comprovada**. | Medir por hop antes de otimizar, incluindo DNS/TLS, Auth, app, Supabase/RPC, pool e worker; repetir soak de 60 min e verificar p50/p95/p99/error rate/saturação. |
| SBOM técnico Linux x64 | **PASS local, runtime remoto pendente** | O gerador atual `scripts/generate-sbom.mjs` produziu localmente 446 pacotes instalados para `linux/x64` em `test-results/hsp4-runtime-linux-x64.sbom.spdx.json`. Nenhum pacote dessa lista declarou GPL/LGPL/AGPL ou `NOASSERTION`. O SBOM anterior de todas as plataformas tinha 454 pacotes e um `@img/sharp-win32-x64` com expressão `Apache-2.0 AND LGPL-3.0-or-later`; o binário Windows não aparece no inventário Linux. `.github/workflows/ci.yml` gera o artefato Linux, mas seu run remoto atual não foi consultado nesta rechecagem. O inventário instalado inclui dependências de desenvolvimento/build e não atesta sozinho a composição exata do bundle implantado. | Conferir o artefato do CI para o SHA promovido, pacote por pacote com lock e bundle, NOTICE/atribuições e versões. |
| Aceite de licenças | **BLOCKED** | Além das licenças preferidas pelo ADR-015, o inventário Linux contém MIT-0, Python-2.0, MPL-2.0, CC-BY-4.0, CC0-1.0 e BlueOak-1.0.0. O ADR exige revisão antes de tratar equivalentes como aprovados; ausência de LGPL no alvo Linux não é parecer jurídico. | Revisão técnica/jurídica do inventário exato, obrigações de NOTICE/atribuição e decisão documentada antes de liberar o gate. |

## Observações para correção

- O convite chama Auth antes do `upsert` de membership. Se Auth aceitar e a gravação falhar, o e-mail pode existir sem acesso correspondente; o código não comprova compensação. O candidato local acrescentou logs estruturados com etapa fixa e ID opaco, preservou o 502 público genérico e passou oito testes focados do boundary/convite. Antes de repetir HSP-1, o operador deve reconciliar Auth e membership em caso de falha após a etapa Auth; não fazer retry cego.
- O script local `scripts/run-backup-restore-drill.ps1` usa `rpo_observed_seconds` para o tempo transcorrido desde o início do ensaio. Isso **não mede** RPO real. A decisão HSP-4 hospedada já considera RPO não medido e deve continuar assim até o drill gerenciado.
- O workflow de monitor não substitui pessoa de plantão e canal de aviso cuja entrega/acknowledgement tenham sido observados.
- O teste de HSP-3 publicado é evidência histórica, mas o repositório não contém um harness reproduzível daquele soak hospedado. A repetição precisa preservar configuração, workload e limites financeiros para comparação.
- Não iniciar `PILOT-1` nem promover um gate para PASS apenas pelo novo SBOM ou pelo restore lógico. As cinco flags sensíveis continuam desligadas.

## Acesso e decisões externas

1. **HSP-1:** proprietário/operação fornece uma caixa postal controlada e configuração de entrega admissível; engenharia acrescenta diagnóstico sanitizado e repete o convite completo.
2. **HSP-2:** proprietário/operação define solução gratuita que comprove backup automático, retenção, recuperação e notificação; se não houver solução admissível, o gate permanece bloqueado. Um operador nomeado confirma recebimento e acknowledgement.
3. **HSP-2:** responsável técnico/jurídico aceita ou rejeita as licenças e notices do bundle exato.
4. **HSP-3:** engenharia executa profiling por hop e repete a carga após alteração justificada, com isolamento, worker e custos observados.

Os dados numéricos aqui citados são históricos de 20/09; a única nova geração local foi o inventário SPDX Linux x64. Nenhuma credencial, conexão de banco ou segredo foi incluído.
