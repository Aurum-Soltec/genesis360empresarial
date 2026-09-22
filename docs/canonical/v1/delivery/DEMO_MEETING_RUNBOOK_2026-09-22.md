# Genesis 360 — Controlled meeting runbook

Date: 2026-09-22

Environment: `https://web-production-76d1b.up.railway.app`

Functional artifact: `cfdf876e5539f02e6b40d2b491adc80973fbb775`

## Objective

Present a truthful end-to-end story from fictional company information and
documentation to a traceable executive diagnosis, action plan and simulated
solution fit. Target duration: 12 to 15 minutes.

## Preflight — five minutes before the meeting

1. Open `/entrar`, authenticate with the dedicated demo account and select the
   demo tenant.
2. Open `/demonstracao` and require `7/7 etapas prontas`.
3. Confirm the boundary strip says fictional data, real upload off, Agentic off,
   network/contact off and provenance visible.
4. Keep the report and this cockpit in separate browser tabs if rapid recovery
   is needed during screen sharing.
5. Do not enter, paste or upload data from any real company.

## Demonstration sequence

| Time | Screen and action | Message to deliver | Executed evidence |
|---|---|---|---|
| 0:00–1:00 | Cockpit `/demonstracao` | Seven controlled stages connect information, evidence and decision. | `7/7` ready |
| 1:00–2:00 | **Ver empresa** | Business Passport identifies the company and preserves tenant context. | `/passaporte`, 1.504 s |
| 2:00–3:30 | **Enviar pacote** | Three canonical sources are fictional declarations; unverified is never shown as verified. | `/documentos`, 2.185 s |
| 3:30–5:00 | **Abrir diagnóstico** | Full uses an adaptive path over the governed question library rather than forcing 144 questions. | `/diagnostico-v1`, 1.424 s |
| 5:00–8:00 | **Abrir relatório** | Explain Growth Score 55, coverage 100%, confidence 78%, priorities, 30/60/90 plan and provenance. | `/resultado-v1`, 3.347 s |
| 8:00–10:00 | **Ver soluções** | Show capabilities tied to the three weakest valid dimensions and open “why this appears”. Providers are fictional. | `/demonstracao/solucoes`, 1.639 s |
| 10:00–12:00 | **Interagir** | Use the three Council questions and point to the source-table citations. The synthesis is deterministic and read-only. | `/conselho`, 1.791 s |
| 12:00–13:30 | **Abrir central** | Close with tenant-scoped readiness, three canonical sources and five sensitive flags disabled. | `/demonstracao/administracao`, 1.610 s |

## Council questions

Use the questions in this order:

1. **O que atacar nos próximos 90 dias?** — connects weak dimensions to the
   action sequence.
2. **O que falta para elevar a confiança?** — reinforces that declared evidence
   still requires verification.
3. **Como explicar este resultado aos líderes?** — provides the closing executive
   narrative with visible sources.

The rehearsal rendered three distinct responses. Each had at least two source
citations and no external tool call or autonomous write.

## Required disclosure

State before showing solutions:

> Este é um cenário controlado com dados e empresas fictícios. As soluções
> ilustram aderência temática; não são fornecedores realmente qualificados nem
> uma recomendação de contratação. Upload real, contato, rede, ecossistema e
> execução agentic permanecem desligados.

## Recovery during the meeting

- If a tab loses context, return to `/demonstracao`; do not create a new tenant.
- If the network is slow, allow up to five seconds. The maximum observed
  navigation in the final rehearsal was 3.347 seconds on the free staging tier.
- If the report is already open, use it rather than starting another diagnostic.
- If a question asks about live agents, real files or provider contact, show the
  corresponding disabled flag in Central Genesis and describe it as a future
  gated capability.
- Do not enable a flag, bypass login or use administrative credentials to recover
  a presentation step.

## Executed rehearsal evidence

The final rehearsal clicked all seven cockpit actions, exercised all three
Council interactions, opened all three solution rationales and verified the PDF
action. Result: **PASS**, with no failed step.

Receipt:
`docs/audit-2026-09-18/presentation-rehearsal/2026-09-22-final-rehearsal.json`

SHA-256:
`2A40BE88544ECBC5FBF537EAF1C2CE4C1EBF633229C713740FA1C57CECDE0FF1`

The receipt contains no password, cookie or token. The earlier harness run was
discarded because it measured before Next.js client navigation completed; only
the synchronized PASS run above receives evidence credit.
