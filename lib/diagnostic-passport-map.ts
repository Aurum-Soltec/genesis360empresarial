export type PassportProjection = {
  factKey: string;
  value: unknown;
  source: "declared";
  sourceRef: string;
  confidence: number;
};

const QUESTION_TO_FACT: Record<string, string> = {
  // Seed mappings are intentionally small and auditable. Expand only through methodology review.
  "EST-001": "strategy.priorities_12m_defined",
};

export function projectAnswerToPassport(questionId: string, value: unknown, diagnosticId: string): PassportProjection | null {
  const factKey = QUESTION_TO_FACT[questionId];
  if (!factKey) return null;
  return {
    factKey,
    value,
    source: "declared",
    sourceRef: `diagnostic:${diagnosticId}:question:${questionId}`,
    confidence: 1,
  };
}
