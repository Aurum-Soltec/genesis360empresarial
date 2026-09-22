export type SbomPackage = {
  name: string;
  version: string;
  license: string;
  os?: string[] | null;
  cpu?: string[] | null;
};

export function collectInstalledPackages(
  storePath?: string,
  target?: { platform?: string; arch?: string },
): SbomPackage[];
export function createSpdx(
  packages: SbomPackage[],
  generatedAt?: Date,
): {
  spdxVersion: string;
  packages: Array<{ name: string; versionInfo: string; [key: string]: unknown }>;
  relationships: Array<Record<string, string>>;
  [key: string]: unknown;
};
