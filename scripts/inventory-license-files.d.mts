export type InstalledLicenseEvidenceInput = {
  sourceSha256: string;
  ciEvaluatedSha?: string | null;
  prHeadSha?: string | null;
  dependencies: Array<{
    name: string;
    version: string | null;
    declaredLicense: string;
    status: "preferred" | "review" | "blocked";
  }>;
};

export type InventoriedFile = { path: string; bytes: number; sha256: string; archivedNoticePath?: string };
export type InstalledVariant = {
  directory: string;
  fileCount: number;
  totalBytes: number;
  contentSha256: string;
  licenseOrNoticeFiles: InventoriedFile[];
  nativeFiles: InventoriedFile[];
  symlinksNotFollowed: string[];
};
export type InstalledLicenseEvidence = {
  schemaVersion: 1;
  basis: string;
  sbomSha256: string;
  ciEvaluatedSha: string | null;
  prHeadSha: string | null;
  reviewPackageCount: number;
  missingInstalledPackages: string[];
  entries: Array<{
    name: string;
    version: string | null;
    declaredLicense: string;
    status: string;
    installedVariants: InstalledVariant[];
  }>;
};

export function buildInstalledLicenseEvidence(root: string, report: InstalledLicenseEvidenceInput): InstalledLicenseEvidence;
export function copyLicenseTexts(root: string, evidence: InstalledLicenseEvidence, destination: string): number;
export function runCli(argv?: string[]): number;
