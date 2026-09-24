import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function productionIdentities(tree) {
  if (!Array.isArray(tree) || tree.length !== 1 || !tree[0]?.dependencies) {
    throw new Error("INVALID_PNPM_PRODUCTION_TREE");
  }
  const identities = new Set();
  const visit = (node) => {
    for (const [name, dependency] of Object.entries({ ...node.dependencies, ...node.optionalDependencies })) {
      if (!dependency || typeof dependency !== "object" || typeof dependency.version !== "string") {
        throw new Error(`INVALID_PNPM_DEPENDENCY: ${name}`);
      }
      const identity = `${name}@${dependency.version}`;
      identities.add(identity);
      visit(dependency);
    }
  };
  visit(tree[0]);
  return identities;
}

export function classifyLicenseDependencies(report, tree) {
  if (!Array.isArray(report?.dependencies) || !report.sourceSha256) throw new Error("INVALID_LICENSE_REPORT");
  const production = productionIdentities(tree);
  const entries = report.dependencies
    .filter((item) => item.status !== "preferred")
    .map((item) => ({
      name: item.name,
      version: item.version,
      declaredLicense: item.declaredLicense,
      status: item.status,
      productionDependency: production.has(`${item.name}@${item.version}`),
    }));
  return {
    schemaVersion: 1,
    sbomSha256: report.sourceSha256,
    ciEvaluatedSha: report.ciEvaluatedSha ?? null,
    prHeadSha: report.prHeadSha ?? null,
    basis: "pnpm --prod dependency reachability; not a deployed-image inventory or legal disposition",
    reviewedInstalledCount: entries.length,
    reviewedProductionDependencyCount: entries.filter((item) => item.productionDependency).length,
    reviewedNonProductionDependencyCount: entries.filter((item) => !item.productionDependency).length,
    gate: "BLOCKED_DEPLOYED_ARTIFACT_AND_OWNER_DISPOSITION",
    entries,
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const reportPath = argv[0] ?? "test-results/hsp4-license-declarations.json";
  const treePath = argv[1] ?? "test-results/hsp4-production-dependency-tree.json";
  const outputPath = argv[2] ?? "test-results/hsp4-license-production-classification.json";
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const tree = JSON.parse(fs.readFileSync(treePath, "utf8"));
  const classification = classifyLicenseDependencies(report, tree);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(classification, null, 2)}\n`);
  console.log(JSON.stringify({
    output: outputPath,
    gate: classification.gate,
    reviewedProductionDependencyCount: classification.reviewedProductionDependencyCount,
    reviewedNonProductionDependencyCount: classification.reviewedNonProductionDependencyCount,
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    runCli();
  } catch (error) {
    console.error(`License dependency classification failed: ${error.message}`);
    process.exitCode = 1;
  }
}
