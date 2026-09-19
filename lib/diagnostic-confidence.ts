import strategy from "@/data/diagnostic-strategy-v1.1.json";
import { CoreScoreQuestionIds } from "./diagnostic-strategy";

export type ConfidenceAnswer = {
  questionId: string;
  answerState: "ANSWERED" | "UNKNOWN" | "NOT_APPLICABLE" | "DEFERRED";
  applicable: boolean;
  completenessScore?: number | null;
  evidenceStrength?: number | null;
  consistencyScore?: number | null;
  freshnessScore?: number | null;
};

export type ConfidenceResult = {
  score: number;
  percent: number;
  level: "LOW" | "MODERATE" | "GOOD" | "HIGH";
  breakdown: {
    criticalCoverage: number;
    informationCompleteness: number;
    evidenceProvenance: number;
    consistency: number;
    freshness: number;
  };
  recommendations: string[];
};

export const ConfidenceRuleVersion = "confidence-v1.2.1";
const clamp01 = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

function avg(values: Array<number | null | undefined>, fallback: number) {
  const present = values.filter(
    (value): value is number =>
      typeof value === "number" && Number.isFinite(value),
  );
  return present.length
    ? present.reduce((sum, value) => sum + clamp01(value), 0) / present.length
    : fallback;
}

export function calculateDiagnosticConfidence(
  answers: ConfidenceAnswer[],
): ConfidenceResult {
  const answerById = new Map(answers.map((answer) => [answer.questionId, answer]));
  const core = CoreScoreQuestionIds
    .map((id) => answerById.get(id))
    .filter((answer): answer is ConfidenceAnswer => Boolean(answer))
    .filter((answer) => answer.answerState !== "NOT_APPLICABLE");

  const answeredCore = core.filter((answer) => answer.answerState === "ANSWERED" && answer.applicable);
  const criticalCoverage = CoreScoreQuestionIds.length
    ? answeredCore.length / CoreScoreQuestionIds.length
    : 0;

  // De-duplicate by question. Persisted rows have the same unique constraint.
  const answered = [...answerById.values()].filter(
    (answer) => answer.answerState === "ANSWERED" && answer.applicable,
  );
  const informationCompleteness = avg(
    answered.map((answer) => answer.completenessScore),
    0,
  );
  const evidenceProvenance = avg(
    answered.map((answer) => answer.evidenceStrength),
    0,
  );
  const consistency = avg(
    answered.map((answer) => answer.consistencyScore),
    0.5,
  );
  const freshness = avg(
    answered.map((answer) => answer.freshnessScore),
    0.5,
  );

  const weights = strategy.confidenceWeights;
  const score = answered.length === 0 ? 0 : clamp01(
    criticalCoverage * weights.criticalCoverage +
      informationCompleteness * weights.informationCompleteness +
      evidenceProvenance * weights.evidenceProvenance +
      consistency * weights.consistency +
      freshness * weights.freshness,
  );

  const recommendations: string[] = [];
  if (criticalCoverage < 0.75) {
    recommendations.push(
      "Complete as perguntas essenciais ainda pendentes para aumentar a cobertura crítica.",
    );
  }
  if (informationCompleteness < 0.7 && answered.length) {
    recommendations.push(
      "Algumas respostas podem ficar mais úteis se você preencher os detalhes complementares sugeridos.",
    );
  }
  if (evidenceProvenance < 0.5 && answered.length) {
    recommendations.push(
      "Registre evidências para revisão. Nesta etapa, referências declaradas não aumentam automaticamente a confiabilidade.",
    );
  }
  if (
    answers.some(
      (answer) =>
        answer.answerState === "UNKNOWN" || answer.answerState === "DEFERRED",
    )
  ) {
    recommendations.push(
      "Há respostas marcadas como “Não sei” ou “Responder depois”; revise apenas as que forem relevantes.",
    );
  }

  const level =
    score < 0.45
      ? "LOW"
      : score < 0.65
        ? "MODERATE"
        : score < 0.82
          ? "GOOD"
          : "HIGH";

  return {
    score,
    percent: Math.round(score * 100),
    level,
    breakdown: {
      criticalCoverage,
      informationCompleteness,
      evidenceProvenance,
      consistency,
      freshness,
    },
    recommendations: recommendations.slice(0, 3),
  };
}

export function progressPercent(input: {
  starterSeen: number;
  starterTotal: number;
  adaptiveSeen: number;
  adaptiveTotal: number;
}) {
  const starterRatio = input.starterTotal
    ? Math.min(1, input.starterSeen / input.starterTotal)
    : 1;

  // Starter work owns 85% of the bar. This prevents the bar from moving
  // backwards when deterministic adaptive follow-ups appear.
  if (starterRatio < 1) return Math.round(starterRatio * 85);

  if (input.adaptiveTotal === 0) return 100;

  const adaptiveRatio = Math.min(
    1,
    input.adaptiveSeen / input.adaptiveTotal,
  );
  return Math.round(85 + adaptiveRatio * 15);
}
