import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Records the bytes installed in CI for packages requiring ADR-015 review.
// This is not an inventory of the Railway container or a license conclusion.
const noticeName = /^(?:licen[cs]e|copying|notice|third[-_ ]party[-_ ]notices?|copyright)(?:[.\-_ ].*)?$/i;
const nativeName = /\.(?:node|dll|dylib)$|\.so(?:\.|$)/i;
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const posix = (value) => value.split(path.sep).join("/");

function installedPackageDirectories(root) {
  const store = path.join(root, "node_modules", ".pnpm");
  if (!fs.existsSync(store)) throw new Error("PNPM_STORE_NOT_FOUND");
  const packages = new Map();
  for (const entry of fs.readdirSync(store, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const moduleRoot = path.join(store, entry.name, "node_modules");
    if (!fs.existsSync(moduleRoot)) continue;
    for (const top of fs.readdirSync(moduleRoot, { withFileTypes: true })) {
      const topPath = path.join(moduleRoot, top.name);
      const candidates = top.name.startsWith("@") && top.isDirectory()
        ? fs.readdirSync(topPath, { withFileTypes: true })
          .filter((item) => item.isDirectory())
          .map((item) => path.join(topPath, item.name))
        : top.isDirectory() ? [topPath] : [];
      for (const directory of candidates) {
        const manifest = path.join(directory, "package.json");
        if (!fs.existsSync(manifest)) continue;
        const { name, version } = JSON.parse(fs.readFileSync(manifest, "utf8"));
        if (!name || !version) continue;
        const identity = `${name}@${version}`;
        if (!packages.has(identity)) packages.set(identity, []);
        packages.get(identity).push(directory);
      }
    }
  }
  return packages;
}

function inventoryDirectory(root, directory) {
  const files = [];
  const links = [];
  const visit = (current) => {
    for (const item of fs.readdirSync(current, { withFileTypes: true })) {
      if (item.name === "node_modules") continue; // pnpm dependency links belong to another package.
      const location = path.join(current, item.name);
      const relative = posix(path.relative(directory, location));
      if (item.isSymbolicLink()) {
        links.push(relative); // Never dereference a link outside the package root.
      } else if (item.isDirectory()) {
        visit(location);
      } else if (item.isFile()) {
        const bytes = fs.readFileSync(location);
        files.push({ path: relative, bytes: bytes.length, sha256: sha256(bytes) });
      }
    }
  };
  visit(directory);
  files.sort((a, b) => a.path.localeCompare(b.path));
  links.sort();
  return {
    directory: posix(path.relative(root, directory)),
    fileCount: files.length,
    totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
    contentSha256: sha256(files.map((item) => `${item.path}\t${item.sha256}\n`).join("")),
    licenseOrNoticeFiles: files.filter((item) => noticeName.test(path.basename(item.path))),
    nativeFiles: files.filter((item) => nativeName.test(path.basename(item.path))),
    symlinksNotFollowed: links,
  };
}

export function buildInstalledLicenseEvidence(root, report) {
  if (!Array.isArray(report?.dependencies) || !report.sourceSha256) {
    throw new Error("INVALID_LICENSE_REPORT");
  }
  const installed = installedPackageDirectories(root);
  const entries = report.dependencies
    .filter((item) => item.status !== "preferred")
    .map((item) => {
      const identity = `${item.name}@${item.version}`;
      const directories = installed.get(identity) ?? [];
      return {
        name: item.name,
        version: item.version,
        declaredLicense: item.declaredLicense,
        status: item.status,
        installedVariants: directories.map((directory) => inventoryDirectory(root, directory)),
      };
    });
  return {
    schemaVersion: 1,
    basis: "CI-installed pnpm package bytes requiring ADR-015 review; not the deployed Railway web or worker images",
    sbomSha256: report.sourceSha256,
    ciEvaluatedSha: report.ciEvaluatedSha ?? null,
    prHeadSha: report.prHeadSha ?? null,
    reviewPackageCount: entries.length,
    missingInstalledPackages: entries.filter((item) => item.installedVariants.length === 0).map((item) => `${item.name}@${item.version}`),
    entries,
  };
}

export function copyLicenseTexts(root, evidence, destination) {
  let copied = 0;
  for (const entry of evidence.entries) {
    const identityDigest = sha256(`${entry.name}@${entry.version}`).slice(0, 16);
    entry.installedVariants.forEach((variant, index) => {
      for (const file of variant.licenseOrNoticeFiles) {
        const source = path.resolve(root, variant.directory, file.path);
        const packageRoot = path.resolve(root, variant.directory);
        if (!source.startsWith(`${packageRoot}${path.sep}`)) throw new Error("NOTICE_PATH_ESCAPES_PACKAGE");
        const relative = posix(path.join(identityDigest, String(index), file.path));
        const target = path.join(destination, relative);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(source, target);
        if (sha256(fs.readFileSync(target)) !== file.sha256) throw new Error("COPIED_NOTICE_HASH_MISMATCH");
        file.archivedNoticePath = relative;
        copied += 1;
      }
    });
  }
  return copied;
}

export function runCli(argv = process.argv.slice(2)) {
  const reportPath = argv[0] ?? "test-results/hsp4-license-declarations.json";
  const outputPath = argv[1] ?? "test-results/hsp4-license-files.json";
  const noticeDirectory = argv[2] ?? null;
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const evidence = buildInstalledLicenseEvidence(process.cwd(), report);
  const copiedNotices = noticeDirectory ? copyLicenseTexts(process.cwd(), evidence, noticeDirectory) : 0;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify({
    output: outputPath,
    reviewPackages: evidence.reviewPackageCount,
    missingInstalledPackages: evidence.missingInstalledPackages.length,
    nativeFiles: evidence.entries.flatMap((entry) => entry.installedVariants).reduce((count, variant) => count + variant.nativeFiles.length, 0),
    copiedNotices,
  }));
  return evidence.missingInstalledPackages.length > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    process.exitCode = runCli();
  } catch (error) {
    console.error(`License file inventory failed: ${error.message}`);
    process.exitCode = 1;
  }
}
