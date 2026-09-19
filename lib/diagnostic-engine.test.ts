import { describe, expect, it } from "vitest";
import essential from "@/data/diagnostic-essential-v1.json";
import {
  CoreScoreQuestionIds,
  StarterQuestionIds,
  questionBank,
  scoreAnchorQuestions,
} from "./diagnostic-engine";

describe("Diagnostic V1.1 compatibility", () => {
  it("preserves canonical 144-question library", () => {
    expect(questionBank()).toHaveLength(144);
  });

  it("starts with 31 high-yield interactions, not an inflated fixed form", () => {
    expect(StarterQuestionIds).toHaveLength(31);
    expect(essential.questionIds).toEqual(StarterQuestionIds);
  });

  it("keeps a stable 24-question score anchor set", () => {
    expect(CoreScoreQuestionIds).toHaveLength(24);
    expect(scoreAnchorQuestions()).toHaveLength(24);
  });
});
