# Genesis 360 Empresarial — V1.2.1 RC1

**Candidato de saneamento da baseline V1.2. Não é uma liberação de produção.**

Código público por decisão do proprietário. Dossiês restritos, dados reais, chaves e caches foram excluídos desta distribuição.
A publicação não concede automaticamente uma licença de software: a decisão de licenciamento permanece pendente.

Leia [START_HERE_V1_2_1.md](START_HERE_V1_2_1.md), [PROJECT-STATE.md](PROJECT-STATE.md) e [HANDOFF.md](HANDOFF.md).

## Produto
Passaporte → Diagnóstico → Índice de Crescimento + Confiabilidade → Prioridades → Decisão → Missão → Evidências → Resultado → Linha do Tempo.

Planos aprovados: **Free R$ 0; Start R$ 99/mês; Pro R$ 297/mês**.
O catálogo não ativa cobrança, atendimento humano, cotas ilimitadas de IA nem elegibilidade automática de prestadores.
Condições contratuais anteriores foram preservadas, não substituídas por uma regra nova.

## O que muda neste candidato
Maturidade ausente não vira zero; cobertura e confiança permanecem separadas.
Um avaliador serve coleta e submissão. Resultados novos têm snapshot e versões de regras.
A gravação pública aceita declarações, não autoverificação. Referências não compram confiança.
APIs mutáveis validam origem, papel e JSON limitado. O banco recebe migrações de revisão otimista e fechamento imutável.
Há testes de domínio executados e testes SQL preparados; ver o relatório de evidências.

## Bloqueio de dependências
O lock antigo está **somente em `docs/history/`**. Não reutilizá-lo.
Next.js foi atualizado no manifesto para 16.3.3 após a publicação oficial de segurança de agosto de 2026.
Este ambiente de elaboração não tinha acesso ao registro para resolver um lock novo.
O workflow `Resolve candidate lockfile (manual, no deployment)` gera um artefato para revisão, sem escrever no repositório nem implantar.
O CI normal bloqueia intencionalmente até que o novo `pnpm-lock.yaml` seja revisado e versionado.

## Arquitetura preservada
Monólito modular Next.js / React / TypeScript / Supabase PostgreSQL. Sem reescrita e sem nova plataforma de agentes.
Documentos de V1.2 são históricos quando divergirem de `PROJECT-STATE.md`, do adendo canônico e das decisões de V1.2.1.
