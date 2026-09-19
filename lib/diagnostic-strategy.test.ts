import { describe, expect, it } from "vitest";
import metadata from "@/data/diagnostic-question-metadata-v1.1.json";
import {
  CoreScoreQuestionIds,
  StarterQuestionIds,
  diagnosticQueue,
  scoreAnchorQuestions,
} from "./diagnostic-strategy";

describe("Diagnostic strategy V1.1", () => {
  it("has 24 stable score anchors and 31 starting interactions", () => {
    expect(CoreScoreQuestionIds).toHaveLength(24);
    expect(scoreAnchorQuestions()).toHaveLength(24);
    expect(StarterQuestionIds).toHaveLength(31);
  });

  it("classifies all 144 canonical questions by purpose/stage/applicability", () => {
    expect(metadata.questions).toHaveLength(144);
    expect(
      metadata.questions.every(
        (q) => q.primaryPurpose && q.stageCode && q.applicability,
      ),
    ).toBe(true);
  });

  it("never includes legacy sponsored consent in the adaptive queue", () => {
    const queue = diagnosticQueue({
      profile: "FULL",
      answers: CoreScoreQuestionIds.map((questionId) => ({
        questionId,
        maturity: 0,
        confidence: 0.4,
        applicable: true,
        answerState: "ANSWERED" as const,
      })),
    });
    expect(queue.some((question) => question.id === "TAX-012")).toBe(false);
  });
});
