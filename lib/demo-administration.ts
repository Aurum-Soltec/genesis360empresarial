import type { FeatureFlags } from "./feature-flags";

type SensitiveFlags = Pick<FeatureFlags, "agentic" | "dataUpload" | "qualificationNetwork" | "realContact" | "ecosystem">;

export type DemoAdministrationChecks = {
  companyReady: boolean;
  sourcesRegistered: boolean;
  reportAvailable: boolean;
  simulatedSolutionsAvailable: boolean;
  sensitiveFeaturesOff: boolean;
  presentationChecksReady: boolean;
};

export function assessDemoAdministration(input: {
  tenantStatus: string | null;
  companyFictional: boolean | null;
  canonicalSourceCount: number;
  canonicalSourceTarget: number;
  scoredDiagnosticExists: boolean;
  simulatedSolutionCount: number;
  flags: SensitiveFlags;
}): DemoAdministrationChecks {
  const companyReady = input.tenantStatus === "active" && input.companyFictional === true;
  const sourcesRegistered = input.canonicalSourceCount === input.canonicalSourceTarget;
  const reportAvailable = input.scoredDiagnosticExists;
  const simulatedSolutionsAvailable = reportAvailable && input.simulatedSolutionCount > 0;
  const sensitiveFeaturesOff = !(
    input.flags.agentic ||
    input.flags.dataUpload ||
    input.flags.qualificationNetwork ||
    input.flags.realContact ||
    input.flags.ecosystem
  );

  return {
    companyReady,
    sourcesRegistered,
    reportAvailable,
    simulatedSolutionsAvailable,
    sensitiveFeaturesOff,
    presentationChecksReady: companyReady && sourcesRegistered && reportAvailable && simulatedSolutionsAvailable && sensitiveFeaturesOff,
  };
}
