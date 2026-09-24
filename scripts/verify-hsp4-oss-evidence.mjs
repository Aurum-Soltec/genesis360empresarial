import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Verifies only the Linux CI inventory for 458aac and its comparison with the
// earlier 31df6086 web/worker package inventory. It does not attest the new
// Railway images or grant legal approval.
const expectedCommit = "458aac964d1f9a7016ac1804fe99d68637a3c0b8";
const expectedCiRun = 36057161088;
const bundle = path.resolve(process.argv[2] ?? "docs/audit-2026-09-24/HSP4_OSS_NOTICE_REVIEW_458AAC");
const evidence = path.join(bundle, "CI_EVIDENCE");
const previous = "docs/audit-2026-09-24";

const read = (name) => fs.readFileSync(path.join(evidence, name));
const json = (bytes) => JSON.parse(bytes.toString("utf8"));
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const byIdentity = (entries) => new Map(entries.map((item) => [`${item.name}@${item.version}`, item]));

const sourceNames = [
  "hsp4-runtime-linux-x64.sbom.spdx.json",
  "hsp4-license-declarations.json",
  "hsp4-license-files.json",
  "hsp4-license-production-classification.json",
  "hsp4-production-dependency-tree.json",
];
const sourceHashes = Object.fromEntries(sourceNames.map((name) => [name, sha256(read(name))]));
if (process.argv.includes("--check-index")) {
  const paths = [...sourceNames];
  for (const entry of json(read("hsp4-license-files.json")).entries) {
    for (const variant of entry.installedVariants) {
      for (const license of variant.licenseOrNoticeFiles) {
        paths.push(path.join("hsp4-license-texts", license.archivedNoticePath));
      }
    }
  }
  for (const name of paths) {
    const relative = path.relative(process.cwd(), path.join(evidence, name)).replaceAll("\\", "/");
    const staged = execFileSync("git", ["show", `:${relative}`]);
    assert.equal(sha256(staged), sha256(read(name)), `${relative}: staged bytes differ`);
  }
}
const spdx = json(read(sourceNames[0]));
const declarations = json(read(sourceNames[1]));
const files = json(read(sourceNames[2]));
const classification = json(read(sourceNames[3]));
const web = json(fs.readFileSync(path.join(previous, "HSP4_DEPLOYED_LICENSE_WEB_31df6086.json")));
const worker = json(fs.readFileSync(path.join(previous, "HSP4_DEPLOYED_LICENSE_WORKER_31df6086.json")));

assert.equal(declarations.ciEvaluatedSha, expectedCommit);
assert.equal(files.ciEvaluatedSha, expectedCommit);
assert.equal(classification.ciEvaluatedSha, expectedCommit);
assert.equal(declarations.sourceSha256, sourceHashes[sourceNames[0]]);
assert.equal(files.sbomSha256, sourceHashes[sourceNames[0]]);
assert.equal(classification.sbomSha256, sourceHashes[sourceNames[0]]);
assert.equal(declarations.gate, "BLOCKED");
assert.deepEqual(declarations.counts, {
  preferred: 424,
  review: 30,
  blocked: 0,
  concludedNoAssertion: 454,
});
assert.equal(declarations.dependencies.length, 454);
assert.equal(files.reviewPackageCount, 30);
assert.equal(files.entries.length, 30);
assert.deepEqual(files.missingInstalledPackages, []);
assert.equal(classification.reviewedInstalledCount, 30);
assert.equal(classification.reviewedProductionDependencyCount, 9);
assert.equal(classification.reviewedNonProductionDependencyCount, 21);
assert.equal(web.reviewPackageCount, 30);
assert.equal(worker.reviewPackageCount, 30);
assert.equal(spdx.spdxVersion, "SPDX-2.3");

const declaredByIdentity = byIdentity(declarations.dependencies);
const oldWeb = byIdentity(web.entries);
const oldWorker = byIdentity(worker.entries);
const production = byIdentity(classification.entries);
const licenseCounts = {};
let archivedTexts = 0;
let previousWebMatches = 0;
let previousWorkerMatches = 0;
const withoutLocalText = [];

for (const item of files.entries) {
  const identity = `${item.name}@${item.version}`;
  assert.equal(declaredByIdentity.get(identity)?.declaredLicense, item.declaredLicense, identity);
  assert.equal(declaredByIdentity.get(identity)?.status, "review", identity);
  assert.ok(production.has(identity), identity);
  licenseCounts[item.declaredLicense] = (licenseCounts[item.declaredLicense] ?? 0) + 1;
  const variants = item.installedVariants;
  assert.ok(Array.isArray(variants) && variants.length > 0, identity);
  for (const variant of variants) {
    const oldVariants = [oldWeb.get(identity), oldWorker.get(identity)].map((old) => {
      assert.equal(old?.declaredLicense, item.declaredLicense, identity);
      const match = old.installedVariants.find((candidate) => candidate.directory === variant.directory);
      assert.ok(match, identity);
      assert.equal(match.contentSha256, variant.contentSha256, identity);
      assert.deepEqual(match.nativeFiles, variant.nativeFiles, identity);
      return match;
    });
    for (const license of variant.licenseOrNoticeFiles) {
      const archive = license.archivedNoticePath;
      assert.ok(archive && !path.isAbsolute(archive) && !archive.split(/[\\/]/).includes(".."), identity);
      const bytes = read(path.join("hsp4-license-texts", archive));
      assert.equal(bytes.length, license.bytes, identity);
      assert.equal(sha256(bytes), license.sha256, identity);
      for (const old of oldVariants) {
        const oldText = old.licenseOrNoticeFiles.find((candidate) => candidate.path === license.path);
        assert.equal(oldText?.sha256, license.sha256, identity);
      }
      archivedTexts += 1;
    }
    if (variant.licenseOrNoticeFiles.length === 0) withoutLocalText.push(identity);
  }
  previousWebMatches += 1;
  previousWorkerMatches += 1;
}

assert.equal(archivedTexts, 28);
assert.deepEqual(withoutLocalText.sort(), [
  "@img/sharp-libvips-linux-x64@1.3.3",
  "language-subtag-registry@0.3.23",
  "saxes@6.0.0",
]);
assert.equal(previousWebMatches, 30);
assert.equal(previousWorkerMatches, 30);

const notice = fs.readFileSync(path.join(bundle, "NOTICE_DRAFT.md"), "utf8");
const noticeRows = notice.split(/\r?\n/).filter((line) => line.startsWith("| `"));
assert.equal(noticeRows.length, 30);
for (const item of files.entries) {
  assert.ok(notice.includes(`| \`${item.name}@${item.version}\` | ${item.declaredLicense} |`));
}
for (const name of ["NOTICE_DRAFT.md", "OBLIGATIONS_MATRIX.md", "REVIEW_INDEX.md"]) {
  const document = path.join(bundle, name);
  const source = fs.readFileSync(document, "utf8");
  for (const [, target] of source.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    assert.ok(fs.existsSync(path.resolve(path.dirname(document), target)), `${name}: missing ${target}`);
  }
}

const result = {
  schemaVersion: 1,
  status: "TECHNICAL_REVIEW_ONLY_NO_LEGAL_APPROVAL",
  ciEvaluatedCommit: expectedCommit,
  ciRun: expectedCiRun,
  sourceArtifactFilesSha256: sourceHashes,
  installedDependenciesInCi: 454,
  preferredDeclarations: 424,
  reviewDeclarations: 30,
  reviewedProductionDependencyCount: 9,
  reviewedNonProductionDependencyCount: 21,
  copiedInstalledLicenseOrNoticeFiles: archivedTexts,
  packagesWithoutLocalText: withoutLocalText,
  licenseExpressionCounts: Object.fromEntries(Object.entries(licenseCounts).sort(([a], [b]) => a.localeCompare(b))),
  previousStagingSha: web.commit,
  matchingReviewPackageHashesAgainstPreviousWeb: previousWebMatches,
  matchingReviewPackageHashesAgainstPreviousWorker: previousWorkerMatches,
  newStagingImageByteInspection: false,
  legalDisposition: "PENDING",
};

const manifest = path.join(bundle, "EVIDENCE_MANIFEST.json");
if (process.argv.includes("--write-manifest")) {
  fs.writeFileSync(manifest, `${JSON.stringify(result, null, 2)}\n`);
} else {
  assert.deepEqual(json(fs.readFileSync(manifest)), result);
}
console.log(JSON.stringify({ status: "PASS_TECHNICAL_ONLY", commit: expectedCommit, packages: 454, review: 30, archivedTexts }));
