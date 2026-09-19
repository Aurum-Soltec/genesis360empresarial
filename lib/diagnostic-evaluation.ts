import {
  diagnosticQueue, questionBank, questionMetadata, StarterQuestionIds,
  type DiagnosticProfile, type ApplicabilityContext,
} from "./diagnostic-strategy";
import { normalizeDiagnosticAnswer, type AnswerInput } from "./diagnostic-answer-quality";
import {
  calculateDiagnosticConfidence, ConfidenceRuleVersion, progressPercent,
} from "./diagnostic-confidence";
import { scoreAnchorQuestions } from "./diagnostic-strategy";
import { scoreDimensions, aggregateDimensionScores, ScoringRuleVersion } from "./diagnostic-scoring";
import { derivePainFindings } from "./diagnostic-rules";
import strategy from "@/data/diagnostic-strategy-v1.1.json";

export type EvaluationAnswer = AnswerInput & { questionId: string };
export type EvaluationInput = {
  profile: DiagnosticProfile;
  status: string;
  answers: EvaluationAnswer[];
  context?: ApplicabilityContext;
  asOf?: number;
};

/** One snapshot evaluates progress, maturity and confidence for preview AND submission. */
export function evaluateDiagnostic(input: EvaluationInput) {
  const bank = new Map(questionBank().map((question) => [question.id, question]));
  const unique = new Set<string>();
  const normalized = input.answers.map((answer) => {
    if (unique.has(answer.questionId)) throw new Error("DUPLICATE_ANSWER");
    unique.add(answer.questionId);
    const question = bank.get(answer.questionId);
    if (!question) throw new Error("UNKNOWN_QUESTION");
    return { questionId: question.id, ...normalizeDiagnosticAnswer(question, answer, input.asOf) };
  });
  const queue = diagnosticQueue({ ...input, answers: normalized });
  const seen = new Set(normalized.map((answer) => answer.questionId));
  const starters = new Set(StarterQuestionIds);
  const starterQueue = queue.filter((question) => starters.has(question.id));
  const adaptiveQueue = queue.filter((question) => !starters.has(question.id));
  const nextQuestion = queue.find((question) => !seen.has(question.id)) ?? null;
  const metadata = nextQuestion ? questionMetadata(nextQuestion.id) : null;
  const confidence = calculateDiagnosticConfidence(normalized);
  const scores = scoreDimensions(scoreAnchorQuestions(), normalized);
  const overall = aggregateDimensionScores(scores);
  const pains = derivePainFindings(scores);
  const blockers: string[] = [];
  if (input.status !== "draft") blockers.push("DIAGNOSTIC_NOT_EDITABLE");
  if (nextQuestion) blockers.push("DIAGNOSTIC_PATH_INCOMPLETE");
  if (confidence.breakdown.criticalCoverage < 0.6) blockers.push("INSUFFICIENT_COVERAGE");

  const state = {
    status: input.status,
    evaluatedAsOf: input.asOf === undefined ? null : new Date(input.asOf).toISOString(),
    profile: input.profile,
    strategyVersion: strategy.version,
    scoringRuleVersion: ScoringRuleVersion,
    confidenceRuleVersion: ConfidenceRuleVersion,
    progressPercent: progressPercent({
      starterSeen: starterQueue.filter((question) => seen.has(question.id)).length,
      starterTotal: starterQueue.length,
      adaptiveSeen: adaptiveQueue.filter((question) => seen.has(question.id)).length,
      adaptiveTotal: adaptiveQueue.length,
    }),
    confidencePercent: confidence.percent,
    confidenceLevel: confidence.level,
    confidenceBreakdown: confidence.breakdown,
    recommendations: confidence.recommendations,
    nextQuestionId: nextQuestion?.id ?? null,
    stageCode: metadata?.stageCode ?? null,
    stageOrder: metadata?.stageOrder ?? null,
    stageName: metadata
      ? strategy.stages.find((stage) => stage.code === metadata.stageCode)?.name ?? null : null,
    answeredCount: normalized.filter((answer) => answer.answerState === "ANSWERED").length,
    seenCount: normalized.length,
    currentQueueCount: queue.length,
    typicalRange: input.profile === "FULL" ? [31, 60] : [31, 42],
    adaptiveCount: adaptiveQueue.length,
    unresolvedQuestionIds: normalized.filter((answer) => answer.answerState === "UNKNOWN" || answer.answerState === "DEFERRED").map((answer) => answer.questionId),
    unresolvedCount: normalized.filter((answer) =>
      answer.answerState === "UNKNOWN" || answer.answerState === "DEFERRED").length,
    growthScore: overall.score === null ? null : Math.round(overall.score * 100),
    growthScoreStatus: overall.status,
    missingDimensions: overall.missingDimensions,
    canSubmit: blockers.length === 0,
    submissionBlockers: blockers,
  };
  return { state, scores, pains, overall, confidence };
}

export type DiagnosticEvaluation = ReturnType<typeof evaluateDiagnostic>;
