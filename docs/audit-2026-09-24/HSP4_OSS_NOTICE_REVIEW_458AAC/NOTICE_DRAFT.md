# GÊNESIS 360 — inventário para o futuro aviso de terceiros (`458aac`)

**RASCUNHO TÉCNICO — NÃO É O NOTICE FINAL, NÃO É PARECER JURÍDICO E NÃO LIBERA HSP-4.**

O [CI público do SHA exato `458aac964d1f9a7016ac1804fe99d68637a3c0b8`](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36057161088) instalou 454 dependências Linux/x64: 424 com declarações preferidas pelo ADR-015 e 30 que requerem revisão. O [SPDX](CI_EVIDENCE/hsp4-runtime-linux-x64.sbom.spdx.json) e o [inventário completo de declarações](CI_EVIDENCE/hsp4-license-declarations.json) nomeiam e versionam as 454. **Todas as 454 licenças concluídas continuam `NOASSERTION` no scan.** Declaração, arquivo LICENSE e cumprimento das condições são verificações distintas.

Os 30 itens abaixo têm hashes de conteúdo no [inventário instalado no CI](CI_EVIDENCE/hsp4-license-files.json). Foram arquivadas **28 cópias exatas** de LICENSE/NOTICE referentes a 27 desses pacotes; os hashes SHA-256 de cada cópia são conferidos por `node scripts/verify-hsp4-oss-evidence.mjs`. Outros três pacotes não trazem arquivo LICENSE/NOTICE local. Os hashes de conteúdo desses 30 itens coincidiam com a inspeção anterior dos contêineres `31df6086`, mas **não houve inspeção dos bytes das imagens novas de `458aac`**. Este aviso descreve o CI de `458aac`, não atesta a composição final do novo deployment.

| Pacote e versão observados no CI | Licença declarada | Texto instalado arquivado |
| --- | --- | --- |
| `@csstools/color-helpers@5.1.0` | MIT-0 | [LICENSE.md](CI_EVIDENCE/hsp4-license-texts/d0f3d36ba92c7ed3/0/LICENSE.md) |
| `@img/sharp-libvips-linux-x64@1.3.3` | LGPL-3.0-or-later | Ausente no pacote; [aviso oficial de terceiros da tag](../HSP4_OSS_NOTICE_REVIEW_31df6086/PRIMARY_SOURCE_EVIDENCE/sharp-libvips-v1.3.3-THIRD-PARTY-NOTICES.md) para análise |
| `argparse@2.0.1` | Python-2.0 | [LICENSE](CI_EVIDENCE/hsp4-license-texts/eb6fb2df860c4a7d/0/LICENSE) |
| `axe-core@4.13.0` | MPL-2.0 | [LICENSE](CI_EVIDENCE/hsp4-license-texts/a700db80d2c84f37/0/LICENSE), [licenças de terceiros](CI_EVIDENCE/hsp4-license-texts/a700db80d2c84f37/0/LICENSE-3RD-PARTY.txt) |
| `caniuse-lite@1.0.30001810` | CC-BY-4.0 | [LICENSE](CI_EVIDENCE/hsp4-license-texts/2279b0f6b9ead609/0/LICENSE) |
| `electron-to-chromium@1.5.433` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/bd1ceff8bdc16df4/0/LICENSE) |
| `eslint-import-resolver-typescript@3.10.1` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/37169469c59c613e/0/LICENSE) |
| `fastq@1.20.3` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/a7ea9f9d907eca5d/0/LICENSE) |
| `flatted@3.4.4` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/57b7d7dc886d3409/0/LICENSE) |
| `glob-parent@5.1.2` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/0a11153a0f1311d8/0/LICENSE) |
| `glob-parent@6.0.2` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/7b90c3653564b1f1/0/LICENSE) |
| `graceful-fs@4.2.11` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/c0b8c47fbef7d288/0/LICENSE) |
| `isexe@2.0.0` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/2f62e711a6921973/0/LICENSE) |
| `language-subtag-registry@0.3.23` | CC0-1.0 | Ausente no pacote; [README da versão instalada](../HSP4_OSS_NOTICE_REVIEW_31df6086/PRIMARY_SOURCE_EVIDENCE/language-subtag-registry-0.3.23-README.md) para análise |
| `lightningcss-linux-x64-gnu@1.32.0` | MPL-2.0 | [LICENSE](CI_EVIDENCE/hsp4-license-texts/47091868ef84fe73/0/LICENSE) |
| `lightningcss-linux-x64-gnu@1.33.0` | MPL-2.0 | [LICENSE](CI_EVIDENCE/hsp4-license-texts/abda693e40894495/0/LICENSE) |
| `lightningcss@1.32.0` | MPL-2.0 | [LICENSE](CI_EVIDENCE/hsp4-license-texts/4c9ee74a100a8d29/0/LICENSE) |
| `lightningcss@1.33.0` | MPL-2.0 | [LICENSE](CI_EVIDENCE/hsp4-license-texts/7129b0f4411357cf/0/LICENSE) |
| `lru-cache@10.4.3` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/3a13bfe2b7911bee/0/LICENSE) |
| `lru-cache@5.1.1` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/fe7f0a2f2cf4c92f/0/LICENSE) |
| `minimatch@10.2.6` | BlueOak-1.0.0 | [LICENSE.md](CI_EVIDENCE/hsp4-license-texts/7dfd90b95b048a79/0/LICENSE.md) |
| `minimatch@3.1.5` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/d5fc2c7bc58328d6/0/LICENSE) |
| `picocolors@1.1.1` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/7c5f372425355293/0/LICENSE) |
| `saxes@6.0.0` | ISC | Ausente no pacote; [LICENSE oficial da tag](../HSP4_OSS_NOTICE_REVIEW_31df6086/PRIMARY_SOURCE_EVIDENCE/saxes-v6.0.0-LICENSE) para análise |
| `semver@6.3.1` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/8b8f657069cf84b7/0/LICENSE) |
| `semver@7.8.5` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/82a86616e50ded79/0/LICENSE) |
| `siginfo@2.0.0` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/9681d29ff1b83571/0/LICENSE) |
| `tslib@2.8.1` | 0BSD | [LICENSE.txt](CI_EVIDENCE/hsp4-license-texts/b15471035cb0e3fd/0/LICENSE.txt) |
| `which@2.0.2` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/5a71f2b741944bf1/0/LICENSE) |
| `yallist@3.1.1` | ISC | [LICENSE](CI_EVIDENCE/hsp4-license-texts/63b110ffd1871214/0/LICENSE) |

**Ainda faltam para publicar um NOTICE:** revisão de avisos e textos pertinentes dos outros 424 pacotes; fontes e condições das bibliotecas incorporadas em `libvips`; texto e autoria apropriados para os três pacotes sem arquivo local; identificação técnica dos componentes realmente presentes nas imagens `458aac`; localização de exibição do aviso; e decisão formal das exceções do ADR-015. A [matriz de obrigações](OBLIGATIONS_MATRIX.md) registra cada decisão sem convertê-la em PASS por inferência.
