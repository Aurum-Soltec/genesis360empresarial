import { describe, expect, it } from "vitest";
import {
  calculateDiagnosticConfidence,
  progressPercent,
} from "./diagnostic-confidence";
import { CoreScoreQuestionIds } from "./diagnostic-strategy";

describe("Diagnostic confidence V1.1", () => {
  it("keeps progress monotonic before adaptive phase", () => {
    expect(
      progressPercent({
        starterSeen: 15,
        starterTotal: 31,
        adaptiveSeen: 0,
        adaptiveTotal: 0,
      }),
    ).toBeLessThanOrEqual(85);
    expect(
      progressPercent({
        starterSeen: 31,
        starterTotal: 31,
        adaptiveSeen: 0,
        adaptiveTotal: 4,
      }),
    ).toBe(85);
  });

  it("does not interpret unknown as low maturity", () => {
    const answer = calculateDiagnosticConfidence(
      CoreScoreQuestionIds.slice(0, 3).map((questionId) => ({
        questionId,
        answerState: "UNKNOWN" as const,
        applicable: true,
        completenessScore: 0,
        evidenceStrength: 0,
        consistencyScore: 0.5,
        freshnessScore: 0.5,
      })),
    );
    expect(answer.breakdown.criticalCoverage).toBe(0);
    expect(answer.recommendations.length).toBeGreaterThan(0);
  });

  it("confidence rises with completeness and evidence", () => {
    const weak = calculateDiagnosticConfidence(
      CoreScoreQuestionIds.map((questionId) => ({
        questionId,
        answerState: "ANSWERED" as const,
        applicable: true,
        completenessScore: 0.6,
        evidenceStrength: 0.35,
        consistencyScore: 0.5,
        freshnessScore: 0.6,
      })),
    );
    const strong = calculateDiagnosticConfidence(
      CoreScoreQuestionIds.map((questionId) => ({
        questionId,
        answerState: "ANSWERED" as const,
        applicable: true,
        completenessScore: 1,
        evidenceStrength: 0.9,
        consistencyScore: 0.9,
        freshnessScore: 1,
      })),
    );
    expect(strong.score).toBeGreaterThan(weak.score);
  });
});
