import { scoreDimensions } from "./diagnostic-scoring";
import master from "@/data/diagnostic-master.json";
import metadataSource from "@/data/diagnostic-question-metadata-v1.1.json";
import strategySource from "@/data/diagnostic-strategy-v1.1.json";

export type DiagnosticProfile = "ESSENTIAL" | "FULL";
export type DiagnosticQuestion = (typeof master.questions)[number];
export type AnswerState =
  | "ANSWERED"
  | "UNKNOWN"
  | "NOT_APPLICABLE"
  | "DEFERRED";

export type StrategyAnswer = {
  questionId: string;
  maturity: number | null;
  confidence?: number | null;
  applicable?: boolean;
  answerState?: AnswerState | null;
};

export type ApplicabilityContext = {
  sectorCode?: string | null;
  operatingTraits?: Record<string, boolean | undefined>;
};

type QuestionMetadata = (typeof metadataSource.questions)[number];

const questionMap = new Map(
  master.questions.filter((question) => question.active).map((question) => [question.id, question]),
);
const metadataMap = new Map(
  metadataSource.questions.map((metadata) => [metadata.id, metadata]),
);

export const DiagnosticStrategyVersion = strategySource.version;
export const DiagnosticStages = strategySource.stages;
export const CoreScoreQuestionIds = strategySource.coreScoreQuestionIds;
export const StarterQuestionIds = strategySource.starterQuestionIds;

export function questionBank(): DiagnosticQuestion[] {
  return [...questionMap.values()];
}

export function questionMetadata(questionId: string): QuestionMetadata {
  const metadata = metadataMap.get(questionId);
  if (!metadata) throw new Error(`QUESTION_METADATA_NOT_FOUND:${questionId}`);
  return metadata;
}

export function scoreAnchorQuestions(): DiagnosticQuestion[] {
  return CoreScoreQuestionIds.map((id) => questionMap.get(id)).filter(
    (question): question is DiagnosticQuestion => Boolean(question),
  );
}

export function starterQuestions(): DiagnosticQuestion[] {
  return StarterQuestionIds.map((id) => questionMap.get(id)).filter(
    (question): question is DiagnosticQuestion => Boolean(question),
  );
}

export function isApplicable(
  questionId: string,
  context: ApplicabilityContext = {},
): boolean {
  const metadata = questionMetadata(questionId);
  const rule = metadata.applicability as
    | { mode: "universal" }
    | { mode: "trait_required"; trait: string }
    | { mode: "trait_or_discovery"; trait: string };

  if (rule.mode === "universal") return true;

  const trait = context.operatingTraits?.[rule.trait];
  if (rule.mode === "trait_required") return trait === true;

  // Discovery questions stay available while the operating trait is unknown.
  return trait !== false;
}


function dimensionSignals(answers: StrategyAnswer[]) {
  return new Map(
    scoreDimensions(scoreAnchorQuestions(), answers).map((dimension) => [
      dimension.dimension,
      {
        ...dimension,
        hasUnknownOrDeferred: answers.some((answer) =>
          questionMap.get(answer.questionId)?.dimension === dimension.dimension &&
          (answer.answerState === "UNKNOWN" || answer.answerState === "DEFERRED")),
      },
    ]),
  );
}

function informationYield(
  question: DiagnosticQuestion,
  context: ApplicabilityContext = {},
): number {
  const metadata = questionMetadata(question.id);
  const structuredBonus =
    metadata.informationSlots.length > 0 ||
    !question.responseType.startsWith("Escala")
      ? 0.25
      : 0;
  const evidenceBonus = Math.min(
    0.15,
    (question.evidenceSuggestions?.length ?? 0) * 0.03,
  );
  const sectorBonus =
    context.sectorCode &&
    metadata.sectorAffinity.some(
      (sector) => sector !== "ALL" && sector === context.sectorCode,
    )
      ? 0.12
      : 0;

  return question.weight / 3 + structuredBonus + evidenceBonus + sectorBonus;
}

export function selectAdaptiveQuestions(input: {
  profile: DiagnosticProfile;
  answers: StrategyAnswer[];
  context?: ApplicabilityContext;
}): DiagnosticQuestion[] {
  const signals = dimensionSignals(input.answers);
  const starter = new Set(StarterQuestionIds);
  const max = input.profile === "FULL"
    ? strategySource.full.adaptiveMax
    : strategySource.essential.adaptiveMax;

  const selected: DiagnosticQuestion[] = [];

  for (const [dimension, signal] of signals.entries()) {
    if (signal.status === "not_applicable") continue;
    const firstTrigger =
      (signal.score !== null &&
        signal.score <= strategySource.adaptiveTriggers.oneFollowupWhen.dimensionScoreAtOrBelow) ||
      signal.confidence <
        strategySource.adaptiveTriggers.oneFollowupWhen.dimensionConfidenceBelow ||
      signal.hasUnknownOrDeferred;

    if (!firstTrigger) continue;

    const candidates = questionBank()
      .filter(
        (question) =>
          question.dimension === dimension &&
          !starter.has(question.id) &&
          questionMetadata(question.id).adaptiveEligible &&
          isApplicable(question.id, input.context),
      )
      .sort(
        (a, b) =>
          informationYield(b, input.context) - informationYield(a, input.context) ||
          b.weight - a.weight ||
          a.id.localeCompare(b.id),
      );

    if (candidates[0]) selected.push(candidates[0]);

    const secondTrigger =
      (signal.score !== null &&
        signal.score <= strategySource.adaptiveTriggers.secondFollowupWhen.dimensionScoreAtOrBelow) ||
      signal.confidence <
        strategySource.adaptiveTriggers.secondFollowupWhen.dimensionConfidenceBelow;

    if (secondTrigger && candidates[1]) selected.push(candidates[1]);
  }

  return [...new Map(selected.map((question) => [question.id, question])).values()]
    .sort((a, b) => {
      const ma = questionMetadata(a.id);
      const mb = questionMetadata(b.id);
      return ma.stageOrder - mb.stageOrder || a.id.localeCompare(b.id);
    })
    .slice(0, max);
}

export function diagnosticQueue(input: {
  profile: DiagnosticProfile;
  answers: StrategyAnswer[];
  context?: ApplicabilityContext;
}): DiagnosticQuestion[] {
  const starters = starterQuestions().filter((question) =>
    isApplicable(question.id, input.context),
  );
  const adaptive = selectAdaptiveQuestions(input);
  return [...starters, ...adaptive.filter((q) => !starters.some((s) => s.id === q.id))];
}
