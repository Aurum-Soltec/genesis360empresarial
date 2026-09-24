# HSP-4 — composição OSS do artefato hospedado `25c022d8`

**2026-09-24 UTC. Gate de licença: BLOCKED.** A inspeção read-only foi
repetida após a promoção e vincula os pacotes em revisão ao SHA efetivamente
implantado. Ela comprova composição e hashes dos 30 pacotes sob revisão do
ADR-015; não é aprovação jurídica, NOTICE final, SBOM integral das imagens ou
atestado criptográfico do provedor.

| Serviço | Deployment `SUCCESS` | SHA Git | Digest da imagem |
| --- | --- | --- | --- |
| web | `de1b6691-f49f-4ddb-991e-20c5a339e0ae` | `25c022d8f36e46b07d41783555bba8e00ba81590` | `sha256:1dc3640555013f31a928c4242d349e95241e3dbc60d6675d7de9070c141280e8` |
| worker | `fcf07783-68c7-400d-8ad9-4847eedeadd1` | `25c022d8f36e46b07d41783555bba8e00ba81590` | `sha256:c40274a5e1c69036c1c5ec4dd341c7eea37bce9cd1fbedfa92da9ab09de75dda` |

Os IDs, SHAs e digests foram lidos do Railway. Nos dois serviços, uma sessão
SSH temporária executou apenas funções de inventário presentes em `/app`:
`collectInstalledPackages` e `buildInstalledLicenseEvidence`. Foram lidos os
pacotes em `/app/node_modules/.pnpm`, sem consultar variáveis de ambiente,
credenciais, banco ou arquivos de empresas e sem escrever no contêiner. A chave
SSH temporária foi descadastrada; a lista posterior do Railway mostrou **zero
chaves registradas**. Os arquivos de chave locais também foram removidos.

Os inventários sanitizados são [web](HSP4_DEPLOYED_LICENSE_WEB_25c022d8.json)
(SHA-256 `59493824e7b7175900f2ee70b484a6bf7e729ef568447a03765604cc28710ebe`)
e [worker](HSP4_DEPLOYED_LICENSE_WORKER_25c022d8.json)
(SHA-256 `c25e1a6652d29b38f40d7a8f25cdf932c12a3142472dc233e8b96a8f67181e6a`).
Cada um registra caminho relativo, quantidade/bytes de arquivos, hash agregado
de conteúdo, hashes de LICENSE/NOTICE e de binários nativos. O conjunto de
nomes/versões sob revisão veio da [inspeção anterior](HSP4_DEPLOYED_LICENSE_BYTES_31df6086.md),
mas o conteúdo de cada pacote foi relido no novo deployment. Após comparar os
resultados com o CI do mesmo SHA, os campos `sbomSha256` e `ciEvaluatedSha`
dos JSONs foram preenchidos com os valores do CI; `reviewSetSource` preserva
explicitamente a origem do conjunto inicial de nomes/versões.

## Comparação com o CI do mesmo SHA

O [run CI `36022495012`](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36022495012)
passou e publicou o artefato `hsp4-runtime-linux-x64-sbom`, cujo
`hsp4-license-files.json` contém `ciEvaluatedSha=25c022d8f36e46b07d41783555bba8e00ba81590`
e SHA-256 `1166dafc1cd8b9e792df4138125b6cf77c5981cd9c0410418c831c9d8988f591`.
Também passaram [CodeQL e Analyze no mesmo SHA](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36022494605).

| Checagem | web | worker | Resultado |
| --- | ---: | ---: | --- |
| Dependências Linux/x64 instaladas em `.pnpm` | 454 | 454 | Observado nos serviços |
| Pacotes ADR-015 em revisão presentes | 30/30 | 30/30 | Nenhum ausente |
| Hash agregado, bytes e quantidade de arquivos contra CI | 30/30 | 30/30 | Zero divergências |
| Hashes individuais LICENSE/NOTICE contra CI | 28/28 | 28/28 | Zero divergências |
| Hashes de binários nativos contra CI | 3/3 | 3/3 | Zero divergências |

Os 30 hashes agregados também coincidiram com os inventários do deployment
anterior `31df6086`. As 28 cópias de textos no [pacote de revisão anterior](HSP4_OSS_NOTICE_REVIEW_31df6086/NOTICE_INDEX.md)
foram comparadas byte a byte por SHA-256 com os 28 textos do CI deste SHA:
**zero divergências**. Isso mantém o pacote anterior tecnicamente aplicável a
esses 30 pacotes, sujeito à revisão final de licenças e avisos. Os 21 pacotes
fora da árvore `pnpm --prod` continuam **fisicamente presentes** nas imagens
Railpack e não podem ser excluídos da avaliação por esse critério.

`@img/sharp-libvips-linux-x64@1.3.3` permanece presente em web e worker com
declaração `LGPL-3.0-or-later`. O binário
`lib/libvips-cpp.so.8.18.6` mede 18.621.496 bytes e tem SHA-256
`536cee19ab906cb5185ad519bf87647693f5d7b55e608c92eb28607f89ca5125`.
Há 28 arquivos LICENSE/NOTICE locais para 27 pacotes. Os três pacotes sem
arquivo local continuam `@img/sharp-libvips-linux-x64@1.3.3`,
`language-subtag-registry@0.3.23` e `saxes@6.0.0`; fontes versionadas para
revisão estão no pacote anterior. `caniuse-lite` declara `CC-BY-4.0` e cinco
pacotes/versões declaram `MPL-2.0`.

## Gate ainda aberto

A evidência acima elimina apenas a dúvida sobre presença e identidade dos
**30 pacotes revisados neste deployment**. Para PASS ainda faltam NOTICE e
atribuições completos para os componentes efetivos, incluindo bibliotecas
incorporadas em libvips; decisão documentada do proprietário e responsável
jurídico sobre LGPL, CC-BY, MPL e demais licenças fora da preferência do
ADR-015; e exceções exatas aprovadas aplicadas ao bloqueio do CI. Qualquer
mudança no artefato exige nova inspeção. Até lá, **licenças permanecem BLOCKED
e HSP-4 permanece NO-GO**.
