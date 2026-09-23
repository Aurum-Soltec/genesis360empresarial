# HSP-4 — inventário técnico de licenças do CI no SHA promovido

**Conclusão:** inventário rastreável produzido; **aceite de licenças BLOCKED**. O SBOM Linux do CI contém uma dependência `LGPL-3.0-or-later` que o inventário local anterior não encontrou. Esta é uma revisão técnica, não um parecer jurídico nem prova de composição byte a byte do contêiner Railway.

## Proveniência e conferência

- Commit do candidato no staging: `5e6e836ad828b075ca91e5fc7d9075e4f6a73918`.
- [Run CI 35921541746](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/35921541746), `conclusion=success`, `headSha` igual ao candidato.
- Artefato `hsp4-runtime-linux-x64-sbom`, ID `10776903763`, criado em `2026-09-23T21:18:55Z`, expiração prevista `2026-10-23T21:18:53Z`, digest do arquivo ZIP do GitHub `sha256:cf43947812d1a44111a1e90e6c4170ecb7c373f8b55fdc5155a48c36f5d59eab`.
- Arquivo JSON extraído em `tmp/hsp4-ci-sbom/hsp4-runtime-linux-x64.sbom.spdx.json`, 312.138 bytes, SHA-256 `B9EED14AE2D5A17DA23C6D96D5592CE6A50C7F12242E4C9AC8A2E672D7F9FD31`. Um segundo download independente do mesmo run produziu arquivo com o mesmo hash.
- Gerador: `scripts/generate-sbom.mjs`, executado em Ubuntu 24.04 após `pnpm install --frozen-lockfile`, com filtro `--platform=linux --arch=x64`.

## Resultado do inventário

O documento SPDX contém **455 entradas: 1 pacote raiz privado + 454 dependências**, distribuídas em 13 expressões de licença declarada para dependências:

| Declaração | Pacotes |
|---|---:|
| MIT | 386 |
| Apache-2.0 | 26 |
| ISC | 18 |
| BSD-2-Clause | 9 |
| MPL-2.0 | 5 |
| BSD-3-Clause | 3 |
| 0BSD, BlueOak-1.0.0, CC-BY-4.0, CC0-1.0, LGPL-3.0-or-later, MIT-0, Python-2.0 | 1 cada |

Os 424 pacotes MIT/Apache/BSD entram nas quatro famílias preferenciais do [ADR-015](../canonical/v1/product/ADR-015_OSS_LICENSE_POLICY.md); preferência **não** equivale a aceite técnico ou jurídico. Os outros 30 precisam de disposição documentada, com foco em obrigações de NOTICE/atribuição e no binário LGPL. Não há pacote de terceiro com `licenseDeclared=NOASSERTION` no JSON; `licenseConcluded` permanece `NOASSERTION` em **todas** as entradas, pois o gerador apenas lê `package.json` e não conclui a licença nem verifica arquivos embutidos.

### Cadeia com LGPL no Linux

1. `package.json`: Next.js `16.3.3` é dependência de produção.
2. `pnpm-lock.yaml`: `next@16.3.3` referencia `sharp@0.35.4` como dependência opcional; `sharp` referencia `@img/sharp-libvips-linux-x64@1.3.3` como opcional para Linux/glibc/x64.
3. SBOM do CI: `next@16.3.3` declara MIT; `sharp@0.35.4` e `@img/sharp-linux-x64@0.35.4` declaram Apache-2.0; **`@img/sharp-libvips-linux-x64@1.3.3` declara LGPL-3.0-or-later**.
4. `components/brand-mark.tsx` usa `next/image` para o logotipo. A documentação instalada de Next.js 16.3.3 (`node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md`) afirma que `sharp` é requerido para otimização de imagens self-hosted, e o [guia do Sharp](https://sharp.pixelplumbing.com/install/) descreve os binários pré-compilados de `sharp` e `libvips`.
5. O [repositório oficial de sharp-libvips, tag v1.3.3](https://github.com/lovell/sharp-libvips/blob/v1.3.3/THIRD-PARTY-NOTICES.md), lista bibliotecas embutidas e respectivas licenças; `fribidi`, `glib`, `libexif`, `libheif`, `librsvg`, `libvips`, `pango` e `proxy-libintl` aparecem como LGPLv3. O README do projeto distingue a licença Apache-2.0 dos **scripts de empacotamento** das licenças das bibliotecas distribuídas: https://github.com/lovell/sharp-libvips/blob/v1.3.3/README.md.
6. O [`package.json` oficial da variante Linux x64 na tag v1.3.3](https://github.com/lovell/sharp-libvips/blob/v1.3.3/npm/linux-x64/package.json) confirma `license: LGPL-3.0-or-later` e descreve o pacote como bibliotecas `libvips` pré-compiladas para Linux glibc x64.

Portanto, a frase da rechecagem local de 23/09 que dizia “nenhum pacote Linux declarou GPL/LGPL/AGPL” é **contrariada pelo artefato CI Linux do mesmo SHA**. O CI ter passado demonstra que hoje não há bloqueio automático para essa licença; não demonstra aceite do ADR.

Outras expressões fora das quatro preferenciais: `MPL-2.0` (`axe-core`, duas versões de `lightningcss` e dois binários Linux), `CC-BY-4.0` (`caniuse-lite`), `BlueOak-1.0.0` (`minimatch`), `Python-2.0` (`argparse`), `MIT-0` (`@csstools/color-helpers`), `CC0-1.0` (`language-subtag-registry`), `0BSD` (`tslib`) e 18 pacotes `ISC`. O inventário não prova quais desses entram no bundle implantado, pois inclui dependências de desenvolvimento/build instaladas pelo CI.

## Limites e decisão necessária

- `scripts/generate-sbom.mjs` varre `node_modules/.pnpm` **instalado**, não os arquivos finais do web/worker implantados. Seu nome `runtime` descreve o alvo de plataforma, não uma inspeção do contêiner de produção. `downloadLocation` e `copyrightText` são `NOASSERTION`; notices não estão anexados ao SPDX.
- O Next serve imagem otimizada sob demanda; a cadeia no lock e o uso de `next/image` justificam investigar `libvips` como componente material. Não foi obtido manifesto/inspeção de arquivos do contêiner Railway, nem feito julgamento sobre distribuição versus uso apenas como serviço.
- Rechecagem read-only às `2026-09-23T22:44:19Z`: `GET https://web-production-76d1b.up.railway.app/_next/image?url=%2Fbrand%2Fgenesis-360-empresarial.png&w=256&q=75` respondeu `200`, `Content-Type: image/png`, `x-nextjs-cache: MISS` e `Content-Length: 6495`. Isso demonstra que o endpoint de otimização de imagem do staging funciona, mas **não identifica qual biblioteca binária gerou a imagem** nem prova o conteúdo do artefato implantado.
- Tentativa read-only de listar apenas os nomes de arquivos em `/app` do serviço web implantado por `railway service files ... list /app --json` retornou `No SSH keys found`. Não foram criadas chaves, nem acessados dados de clientes. Assim, a verificação byte a byte do bundle Railway continua pendente de um meio de inspeção autorizado ou de manifesto do artefato final produzido no build.
- **Responsável técnico**: mapear o conteúdo real do artefato Railway e preparar NOTICE/atribuições para as versões efetivamente incorporadas; manter o SBOM e o bloqueio de licença sincronizados com o lock/deploy.
- **Jurídico/proprietário**: decidir e registrar a admissibilidade de LGPL-3.0-or-later, MPL-2.0 e demais licenças fora da allowlist, incluindo condições de uso/distribuição e notices; se não aceitas, aprovar alternativa técnica antes da nova promoção. O ADR-015 requer essa revisão; este inventário não a substitui.
- Uma alternativa técnica a avaliar, **sem aplicar agora**, é deixar de otimizar o logotipo via `next/image` e verificar se o bundle final consegue excluir `sharp/libvips`. Isso exige medição do impacto de imagem/desempenho e novo SBOM do artefato real. Desabilitar otimização por si só não prova que o binário saiu da implantação.

**Gate HSP-4 de licença: BLOCKED por disposição técnica/jurídica e comprovação do bundle.** Nenhuma licença foi aprovada automaticamente neste registro.

## Rechecagem do candidato `fe0e5b4` — 2026-09-23

O CI do commit `fe0e5b4583d98bf9985bf247c5976a367fc3b3e9` passou quality,
database e CodeQL no PR #25. O run de CI `35929894916` publicou o artefato
`hsp4-runtime-linux-x64-sbom` (ID `10781265125`, digest do ZIP
`sha256:5f395f9febe7287dd6a35102a3455776ddcd8e613046bd7b5bad10b2de774106`).
O JSON extraído, mantido fora do commit em `tmp/hsp4-ci-sbom-fe0e5b4/`, tem
SHA-256 `82E035F9C99FA644F058458CA8EA387AC61320C8C8902910C19696ACC82A4230`,
455 entradas e exatamente uma declaração LGPL:
`@img/sharp-libvips-linux-x64@1.3.3`, `LGPL-3.0-or-later`. Não há
`licenseDeclared=NOASSERTION`. O inventário do SHA final confirma o achado
anterior; ainda não prova os bytes do contêiner nem aprova o uso jurídico.
