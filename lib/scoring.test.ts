import { describe, expect, it } from "vitest";
import { calculateDimensionScore } from "@/lib/scoring";
import type { DiagnosticQuestion } from "@/lib/types";

const questions: DiagnosticQuestion[] = [
  { id: "Q1", dimension: "EST", phase: "E", prompt: "A", responseType: "Escala", evidenceSuggestions: [], weight: 3, attentionSignal: "" },
  { id: "Q2", dimension: "EST", phase: "E", prompt: "B", responseType: "Escala", evidenceSuggestions: [], weight: 2, attentionSignal: "" },
];

describe("calculateDimensionScore", () => {
  it("returns insufficient data below 60% coverage", () => {
    const result = calculateDimensionScore(questions, []);
    expect(result.status).toBe("insufficient_data");
    expect(result.score).toBeNull();
  });

  it("calculates deterministic weighted score and confidence", () => {
    const result = calculateDimensionScore(questions, [
      { questionId: "Q1", maturity: 4, confidence: 0.9, applicable: true },
      { questionId: "Q2", maturity: 2, confidence: 0.5, applicable: true },
    ]);
    expect(result.status).toBe("scored");
    expect(result.score).toBe(80);
    expect(result.coverage).toBe(100);
    expect(result.confidence).toBe(74);
  });
});
