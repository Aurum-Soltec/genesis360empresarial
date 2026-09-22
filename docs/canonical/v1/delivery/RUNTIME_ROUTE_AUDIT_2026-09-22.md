# Genesis 360 — Runtime route and link audit

Date: 2026-09-22  
Environment: hosted staging  
Original audited artifact: `8812ccc5fc6b2143e494a3baad68ca80615072bc`

Presentation Complete revalidation: `cfdf876e5539f02e6b40d2b491adc80973fbb775`

## Scope

The audit used an authenticated synthetic user and the normal tenant-selection
flow. It rendered three public routes, twenty authenticated routes, every
internal link discovered in those pages and six critical routes at a 320 px
viewport. It observed document status, final URL, fatal error text, empty bodies,
uncaught page exceptions, console errors, same-origin HTTP responses and
horizontal overflow.

## Finding and correction

The first run found one failure: `/entrar` requested `/favicon.ico` and received
404. No page or business endpoint failed. PR `#16` added an icon derived from the
approved Genesis 360 brand asset, passed every required CI gate and was deployed
as the artifact identified above.

## Final result

| Check | Result |
|---|---:|
| Public routes rendered | 3/3 PASS |
| Authenticated routes rendered | 20/20 PASS |
| Internal link targets | 17/17 PASS |
| Critical mobile routes at 320 px | 6/6 PASS |
| Document status >= 400 | 0 |
| Same-origin response >= 400 | 0 |
| Broken internal links | 0 |
| Uncaught page exceptions | 0 |
| Console errors | 0 |
| Fatal or empty UI | 0 |
| Horizontal overflow | 0 |

Machine-readable evidence:
`docs/audit-2026-09-18/runtime-route-audit/2026-09-22-staging-route-audit.json`.

## Presentation Complete revalidation

After PRs `#18` and `#19`, the same authenticated audit was expanded to include
`/demonstracao/solucoes` and `/demonstracao/administracao` in desktop and 320 px
mobile coverage. It ran against Railway deployment
`90b1fe43-9ba7-436f-8b0d-1f5a17f9a846` and the functional commit above.

| Check | Result |
|---|---:|
| Public routes rendered | 3/3 PASS |
| Authenticated routes rendered | 22/22 PASS |
| Internal link targets | 20/20 PASS |
| Critical mobile routes at 320 px | 8/8 PASS |
| Document or same-origin response >= 400 | 0 |
| Broken internal links | 0 |
| Uncaught page exceptions or console errors | 0 |
| Fatal or empty UI | 0 |
| Horizontal overflow | 0 |

Current machine-readable evidence:
`docs/audit-2026-09-18/runtime-route-audit/2026-09-22-presentation-complete-route-audit.json`.
SHA-256: `E0C8854F33B22A568DEFA4AEAFE2C41288FA0E54343DD3FE856A2C123E89AD14`.
No correction or redeploy was required.

## Boundaries

This PASS proves route availability, link integrity, basic browser execution and
the sampled mobile layout for the deployed staging artifact. It does not replace
penetration testing, visual review of every responsive breakpoint, destructive
workflow testing, real-document ingestion, load testing or the unresolved HSP-4
gates. The decision for pilot and open production remains unchanged.
