export type EligibilityInput = {
  qualificationStatus: string;
  qualificationScore: number | null;
  minimumScore: number;
  planEligible: boolean;
  capabilityFit: number;
  complianceStatus: string;
  capacityStatus: string;
  requireCompliance?: boolean;
  requireCapacity?: boolean;
};

export function eligibleProvider(input: EligibilityInput) {
  const reasons: string[] = [];
  const requireCompliance = input.requireCompliance ?? true;
  const requireCapacity = input.requireCapacity ?? true;

  const validMinimum = Number.isFinite(input.minimumScore) &&
    input.minimumScore >= 0 && input.minimumScore <= 100;
  const validQualification = input.qualificationScore !== null &&
    Number.isFinite(input.qualificationScore) &&
    input.qualificationScore >= 0 && input.qualificationScore <= 100;
  const validFit = Number.isFinite(input.capabilityFit) &&
    input.capabilityFit > 0 && input.capabilityFit <= 1;

  if (input.qualificationStatus !== "qualified") reasons.push("NOT_QUALIFIED");
  if (!validMinimum) reasons.push("INVALID_MINIMUM_SCORE");
  if (!validQualification) reasons.push("INVALID_QUALIFICATION_SCORE");
  if (validMinimum && validQualification && input.qualificationScore! < input.minimumScore) {
    reasons.push("SCORE_BELOW_THRESHOLD");
  }
  if (!input.planEligible) reasons.push("PLAN_NOT_ELIGIBLE");
  if (!validFit) reasons.push("NO_CAPABILITY_FIT");
  if (requireCompliance && input.complianceStatus !== "valid") reasons.push("COMPLIANCE_INVALID");
  if (requireCapacity && !["available", "limited"].includes(input.capacityStatus)) {
    reasons.push("NO_CAPACITY");
  }

  return { eligible: reasons.length === 0, reasons };
}

export type RankingInput = {
  fit: number;
  qualification: number;
  outcomes?: number | null;
  capacity?: number | null;
  planTier?: number;
};

const BASE_WEIGHTS = {
  fit: 0.45,
  qualification: 0.25,
  outcomes: 0.20,
  capacity: 0.10,
} as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function rankingScore(input: RankingInput) {
  const components: Array<[number, number | null | undefined]> = [
    [BASE_WEIGHTS.fit, input.fit],
    [BASE_WEIGHTS.qualification, input.qualification],
    [BASE_WEIGHTS.outcomes, input.outcomes],
    [BASE_WEIGHTS.capacity, input.capacity],
  ];

  let weighted = 0;
  let weight = 0;

  for (const [componentWeight, value] of components) {
    if (value === null || value === undefined || !Number.isFinite(value)) continue;
    weighted += componentWeight * clamp01(value);
    weight += componentWeight;
  }

  // `planTier` is intentionally ignored. Commercial plan can gate eligibility,
  // never ranking position after a provider is eligible.
  return weight > 0 ? weighted / weight : 0;
}

export function capacityScore(status: string): number | null {
  if (status === "available") return 1;
  if (status === "limited") return 0.5;
  if (status === "unavailable") return 0;
  return null;
}
