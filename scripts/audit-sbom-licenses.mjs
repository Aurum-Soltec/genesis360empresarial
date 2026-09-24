import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// This is a declaration scan of the installed dependency closure. It does not
// inspect the deployed container, conclude licenses, or approve distribution.
const preferred = new Set(["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause"]);
const strongCopyleft = /(^|[^A-Za-z])(?:AGPL|GPL|SSPL|BSL|BUSL)(?:-|\b)/i;

export function classifyDeclaredLicense(value) {
  const license = typeof value === "string" ? value.trim() : "";
  if (!license || license === "NOASSERTION" || license === "UNLICENSED") {
    return { status: "blocked", reason: "missing_or_unlicensed_declaration" };
  }
  if (strongCopyleft.test(license)) {
    return { status: "blocked", reason: "strong_copyleft_or_source_available_requires_exception" };
  }
  if (preferred.has(license)) return { status: "preferred", reason: "adr_015_preferred_declaration" };
  if (/\bLGPL\b/i.test(license)) return { status: "review", reason: "weak_copyleft_requires_legal_review" };
  if (/\bMPL\b/i.test(license)) return { status: "review", reason: "file_level_copyleft_requires_review" };
  return { status: "review", reason: "outside_adr_015_preferred_list_or_composite_expression" };
}

export function auditSpdxDocument(spdx, sourceSha256, commitSha = null) {
  if (spdx?.spdxVersion !== "SPDX-2.3" || !Array.isArray(spdx.packages)) {
    throw new Error("Expected an SPDX-2.3 document with a packages array");
  }
  const roots = new Set((spdx.relationships ?? [])
    .filter((item) => item.spdxElementId === "SPDXRef-DOCUMENT" && item.relationshipType === "DESCRIBES")
    .map((item) => item.relatedSpdxElement));
  if (roots.size === 0) throw new Error("SPDX document has no DESCRIBES root relationship");

  const dependencies = spdx.packages
    .filter((item) => !roots.has(item.SPDXID))
    .map((item) => {
      const verdict = classifyDeclaredLicense(item.licenseDeclared);
      return {
        name: item.name,
        version: item.versionInfo ?? null,
        declaredLicense: item.licenseDeclared ?? "NOASSERTION",
        concludedLicense: item.licenseConcluded ?? "NOASSERTION",
        ...verdict,
      };
    })
    .sort((a, b) => `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`));
  const counts = {
    preferred: dependencies.filter((item) => item.status === "preferred").length,
    review: dependencies.filter((item) => item.status === "review").length,
    blocked: dependencies.filter((item) => item.status === "blocked").length,
    concludedNoAssertion: dependencies.filter((item) => item.concludedLicense === "NOASSERTION").length,
  };
  return {
    policy: "ADR-015 declaration precheck v1",
    sourceSha256,
    commitSha,
    basis: "installed package.json declarations in the Linux/x64 CI SBOM; not deployed artifact contents",
    gate: counts.review + counts.blocked > 0 ? "BLOCKED" : "INCOMPLETE_ARTIFACT_AND_NOTICES_REVIEW",
    counts,
    limitations: [
      "No byte-level inventory of the deployed web or worker container",
      "No verification of package license files, embedded native libraries, source offers, or complete notices",
      "No legal conclusion or exception approval; preferred declarations are not automatic acceptance",
    ],
    dependencies,
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const paths = argv.filter((item) => !item.startsWith("--"));
  const input = paths[0] ?? "test-results/hsp4-runtime-linux-x64.sbom.spdx.json";
  const output = paths[1] ?? "test-results/hsp4-license-declarations.json";
  const source = fs.readFileSync(input);
  const spdx = JSON.parse(source.toString("utf8"));
  const report = auditSpdxDocument(spdx, crypto.createHash("sha256").update(source).digest("hex"), process.env.GITHUB_SHA ?? null);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ output, gate: report.gate, counts: report.counts }));
  return report.counts.blocked > 0 || (argv.includes("--enforce") && report.counts.review > 0) ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    process.exitCode = runCli();
  } catch (error) {
    console.error(`License declaration scan failed: ${error.message}`);
    process.exitCode = 1;
  }
}
