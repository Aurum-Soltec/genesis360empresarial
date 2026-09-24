export type LicenseVerdict = {
  status: "preferred" | "review" | "blocked";
  reason: string;
};

export type LicenseAuditReport = {
  policy: string;
  sourceSha256: string;
  commitSha: string | null;
  basis: string;
  gate: "BLOCKED" | "INCOMPLETE_ARTIFACT_AND_NOTICES_REVIEW";
  counts: {
    preferred: number;
    review: number;
    blocked: number;
    concludedNoAssertion: number;
  };
  limitations: string[];
  dependencies: Array<LicenseVerdict & {
    name: string;
    version: string | null;
    declaredLicense: string;
    concludedLicense: string;
  }>;
};

export function classifyDeclaredLicense(value: unknown): LicenseVerdict;
export function auditSpdxDocument(spdx: unknown, sourceSha256: string, commitSha?: string | null): LicenseAuditReport;
export function runCli(argv?: string[]): number;
