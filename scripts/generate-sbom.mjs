import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const store = path.join(root, "node_modules", ".pnpm");
const args = process.argv.slice(2);
const option = (name) => args.find((item) => item.startsWith(`--${name}=`))?.split("=", 2)[1];
const output = args.find((item) => !item.startsWith("--")) ?? "docs/audit-2026-09-22/hsp4-sbom.spdx.json";
const targetPlatform = option("platform");
const targetArch = option("arch");

function declaredLicense(value) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    const expressions = value.map((item) => typeof item === "string" ? item : item?.type).filter(Boolean);
    if (expressions.length) return expressions.join(" AND ");
  }
  if (value && typeof value.type === "string") return value.type;
  return "NOASSERTION";
}

function packageDirectories(packageRoot) {
  if (!fs.existsSync(packageRoot)) return [];
  const directories = [];
  for (const item of fs.readdirSync(packageRoot, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    const candidate = path.join(packageRoot, item.name);
    if (item.name.startsWith("@")) {
      for (const scoped of fs.readdirSync(candidate, { withFileTypes: true })) {
        if (scoped.isDirectory()) directories.push(path.join(candidate, scoped.name));
      }
    } else {
      directories.push(candidate);
    }
  }
  return directories;
}

function packageId(name, version) {
  const digest = crypto.createHash("sha256").update(`${name}@${version}`).digest("hex").slice(0, 20);
  return `SPDXRef-Package-${digest}`;
}

function purl(name, version) {
  const encodedName = name.startsWith("@")
    ? `@${encodeURIComponent(name.slice(1).split("/")[0])}/${encodeURIComponent(name.split("/")[1])}`
    : encodeURIComponent(name);
  return `pkg:npm/${encodedName}@${encodeURIComponent(version)}`;
}

function supported(values, target) {
  if (!target || !Array.isArray(values) || values.length === 0) return true;
  if (values.includes(`!${target}`)) return false;
  const positive = values.filter((value) => !value.startsWith("!"));
  return positive.length === 0 || positive.includes(target);
}

export function collectInstalledPackages(storePath = store, target = {}) {
  if (!fs.existsSync(storePath)) throw new Error(`PNPM_STORE_NOT_FOUND: ${storePath}`);
  const unique = new Map();
  for (const entry of fs.readdirSync(storePath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const directory of packageDirectories(path.join(storePath, entry.name, "node_modules"))) {
      const manifestPath = path.join(directory, "package.json");
      if (!fs.existsSync(manifestPath)) continue;
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      if (!manifest.name || !manifest.version) continue;
      if (!supported(manifest.os, target.platform) || !supported(manifest.cpu, target.arch)) continue;
      unique.set(`${manifest.name}@${manifest.version}`, {
        name: manifest.name,
        version: manifest.version,
        license: declaredLicense(manifest.license ?? manifest.licenses),
        os: manifest.os ?? null,
        cpu: manifest.cpu ?? null,
      });
    }
  }
  return [...unique.values()].sort((a, b) => `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`));
}

export function createSpdx(packages, generatedAt = new Date()) {
  const rootManifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const rootId = "SPDXRef-Package-genesis-360";
  const documentNamespace = `https://github.com/Aurum-Soltec/genesis360empresarial/sbom/${generatedAt.toISOString()}`;
  const packageEntries = packages.map((item) => ({
    SPDXID: packageId(item.name, item.version),
    name: item.name,
    versionInfo: item.version,
    downloadLocation: "NOASSERTION",
    filesAnalyzed: false,
    licenseConcluded: "NOASSERTION",
    licenseDeclared: item.license,
    copyrightText: "NOASSERTION",
    externalRefs: [{
      referenceCategory: "PACKAGE-MANAGER",
      referenceType: "purl",
      referenceLocator: purl(item.name, item.version),
    }],
  }));
  return {
    spdxVersion: "SPDX-2.3",
    dataLicense: "CC0-1.0",
    SPDXID: "SPDXRef-DOCUMENT",
    name: `${rootManifest.name}-${rootManifest.version}`,
    documentNamespace,
    creationInfo: { created: generatedAt.toISOString(), creators: ["Tool: genesis360-sbom-generator/1.0"] },
    packages: [{
      SPDXID: rootId,
      name: rootManifest.name,
      versionInfo: rootManifest.version,
      downloadLocation: "https://github.com/Aurum-Soltec/genesis360empresarial",
      filesAnalyzed: false,
      licenseConcluded: "NOASSERTION",
      licenseDeclared: "UNLICENSED",
      copyrightText: "NOASSERTION",
    }, ...packageEntries],
    relationships: [
      { spdxElementId: "SPDXRef-DOCUMENT", relationshipType: "DESCRIBES", relatedSpdxElement: rootId },
      ...packageEntries.map((item) => ({
        spdxElementId: rootId,
        relationshipType: "CONTAINS",
        relatedSpdxElement: item.SPDXID,
      })),
    ],
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const packages = collectInstalledPackages(store, { platform: targetPlatform, arch: targetArch });
  const sbom = createSpdx(packages);
  const target = path.resolve(root, output);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(sbom, null, 2)}\n`);
  const licenses = [...new Set(packages.map((item) => item.license))].sort();
  console.log(JSON.stringify({
    output: path.relative(root, target),
    target: { platform: targetPlatform ?? "all", arch: targetArch ?? "all" },
    packages: packages.length,
    licenses,
  }, null, 2));
}
