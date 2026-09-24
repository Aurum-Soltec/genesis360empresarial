# HSP-4 — candidato técnico para o gate de licenças

**Estado: BLOCKED.** Este candidato torna explícito que o check geral de CI
não é o aceite de licenças quando o relatório acusa revisão pendente. Não constitui aceite jurídico,
NOTICE completo ou prova dos bytes implantados no Railway.

## Baseline e achado

O checkout de origem da análise local foi `93c633e`; o candidato público técnico
foi incorporado ao commit `40b9b822b2b2481495d47e9e21d833623b94ec74` no PR #25. O runtime hospedado continua
`bb290bc7bc35f77b4ca01aecdbf19b748c386270`. No [SBOM Linux do CI do
runtime](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/35940477733),
há 454 dependências e 30 declarações fora da preferência do [ADR-015](../canonical/v1/product/ADR-015_OSS_LICENSE_POLICY.md).
O JSON publicado tem SHA-256
`6236a595dde9c7b7cc07e851e0cf23e65f3acc5d70b5e261ac4b13ad90042ea7`.
Esse SBOM descreve o pacote **instalado no runner**; nem o nome `runtime` nem
o novo inventário comprovam composição dos contêineres web e worker.

| Licença declarada | Pacotes/versões para disposição |
|---|---|
| LGPL-3.0-or-later | `@img/sharp-libvips-linux-x64@1.3.3` |
| MPL-2.0 | `axe-core@4.13.0`; `lightningcss@1.32.0`, `1.33.0`; `lightningcss-linux-x64-gnu@1.32.0`, `1.33.0` |
| ISC | `electron-to-chromium@1.5.433`; `eslint-import-resolver-typescript@3.10.1`; `fastq@1.20.3`; `flatted@3.4.4`; `glob-parent@5.1.2`, `6.0.2`; `graceful-fs@4.2.11`; `isexe@2.0.0`; `lru-cache@10.4.3`, `5.1.1`; `minimatch@3.1.5`; `picocolors@1.1.1`; `saxes@6.0.0`; `semver@6.3.1`, `7.8.5`; `siginfo@2.0.0`; `which@2.0.2`; `yallist@3.1.1` |
| Outras | `@csstools/color-helpers@5.1.0` MIT-0; `argparse@2.0.1` Python-2.0; `caniuse-lite@1.0.30001810` CC-BY-4.0; `language-subtag-registry@0.3.23` CC0-1.0; `minimatch@10.2.6` BlueOak-1.0.0; `tslib@2.8.1` 0BSD |

## Correção técnica proposta

O candidato mantém o precheck de declarações e publica a classificação
`pnpm --prod` sem reprovar automaticamente o CI pelos 21 pacotes fora da
árvore de produção. O relatório não pode ser interpretado como PASS só porque
qualidade, banco e CodeQL passaram. O CI gera
um inventário dos arquivos instalados dos 30 pacotes: SHA-256 agregado de
conteúdo, SHA-256 individual de LICENSE/NOTICE e de binários nativos, número
de arquivos e caminhos de symlinks não seguidos. Arquiva também cópias exatas
dos LICENSE/NOTICE encontrados, com hash conferido após a cópia. O artefato é
preservado mesmo se uma verificação anterior falhar. O resumo do job declara
textualmente `HSP-4 license gate: BLOCKED`, independentemente do status verde
do precheck.

No lock atual, a árvore `pnpm --prod` local contém **9** das 30 declarações:
`@img/sharp-libvips-linux-x64@1.3.3` (LGPL), `caniuse-lite@1.0.30001810`
(CC-BY), `electron-to-chromium@1.5.433`, `lru-cache@5.1.1`,
`picocolors@1.1.1`, `semver@6.3.1`, `semver@7.8.5`, `yallist@3.1.1` (ISC), e
`tslib@2.8.1` (0BSD). As outras **21** estão fora da árvore de dependências de
produção, mas podem ainda estar fisicamente no contêiner se o deploy copiar o
`node_modules` de build inteiro. As nove são **candidatas de runtime**, não
prova de incorporação. O [CI Linux do commit público](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36004585089) repetiu a classificação 9/30, passou quality/database e arquivou inventário/hash dos 30 pacotes instalados e 28 arquivos LICENSE/NOTICE copiados. Três pacotes não possuíam LICENSE/NOTICE local. CodeQL e Analyze também passaram no [run 36004579982](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36004579982). Nenhum desses checks inspecionou os bytes Railway ou aprovou a licença.

Pela redação do ADR-015, as **seis declarações ISC e uma 0BSD** na árvore de
produção podem ser submetidas à revisão técnica como candidatas permissivas
equivalentes à lista preferencial; isso exige registrar licença, versão,
atribuição e decisão do proprietário, sem presumir aprovação. A declaração
**CC-BY-4.0** de `caniuse-lite` exige tratar atribuição e contexto do dado.
A **LGPL-3.0-or-later** de libvips exige decisão específica do
proprietário/jurídico sobre uso hospedado, transferência do binário, textos,
fontes e condições aplicáveis. As cinco MPL e demais 16 itens fora da árvore
prod só deixam o gate de runtime se o artefato final comprovar sua ausência;
o scanner do runner instalado não consegue fazer essa exclusão.

O inventário local no Windows encontrou 27 dos 30 pacotes; os três pacotes
Linux ausentes no host de teste são `@img/sharp-libvips-linux-x64@1.3.3` e
`lightningcss-linux-x64-gnu@1.32.0`/`1.33.0`. Isso é esperado para o host
Windows e **não** pontua como prova Linux. No runner Linux, ausência de algum
pacote listado no SBOM faz o inventário falhar fechado. Um pacote sem arquivo
LICENSE/NOTICE continua destacado para revisão; não recebe licença concluída
automaticamente. Os testes de política e de alteração de bytes passam no
checkout candidato.

## O que ainda falta para PASS

1. Preservar os artefatos do CI Linux `36004585089`, vinculados ao commit
   `40b9b82`, e repetir os checks se o candidato for alterado. O `--enforce`
   permanece disponível para o gate final, após delimitar os pacotes reais
   do artefato.
2. Vincular os hashes de web e worker ao **artefato Railway efetivamente
   implantado**; separar dependências apenas de build/teste das incorporadas
   em cada contêiner. A análise de arquivos instalados no CI não substitui
   inspeção ou manifesto assinado do deployment.
3. Completar NOTICE, textos e oferta de fontes/relink quando aplicável aos
   componentes efetivos, incluindo bibliotecas embutidas em libvips; preservar
   versões imutáveis. O pacote npm de libvips e seu aviso de terceiros exigem
   revisão específica, além da declaração Apache-2.0 de `sharp`.
4. O proprietário/jurídico deve registrar a admissibilidade ou rejeição de
   cada licença fora da preferência do ADR-015 e as condições para serviço
   hospedado e eventual distribuição. Se rejeitada a libvips, demonstrar sua
   exclusão **no artefato final** antes de nova promoção; mudar a tag de imagem
   na UI, por si só, não prova exclusão.
5. Só então codificar exceções exatas e revisadas no scanner, repetir CI no
   mesmo SHA e promover o mesmo artefato. Qualquer alteração deve reexecutar
   testes afetados. O gate permanece BLOCKED enquanto um desses itens faltar.
