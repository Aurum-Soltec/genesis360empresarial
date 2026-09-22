import { describe, expect, it } from "vitest";
import { DemoEvidenceTemplates, demoEvidenceAlreadyLoaded } from "./demo-scenario";

describe("controlled demo scenario", () => {
  it("ships only fictional, explicitly marked evidence", () => {
    expect(DemoEvidenceTemplates).toHaveLength(3);
    for (const item of DemoEvidenceTemplates) {
      expect(item.sourceRef.startsWith("DEMO:")).toBe(true);
      expect(item.payload.demo).toBe(true);
      expect(item.payload.disclaimer).toMatch(/fictícios/i);
    }
  });

  it("recognizes a fully loaded package", () => {
    expect(demoEvidenceAlreadyLoaded(DemoEvidenceTemplates.map((item) => item.sourceRef))).toBe(true);
    expect(demoEvidenceAlreadyLoaded([DemoEvidenceTemplates[0].sourceRef])).toBe(false);
  });
});
