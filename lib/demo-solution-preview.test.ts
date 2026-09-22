import { describe, expect, it } from "vitest";
import { buildDemoSolutionPreview, canAccessDemoAdministration } from "./demo-solution-preview";

describe("controlled solution preview", () => {
  it("selects the three weakest known dimensions deterministically", () => {
    const result = buildDemoSolutionPreview([
      { dimension: "FIN", score: 42 },
      { dimension: "OPE", score: 35 },
      { dimension: "VEN", score: 51 },
      { dimension: "TEC", score: 77 },
    ]);
    expect(result.map((item) => item.dimension)).toEqual(["OPE", "FIN", "VEN"]);
    expect(result.every((item) => item.fictional && !item.contactEnabled)).toBe(true);
    expect(result[0].explanation).toContain("não passou por qualificação real");
  });

  it("ignores unknown, null and non-finite scores", () => {
    expect(buildDemoSolutionPreview([
      { dimension: "FIN", score: null },
      { dimension: "UNKNOWN", score: 10 },
      { dimension: "TEC", score: Number.NaN },
    ])).toEqual([]);
  });

  it("limits the demonstration administration to owner and admin", () => {
    expect(canAccessDemoAdministration("owner")).toBe(true);
    expect(canAccessDemoAdministration("admin")).toBe(true);
    expect(canAccessDemoAdministration("manager")).toBe(false);
    expect(canAccessDemoAdministration("auditor")).toBe(false);
  });
});
