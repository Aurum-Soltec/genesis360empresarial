import type { DiagnosticQuestion } from "./diagnostic-engine";

export type ApplicabilityContext = {
  profile: "ESSENTIAL" | "FULL";
  companyFacts?: Record<string, unknown>;
  answered?: Record<string, unknown>;
};

export type ApplicabilityDecision = {
  applicable: boolean;
  reasonCode: "ACTIVE" | "INACTIVE" | "PROFILE_SCOPE";
  evidence: string[];
};

export function evaluateApplicability(
  question: DiagnosticQuestion,
  context: ApplicabilityContext,
): ApplicabilityDecision {
  if (!question.active) return { applicable: false, reasonCode: "INACTIVE", evidence: ["question.active=false"] };

  // V1 conservative policy:
  // sector/size/answer-based exclusions are NOT inferred until a canonical rule catalog exists.
  // Profile scope is handled by selectDiagnosticQuestions before this function.
  return {
    applicable: true,
    reasonCode: "ACTIVE",
    evidence: [`question.version=${question.version}`, `profile=${context.profile}`],
  };
}
