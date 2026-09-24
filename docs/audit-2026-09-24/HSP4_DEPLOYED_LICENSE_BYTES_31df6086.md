# HSP-4 — composição OSS observada nos contêineres hospedados

**Data:** 2026-09-24 UTC. **Gate de licença: BLOCKED.** Esta inspeção fecha a
lacuna técnica de verificar, nos serviços em execução, a presença e os hashes
dos **30 pacotes** que o CI marcou fora da preferência do ADR-015. Ela não
conclui licença, não comprova todos os arquivos das imagens e não substitui
NOTICE, fontes/condições aplicáveis ou decisão do proprietário/jurídico.

## Artefatos e método

| Serviço | Deployment Railway `SUCCESS` | SHA Git | Digest da imagem |
| --- | --- | --- | --- |
| web | `09f91585-1ec8-47d9-9b2c-5c40950527f0` | `31df6086cb612886dc5db4a45b946ea80dde2cf1` | `sha256:aa19846feaebe602107ea22a1598c58f8ada38764bb7ab27bdace53455ba1356` |
| worker | `86828bcf-dd39-44a7-a94d-ef5819da766f` | `31df6086cb612886dc5db4a45b946ea80dde2cf1` | `sha256:f7ab720e64711ad7346780f77858bffc1eba2ba6d4340aeee73d9f8796799064` |

Os IDs, SHAs e digests vieram de `railway deployment list`. Uma chave SSH
temporária, única e sem senha foi cadastrada somente durante a inspeção. Em
cada serviço, uma expressão Node executada por SSH **somente leu**
`/app/node_modules/.pnpm` e usou as funções do código implantado
`collectInstalledPackages`, `classifyDeclaredLicense` e
`buildInstalledLicenseEvidence` para imprimir um JSON. Não foram lidas
variáveis de ambiente, arquivos de clientes ou credenciais; não houve escrita
no contêiner. A chave foi descadastrada e a listagem posterior confirmou
**zero chaves SSH registradas** no Railway; os arquivos locais temporários
foram removidos.

Os JSONs capturados são [web](HSP4_DEPLOYED_LICENSE_WEB_31df6086.json)
(SHA-256 `aff3d56d217ab4fad55a3a2d37da8e867c029896be3c5da54bd1d5b4fbed0ca5`)
e [worker](HSP4_DEPLOYED_LICENSE_WORKER_31df6086.json)
(SHA-256 `0d0694b8793841df25b124b80bf5dad8e3374f28955d7cd21561662b649f414f`).
Cada registro contém caminho relativo do pacote, contagem de arquivos, bytes,
hash agregado de conteúdo, arquivos LICENSE/NOTICE e binários nativos com
SHA-256. Os JSONs não contêm segredo nem dado de cliente.

## Resultado observado

| Checagem | web | worker |
| --- | ---: | ---: |
| Dependências Linux/x64 instaladas em `.pnpm` | 454 | 454 |
| Pacotes fora da preferência do ADR-015 presentes fisicamente | 30/30 | 30/30 |
| Pacotes marcados sem diretório instalado | 0 | 0 |
| Arquivos LICENSE/NOTICE encontrados nesses pacotes | 28 | 28 |
| Pacotes sem LICENSE/NOTICE local | 3 | 3 |
| Arquivos nativos nesses pacotes | 3 | 3 |

Os 30 pacotes têm a mesma identidade, licença declarada e **hash agregado de
conteúdo** em web e worker. O inventário do [CI do mesmo SHA, run
36009447882](https://github.com/Aurum-Soltec/genesis360empresarial/actions/runs/36009447882)
também registra os 30 pacotes; a comparação encontrou **zero diferenças de
hash agregado**. Portanto, os 21 pacotes classificados como fora da árvore
`pnpm --prod` **não podem ser descartados como ausentes do artefato**: a imagem
Railpack atual conserva a árvore instalada de build.

O pacote `@img/sharp-libvips-linux-x64@1.3.3` declara
`LGPL-3.0-or-later` e aparece em **ambos** os contêineres. Em cada um, o
binário `lib/libvips-cpp.so.8.18.6` tem 18.621.496 bytes e SHA-256
`536cee19ab906cb5185ad519bf87647693f5d7b55e608c92eb28607f89ca5125`.
Os três pacotes sem arquivo LICENSE/NOTICE local são
`@img/sharp-libvips-linux-x64@1.3.3`,
`language-subtag-registry@0.3.23` e `saxes@6.0.0`; a ausência de arquivo
local **não** determina ausência de licença, mas exige completar o aviso a
partir das fontes oficiais e das condições aplicáveis. Há também
`caniuse-lite@1.0.30001810` com declaração `CC-BY-4.0` e cinco pacotes
`MPL-2.0` presentes nos dois serviços.

## Limites e próximas ações

Esta comparação é um inventário **dos 30 pacotes em revisão**, não um hash de
todos os arquivos da imagem, nem uma atestação criptográfica emitida pelo
Railway. O vínculo com a imagem usa os deployment IDs/digests do provedor e
inspeção read-only dos serviços ativos. Mudança de imagem invalida a prova.

Para passar o gate de licenças, ainda é necessário: (1) completar o NOTICE e
os textos/fontes e condições pertinentes de todos os componentes efetivos,
incluindo bibliotecas incorporadas em libvips; (2) registrar a decisão do
proprietário/jurídico sobre LGPL, CC-BY, MPL e demais licenças fora da
preferência do ADR-015 no cenário hospedado e em eventual distribuição; (3)
ligar as exceções exatas aprovadas a um bloqueio efetivo no CI; (4) repetir a
inspeção e o CI sobre o mesmo artefato promovido após qualquer alteração. Até
isso ocorrer, **HSP-4 permanece NO-GO**.
