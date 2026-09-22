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

  it("uses the dimension code to break score ties consistently", () => {
    const plan = buildExecutivePlan([
      { dimension: "PES", score: 50 },
      { dimension: "MKT", score: 50 },
      { dimension: "JUR", score: 50 },
      { dimension: "INO", score: 50 },
      { dimension: "OPE", score: 50 },
    ]);
    expect(plan.map((item) => item.dimension)).toEqual(["Inovação", "Jurídico", "Marketing"]);
  });

  it("never presents unverified evidence as validated", () => {
    expect(evidenceQualityMessage(3, 0)).toMatch(/não verificadas/i);
    expect(evidenceQualityMessage(0, 0)).toMatch(/respostas declaradas/i);
  });
});
