import type { AnswerState, DiagnosticQuestion } from "./diagnostic-strategy";
import { questionMetadata } from "./diagnostic-strategy";

export type AnswerInput = {
  answerState: AnswerState;
  response: unknown;
  maturity?: number | null;
  informationSlots?: Record<string, unknown>;
  evidenceRefs?: string[];
};

function nonEmpty(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
}

function recencyScore(value: unknown, asOf: number): number | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(value)) return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return null;
  const months = (asOf - time) / (1000 * 60 * 60 * 24 * 30.44);
  if (months < 0) return 0; // A future date does not establish freshness.
  if (months <= 12) return 1;
  if (months <= 24) return 0.8;
  if (months <= 36) return 0.6;
  return 0.4;
}

export function normalizeDiagnosticAnswer(
  question: DiagnosticQuestion,
  input: AnswerInput,
  asOf: number = Date.now(),
) {
  if (!["ANSWERED", "UNKNOWN", "NOT_APPLICABLE", "DEFERRED"].includes(input.answerState)) throw new Error("INVALID_ANSWER_STATE");
  if (!Number.isFinite(asOf)) throw new Error("INVALID_EVALUATION_DATE");
  const metadata = questionMetadata(question.id);

  if (input.answerState === "NOT_APPLICABLE") {
    if (!metadata.allowsNotApplicable) {
      throw new Error("NOT_APPLICABLE_NOT_ALLOWED");
    }
    return {
      answerState: input.answerState,
      response: input.response ?? { state: "NOT_APPLICABLE" },
      maturity: null,
      applicable: false,
      confidence: 0,
      completenessScore: 1,
      evidenceStrength: 0,
      consistencyScore: 0.5,
      freshnessScore: 0.5,
      informationSlots: {},
      evidenceRefs: [],
    };
  }

  if (input.answerState === "UNKNOWN" || input.answerState === "DEFERRED") {
    return {
      answerState: input.answerState,
      response: input.response ?? { state: input.answerState },
      maturity: null,
      applicable: true,
      confidence: input.answerState === "UNKNOWN" ? 0.15 : 0,
      completenessScore: 0,
      evidenceStrength: 0,
      consistencyScore: 0.5,
      freshnessScore: 0.5,
      informationSlots: input.informationSlots ?? {},
      evidenceRefs: input.evidenceRefs ?? [],
    };
  }

  let maturity = input.maturity ?? null;

  if (metadata.scoreRole === "CORE_ANCHOR") {
    if (question.id === "TEC-002") {
      const choice =
        typeof input.response === "object" && input.response !== null
          ? (input.response as Record<string, unknown>).choice
          : null;
      const option = metadata.ui?.options?.find(
        (candidate) => typeof candidate !== "string" && candidate.value === choice,
      );
      maturity = typeof option === "object" && option !== null && typeof option.maturity === "number" ? option.maturity : null;
    }

    if (maturity === null || !Number.isInteger(maturity) || maturity < 0 || maturity > 4) {
      throw new Error("MATURITY_REQUIRED_FOR_SCORE_ANCHOR");
    }
  } else {
    maturity = null;
  }

  const slots = input.informationSlots ?? {};
  const declaredSlots = metadata.informationSlots ?? [];
  const requiredSlots = declaredSlots.filter((slot) => slot.required);
  const slotSet = requiredSlots.length ? requiredSlots : declaredSlots;
  const filledSlots = slotSet.filter((slot) => nonEmpty(slots[slot.key])).length;

  // Structured choice/scale already carries useful signal. Optional detail can
  // raise completeness, but verbosity alone never does.
  const base = nonEmpty(input.response) ? 0.8 : 0.5;
  const slotRatio = slotSet.length ? filledSlots / slotSet.length : 1;
  const completenessScore = Math.min(
    1,
    base + (slotSet.length ? 0.2 * slotRatio : 0.2),
  );

  const evidenceRefs = input.evidenceRefs ?? [];
  // References remain declarations until a separate review can prove relevance,
  // independent reviewer and current verification. This tranche grants NO uplift.
  const evidenceStrength = 0.35;

  const dates = Object.values(slots)
    .map((value) => recencyScore(value, asOf))
    .filter((value): value is number => value !== null);
  const freshnessScore = dates.length
    ? dates.reduce((sum, value) => sum + value, 0) / dates.length
    : 0.6;

  const consistencyScore = 0.5; // neutral until a deterministic contradiction rule fires

  const confidence =
    0.35 +
    completenessScore * 0.25 +
    evidenceStrength * 0.2 +
    consistencyScore * 0.1 +
    freshnessScore * 0.1;

  return {
    answerState: "ANSWERED" as const,
    response: input.response,
    maturity,
    applicable: true,
    confidence: Math.min(1, confidence),
    completenessScore,
    evidenceStrength,
    consistencyScore,
    freshnessScore,
    informationSlots: slots,
    evidenceRefs,
  };
}
