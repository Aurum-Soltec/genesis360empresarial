# HSP-3 — viabilidade da nova carga hospedada de 100 empresas

Rechecagem em 2026-09-23 no **staging isolado**. A consulta ao Auth Admin e ao banco foi somente leitura. Não houve seed, convite, troca de senha, alteração de vínculo ou carga. Esta evidência contém apenas contagens; nenhum e-mail, ID individual, senha ou chave foi registrado.

## População sintética existente

| Verificação agregada | Resultado |
|---|---:|
| Contas sintéticas esperadas presentes / confirmadas / etiquetadas | 10 / 10 / 10 |
| Tenants esperados presentes / ativos | 100 / 100 |
| Empresas esperadas presentes / fictícias e vinculadas ao tenant correto | 100 / 100 |
| Vínculos esperados presentes / owner correto | 100 / 100 |

A consulta ampla ao banco também encontrou 102 tenants/empresas fictícios e 104 vínculos, dos quais os 100 pares acima pertencem à população HSP-3. Os outros registros não entram na carga. Os dez usuários haviam acessado o serviço no dia do ensaio anterior (2026-09-20 UTC). Isso sustenta que a população anterior persiste, mas não prova que a senha ainda autentica hoje.

## Recuperação segura da fixture

Foi encontrado um **wrapper de operador privado, ignorado pelo Git**, que mantém a credencial sintética anterior e usa a proteção local do Windows para as chaves de staging. O novo adaptador privado reconstrói deterministicamente os dez usuários e cem pares tenant/empresa, grava a fixture somente em diretório temporário **fora do repositório**, com ACL restrita ao usuário atual, e a remove em finally. A senha não aparece em argv, saída, evidência ou commit. O compartilhamento de uma senha entre contas de teste permanece um débito operacional; ela deve ser rotacionada após o ensaio.

O modo Check do adaptador foi executado em 2026-09-23. O harness aceitou a estrutura: **10 usuários sintéticos, 100 tenants únicos, destino de staging, duração configurada de 3.600 segundos, limites de 30.000 requests e 6.500 escritas**, com SHA e deployment ID explícitos. O diretório temporário foi eliminado; não havia diretórios de fixture remanescentes na verificação posterior. Este modo não fez login, não chamou Auth Admin e não gerou carga.

O wrapper protegido só pôde abrir o material local de staging no contexto do usuário Windows que o criou; o sandbox padrão não conseguiu decifrá-lo. A execução futura deve usar esse mesmo contexto protegido. Não é necessário resetar senhas, criar nova conta, registrar chave SSH ou fazer seed para preparar a fixture. A checagem agregada do Auth Admin e banco foi feita separadamente, com chamadas GET, e confirmou os números da tabela.

## Execução ainda pendente

Após promover e confirmar o **SHA exato** no web e worker, configurar no processo local apenas os valores não secretos HSP3_STAGING_URL, HSP3_TARGET_HOST_ACK, HSP3_ISOLATED_STAGING_ACK=yes, HSP3_DEPLOY_SHA e HSP3_DEPLOY_ID. O operador executa primeiro o modo Check do adaptador privado; somente então executa Run. O modo Run usa o harness versionado em scripts/run-hsp3-100-tenants.mjs e sua fixture temporária. Não passar credenciais por argumentos, colar fixture em terminal, nem registrar a saída de Auth Admin. O harness exige explicitamente o host e a indicação de staging isolado.

Antes do ensaio de 60 minutos, verificar crédito/uso restantes dos serviços gratuitos. Durante o ensaio, colher métricas independentes de HTTP, Auth, PostgreSQL, pool, outbox, worker, erros, percentis, saturação e custo. O relatório histórico [hsp3-100-tenants-load.json](../audit-2026-09-20/hsp3-100-tenants-load.json) é apenas referência: registrou p95 acima do limite e não substitui a repetição pós-correção.

**Gate HSP-3: FAIL, ainda aberto.** A fixture foi recuperada estruturalmente, mas login real de todos os dez usuários, negativas cross-tenant e a carga fim a fim de **100 empresas por 60 minutos** no novo artefato ainda não foram executados. O gate só pode passar com p95 ≤ 750 ms, erro dentro do limite aprovado e ausência de vazamento ou corrupção, junto das evidências operacionais independentes.
