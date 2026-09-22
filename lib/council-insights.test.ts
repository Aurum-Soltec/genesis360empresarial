import { describe, expect, it } from "vitest";
import { buildCouncilBrief } from "./council-insights";

describe("deterministic council brief", () => {
  it("orders the weakest dimensions and preserves evidence uncertainty", () => {
    const brief = buildCouncilBrief({
      companyName: "Empresa Aurora", growthScore: 55, confidence: 78,
      scores: [
        { dimension: "FIN", score: 40, confidence: 70 },
        { dimension: "EST", score: 70, confidence: 80 },
        { dimension: "OPE", score: 50, confidence: 75 },
      ],
      pains: [{ title: "Previsibilidade limitada", gapSummary: null }],
      evidenceCount: 3, verifiedEvidenceCount: 0,
    });
    expect(brief[0].answer).toContain("Financeiro e Operações");
    expect(brief[1].answer).toContain("ainda não foram verificadas");
    expect(brief[2].citations).toContain("evidence_items");
  });
});
