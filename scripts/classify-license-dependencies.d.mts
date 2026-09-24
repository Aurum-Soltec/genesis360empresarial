export function productionIdentities(tree: unknown): Set<string>;
export function classifyLicenseDependencies(report: {
  sourceSha256: string;
  ciEvaluatedSha?: string | null;
  prHeadSha?: string | null;
  dependencies: Array<{
    name: string;
    version: string | null;
    declaredLicense: string;
    status: "preferred" | "review" | "blocked";
  }>;
}, tree: unknown): {
  schemaVersion: number;
  sbomSha256: string;
  ciEvaluatedSha: string | null;
  prHeadSha: string | null;
  basis: string;
  reviewedInstalledCount: number;
  reviewedProductionDependencyCount: number;
  reviewedNonProductionDependencyCount: number;
  gate: string;
  entries: Array<{ name: string; version: string | null; declaredLicense: string; status: string; productionDependency: boolean }>;
};
export function runCli(argv?: string[]): void;
