import type { DiagnosticQuestion, QuestionAnswer, ScoreResult } from "@/lib/types";

export function calculateDimensionScore(
  questions: DiagnosticQuestion[],
  answers: QuestionAnswer[],
): ScoreResult {
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer]));
  const applicable = questions.filter((question) => {
    const answer = answerMap.get(question.id);
    return answer?.applicable !== false;
  });

  const totalWeight = applicable.reduce((sum, question) => sum + question.weight, 0);
  let answeredWeight = 0;
  let maturityWeighted = 0;
  let confidenceWeighted = 0;

  for (const question of applicable) {
    const answer = answerMap.get(question.id);
    if (!answer || answer.maturity === null) continue;

    answeredWeight += question.weight;
    maturityWeighted += answer.maturity * question.weight;
    confidenceWeighted += clamp(answer.confidence, 0, 1) * question.weight;
  }

  const coverage = totalWeight === 0 ? 0 : answeredWeight / totalWeight;
  const confidence = answeredWeight === 0 ? 0 : confidenceWeighted / answeredWeight;

  if (coverage < 0.6 || answeredWeight === 0) {
    return {
      score: null,
      coverage: roundPercent(coverage),
      confidence: roundPercent(confidence),
      status: "insufficient_data",
    };
  }

  const maxMaturity = 4 * answeredWeight;
  return {
    score: Math.round((maturityWeighted / maxMaturity) * 100),
    coverage: roundPercent(coverage),
    confidence: roundPercent(confidence),
    status: "scored",
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value: number) {
  return Math.round(value * 100);
}
