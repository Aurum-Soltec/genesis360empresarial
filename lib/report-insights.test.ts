import { describe, expect, it } from "vitest";
import { buildExecutivePlan, evidenceQualityMessage } from "./report-insights";

describe("executive report insights", () => {
  it("builds a deterministic 90-day plan from the weakest known scores", () => {
    const plan = buildExecutivePlan([
      { dimension: "EST", score: 75 }, { dimension: "FIN", score: 35 },
      { dimension: "OPE", score: 50 }, { dimension: "TEC", score: null },
    ]);
    expect(plan.map((item) => item.dimension)).toEqual(["Financeiro", "Operações", "Estratégia"]);
    expect(plan.map((item) => item.horizon)).toEqual(["0–30 dias", "31–60 dias", "61–90 dias"]);
  });

  it("never presents unverified evidence as validated", () => {
    expect(evidenceQualityMessage(3, 0)).toMatch(/não verificadas/i);
    expect(evidenceQualityMessage(0, 0)).toMatch(/respostas declaradas/i);
  });
});
