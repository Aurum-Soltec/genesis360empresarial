# HSP-4 — pacote de revisão de licenças do artefato `31df6086`

**Estado: revisão técnica preparada; disposição jurídica e NOTICE final pendentes.**
Este diretório organiza os 30 pacotes fora da preferência do ADR-015 que foram
encontrados **fisicamente** nos contêineres web e worker do staging, conforme
[inspeção dos deployments](../HSP4_DEPLOYED_LICENSE_BYTES_31df6086.md). A
árvore `pnpm --prod` marca somente nove como alcançáveis por dependências de
produção, mas os outros 21 também estão dentro das imagens atuais. Nenhum
deles pode ser omitido do inventário do artefato apenas por ser de build.

O [manifesto verificável](NOTICE_MANIFEST.json) liga cada nome/versão/licença
declarada ao hash agregado do pacote no CI e nos dois serviços. As **28 cópias
exatas** de arquivos LICENSE/NOTICE instalados no CI do [mesmo SHA, run
36009447882](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36009447882)
estão em `CI_PACKAGE_LICENSE_TEXTS/`; SHA-256 de cada cópia foi conferido com
o artefato CI. Esses 28 arquivos pertencem a 27 pacotes (um tem dois avisos).
O cotejo dos hashes agregados dos 30 pacotes com os contêineres hospedados
passou sem diferenças; os 28 hashes individuais dos textos também coincidiram
com **cada** serviço (56 comparações). **Arquivo encontrado ou string em `package.json` não
equivale a aprovação da licença.**

| Pacote físico em web e worker | Declaração | Texto instalado copiado para revisão |
| --- | --- | --- |
| `@csstools/color-helpers@5.1.0` | `MIT-0` | [LICENSE.md](CI_PACKAGE_LICENSE_TEXTS/d0f3d36ba92c7ed3/0/LICENSE.md) |
| `@img/sharp-libvips-linux-x64@1.3.3` | `LGPL-3.0-or-later` | **sem arquivo local**; ver fonte específica abaixo |
| `argparse@2.0.1` | `Python-2.0` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/eb6fb2df860c4a7d/0/LICENSE) |
| `axe-core@4.13.0` | `MPL-2.0` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/a700db80d2c84f37/0/LICENSE), [aviso de terceiros](CI_PACKAGE_LICENSE_TEXTS/a700db80d2c84f37/0/LICENSE-3RD-PARTY.txt) |
| `caniuse-lite@1.0.30001810` | `CC-BY-4.0` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/2279b0f6b9ead609/0/LICENSE) |
| `electron-to-chromium@1.5.433` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/bd1ceff8bdc16df4/0/LICENSE) |
| `eslint-import-resolver-typescript@3.10.1` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/37169469c59c613e/0/LICENSE) |
| `fastq@1.20.3` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/a7ea9f9d907eca5d/0/LICENSE) |
| `flatted@3.4.4` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/57b7d7dc886d3409/0/LICENSE) |
| `glob-parent@5.1.2` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/0a11153a0f1311d8/0/LICENSE) |
| `glob-parent@6.0.2` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/7b90c3653564b1f1/0/LICENSE) |
| `graceful-fs@4.2.11` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/c0b8c47fbef7d288/0/LICENSE) |
| `isexe@2.0.0` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/2f62e711a6921973/0/LICENSE) |
| `language-subtag-registry@0.3.23` | `CC0-1.0` | **sem LICENSE local**; ver README exato abaixo |
| `lightningcss-linux-x64-gnu@1.32.0` | `MPL-2.0` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/47091868ef84fe73/0/LICENSE) |
| `lightningcss-linux-x64-gnu@1.33.0` | `MPL-2.0` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/abda693e40894495/0/LICENSE) |
| `lightningcss@1.32.0` | `MPL-2.0` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/4c9ee74a100a8d29/0/LICENSE) |
| `lightningcss@1.33.0` | `MPL-2.0` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/7129b0f4411357cf/0/LICENSE) |
| `lru-cache@10.4.3` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/3a13bfe2b7911bee/0/LICENSE) |
| `lru-cache@5.1.1` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/fe7f0a2f2cf4c92f/0/LICENSE) |
| `minimatch@10.2.6` | `BlueOak-1.0.0` | [LICENSE.md](CI_PACKAGE_LICENSE_TEXTS/7dfd90b95b048a79/0/LICENSE.md) |
| `minimatch@3.1.5` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/d5fc2c7bc58328d6/0/LICENSE) |
| `picocolors@1.1.1` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/7c5f372425355293/0/LICENSE) |
| `saxes@6.0.0` | `ISC` | **sem arquivo local**; ver fonte versionada abaixo |
| `semver@6.3.1` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/8b8f657069cf84b7/0/LICENSE) |
| `semver@7.8.5` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/82a86616e50ded79/0/LICENSE) |
| `siginfo@2.0.0` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/9681d29ff1b83571/0/LICENSE) |
| `tslib@2.8.1` | `0BSD` | [LICENSE.txt](CI_PACKAGE_LICENSE_TEXTS/b15471035cb0e3fd/0/LICENSE.txt) |
| `which@2.0.2` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/5a71f2b741944bf1/0/LICENSE) |
| `yallist@3.1.1` | `ISC` | [LICENSE](CI_PACKAGE_LICENSE_TEXTS/63b110ffd1871214/0/LICENSE) |

## Fontes primárias para as três lacunas de arquivo local

1. **libvips:** o binário `libvips-cpp.so.8.18.6` está nos dois serviços,
   SHA-256 `536cee19ab906cb5185ad519bf87647693f5d7b55e608c92eb28607f89ca5125`.
   O pacote Linux declara LGPL-3.0-or-later no
   [manifesto oficial v1.3.3](https://github.com/lovell/sharp-libvips/blob/v1.3.3/npm/linux-x64/package.json).
   A [lista oficial de bibliotecas incluídas na tag v1.3.3](https://github.com/lovell/sharp-libvips/blob/v1.3.3/THIRD-PARTY-NOTICES.md)
   está [copiada para revisão](PRIMARY_SOURCE_EVIDENCE/sharp-libvips-v1.3.3-THIRD-PARTY-NOTICES.md),
   SHA-256 `25ffcfa69e28b1913ced27ec778b90f24911a1bb3021253577e8b0af55db0d49`;
   Git blob `fcb7b9425c03ad926e4e23f20946351f4c8c2e5e`. O aviso lista
   componentes sob LGPL e outras licenças, mas **não contém todos os textos,
   fontes correspondentes, condições de relink e análise de eventual
   transferência do binário**. Continua a principal decisão jurídica.
2. **language-subtag-registry:** o pacote instalado exato `0.3.23` não traz
   LICENSE. O [package.json](PRIMARY_SOURCE_EVIDENCE/language-subtag-registry-0.3.23-package.json)
   declara CC0-1.0 e o [README](PRIMARY_SOURCE_EVIDENCE/language-subtag-registry-0.3.23-README.md)
   aponta para o [texto oficial CC0](https://creativecommons.org/publicdomain/zero/1.0/legalcode).
   O hash agregado do pacote local coincidiu com o implantado
   (`8ebe085f6d92c1d5ee6710352bbdb6f97d4c24555c3aae5784f4e8be16c316a3`).
   O repositório oficial não publica uma tag `v0.3.23` na listagem consultada;
   portanto não inferimos equivalência de uma tag anterior. Falta arquivar o
   texto CC0 adequado se o NOTICE final exigir sua cópia.
3. **saxes:** o pacote instalado `6.0.0` declara ISC, mas não traz LICENSE.
   O [LICENSE oficial da tag v6.0.0](https://github.com/lddubeau/saxes/blob/v6.0.0/LICENSE),
   com avisos também do projeto do qual foi derivado, está
   [copiado para revisão](PRIMARY_SOURCE_EVIDENCE/saxes-v6.0.0-LICENSE),
   SHA-256 `0fac2374380621b22e6b50451057721a9c52935b02d16d106a9f04897f061d0e`,
   Git blob `187f3ba399862022f4e670b2a3a1dbc6d7e6a800`. A cópia vem da
   fonte versionada upstream, não do pacote npm instalado.

## Decisão mínima ainda necessária

O proprietário e o responsável jurídico precisam registrar, por licença ou
grupo de versões exatas, se admitem esses componentes sob o ADR-015 e quais
avisos/atribuições/condições serão cumpridos no serviço hospedado e em
eventual distribuição. A decisão crítica é sobre **LGPL/libvips presente nas
duas imagens**; a presença de `CC-BY-4.0` também exige uma atribuição
adequada, e as cinco versões MPL exigem disposição. As demais expressões
fora da preferência (`ISC`, `0BSD`, `MIT-0`, `Python-2.0`, `CC0-1.0`,
`BlueOak-1.0.0`) carecem de registro de equivalência/aceite, ainda que
possam ser candidatas permissivas. Sem decisão, não tornar o scanner
`--enforce` verde por exceção genérica.

Depois da decisão, ainda faltam um NOTICE final completo (também para
componentes pertinentes entre os outros 424 pacotes instalados), textos e
fontes/condições aplicáveis às bibliotecas incorporadas, exceções exatas no
CI e nova inspeção do mesmo artefato promovido. Este pacote **não** representa
PASS da HSP-4 nem autorização de PILOT-1.
