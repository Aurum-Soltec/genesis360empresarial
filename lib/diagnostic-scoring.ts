/**
 * Single deterministic maturity policy. Units here are ratios [0,1].
 * Missing information is never a maturity of zero.
 * See ADR-023 and the V1.2.1 contract for aggregation/comparability.
 */
export const ScoringRuleVersion = "growth-v1.2.1";
export const MinimumDimensionCoverage = 0.6;

export type ScoringQuestion = { id: string; dimension: string; weight: number };
export type ScoringAnswer = {
  questionId: string;
  maturity: number | null;
  confidence?: number | null;
  applicable?: boolean;
  answerState?: "ANSWERED" | "UNKNOWN" | "DEFERRED" | "NOT_APPLICABLE" | null;
};
export type DimensionScore = {
  dimension: string;
  score: number | null;
  coverage: number;
  confidence: number;
  status: "scored" | "insufficient_data" | "not_applicable";
  applicableWeight: number;
  answeredWeight: number;
};

export function unitInterval(value: number | null | undefined, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(1, value))
    : fallback;
}

export function scoreDimensions(
  questions: readonly ScoringQuestion[],
  answers: readonly ScoringAnswer[],
): DimensionScore[] {
  const byId = new Map<string, ScoringAnswer>();
  for (const answer of answers) {
    if (byId.has(answer.questionId)) throw new Error("DUPLICATE_ANSWER");
    byId.set(answer.questionId, answer);
  }
  const seenQuestions = new Set<string>();
  const dimensions = new Map<string, {
    earned: number; applicableWeight: number; answeredWeight: number; confidence: number;
  }>();

  for (const question of questions) {
    if (seenQuestions.has(question.id)) throw new Error("DUPLICATE_QUESTION");
    seenQuestions.add(question.id);
    if (!Number.isFinite(question.weight) || question.weight <= 0) {
      throw new Error("INVALID_QUESTION_WEIGHT");
    }
    const value = dimensions.get(question.dimension) ?? {
      earned: 0, applicableWeight: 0, answeredWeight: 0, confidence: 0,
    };
    dimensions.set(question.dimension, value);
    const answer = byId.get(question.id);

    // Applicability must have been validated against metadata by the ingestion path.
    if (answer?.answerState === "NOT_APPLICABLE" || answer?.applicable === false) continue;
    value.applicableWeight += question.weight;
    if (!answer || (answer.answerState && answer.answerState !== "ANSWERED")) continue;
    if (answer.maturity === null || answer.maturity === undefined) continue;
    if (!Number.isInteger(answer.maturity) || answer.maturity < 0 || answer.maturity > 4) {
      throw new Error("INVALID_MATURITY");
    }
    value.answeredWeight += question.weight;
    value.earned += (answer.maturity / 4) * question.weight;
    value.confidence += unitInterval(answer.confidence) * question.weight;
  }

  return [...dimensions].map(([dimension, value]) => {
    const coverage = value.applicableWeight
      ? value.answeredWeight / value.applicableWeight : 0;
    const status = value.applicableWeight === 0
      ? "not_applicable" as const
      : value.answeredWeight > 0 && coverage >= MinimumDimensionCoverage
        ? "scored" as const : "insufficient_data" as const;
    return {
      dimension,
      score: status === "scored" ? value.earned / value.answeredWeight : null,
      coverage,
      confidence: value.answeredWeight ? value.confidence / value.answeredWeight : 0,
      status,
      applicableWeight: value.applicableWeight,
      answeredWeight: value.answeredWeight,
    };
  });
}

export function aggregateDimensionScores(dimensions: readonly DimensionScore[]) {
  const applicable = dimensions.filter((dimension) => dimension.status !== "not_applicable");
  const missingDimensions = applicable
    .filter((dimension) => dimension.status !== "scored" || dimension.score === null)
    .map((dimension) => dimension.dimension);
  const applicableWeight = applicable.reduce((sum, dimension) => sum + dimension.applicableWeight, 0);
  const answeredWeight = applicable.reduce((sum, dimension) => sum + dimension.answeredWeight, 0);
  // Equal dimension weights are preserved from the previous global index.
  // Do not silently renormalize an index over whichever dimensions were answered.
  const canScore = applicable.length > 0 && missingDimensions.length === 0;
  return {
    score: canScore
      ? applicable.reduce((sum, dimension) => sum + dimension.score!, 0) / applicable.length
      : null,
    status: canScore ? "scored" as const
      : applicable.length ? "insufficient_data" as const : "not_applicable" as const,
    coverage: applicableWeight ? answeredWeight / applicableWeight : 0,
    missingDimensions,
    applicableDimensions: applicable.map((dimension) => dimension.dimension),
    ruleVersion: ScoringRuleVersion,
  };
}
