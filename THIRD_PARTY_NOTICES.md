# Third-Party / Pattern Provenance

**Status: incomplete notice inventory.** This file records the material license
finding for the hosted HSP-4 candidate. It is not a full notice bundle, license
approval, or evidence of the exact deployed container contents.

## Runtime dependencies

`package.json` and `pnpm-lock.yaml` define the dependency graph. CI publishes a
Linux/x64 SPDX inventory and a machine-readable ADR-015 declaration precheck
using `scripts/generate-sbom.mjs` and `scripts/audit-sbom-licenses.mjs`. The
inventory includes packages installed for building and testing. It cannot by
itself establish which files are present in the deployed web and worker images.
The HSP-4 license-gate candidate configures CI to archive `hsp4-license-files.json`
with per-package file digests for declarations outside the ADR-015 preferred
list, plus copies of the installed LICENSE/NOTICE files in
`hsp4-license-texts/`. It separates production dependency reachability from
packages installed for development/build. This makes the review reproducible
for the CI install;
it is not a complete distribution notice or proof that the same bytes were
deployed. CI reports the HSP-4 license gate as **BLOCKED**, even if its
declaration precheck completes; its remote execution has not yet been credited.

The Linux/x64 inventory includes `sharp@0.35.4` and
`@img/sharp-libvips-linux-x64@1.3.3`. The latter declares
`LGPL-3.0-or-later`, regardless of the Apache-2.0 declaration on `sharp`.
The [upstream notice for the exact libvips package version](https://github.com/lovell/sharp-libvips/blob/v1.3.3/THIRD-PARTY-NOTICES.md)
lists embedded libraries under several licenses, including LGPLv3 libraries
such as fribidi, glib, libexif, libheif, librsvg, libvips, pango and
proxy-libintl. The [upstream package declaration](https://github.com/lovell/sharp-libvips/blob/v1.3.3/npm/linux-x64/package.json)
confirms the package license. The linked upstream files identify the source;
they are **not a substitute for copies of license texts, source availability,
or any notice/relink obligations that apply to distribution**.

Before declaring this notice inventory complete, identify the actual deployed
files, collect the exact license and notice texts for each incorporated
component, preserve sources at immutable versions where required, and record
the owner/legal decision for licenses outside ADR-015's preferred list. The
declaration precheck intentionally reports these packages as requiring review;
it does not mark HSP-4's license gate as passed.

The current reviewed baseline has 30 outside-preference declarations, including
`@img/sharp-libvips-linux-x64@1.3.3` (LGPL-3.0-or-later), five MPL-2.0
declarations, and 18 ISC declarations. Nine are reachable from the local
production dependency tree; this is not proof of deployment or legal
admissibility. Exact names, versions, file hashes and
the declarations for the other six appear in the CI artifacts and the
[HSP-4 engineering candidate record](docs/audit-2026-09-24/HSP4_LICENSE_ENGINEERING_CANDIDATE.md).

## Selective OSS research used in Wave 5
No source code from the repositories below is vendored into the Genesis production runtime in this Wave.

- DeskcommCRM — reviewed for multi-tenant invariant and durable event-worker patterns.
- trycompai/crm — reviewed for evidence-ledger and no-database-agent boundary.
- Anthropic-Cybersecurity-Skills (community, mukul975) — reviewed for cybersecurity skill taxonomy; Genesis checklists are original.
- Pydantic AI — `pydantic-ai-slim==2.33.0` appears only in the isolated `/intelligence` spike and is not part of the Next.js production dependency graph.

Before any future code vendoring, record exact upstream commit/tag, license, NOTICE requirements, modified files and SBOM.
