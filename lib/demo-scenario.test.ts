import { describe, expect, it } from "vitest";
import { DemoEvidenceTemplates, canonicalDemoEvidenceCount, demoEvidenceAlreadyLoaded, demoEvidenceLoadedCount, isCanonicalDemoEvidence, isCanonicalDemoEvidenceRecord } from "./demo-scenario";

describe("controlled demo scenario", () => {
  it("ships only fictional, explicitly marked evidence", () => {
    expect(DemoEvidenceTemplates).toHaveLength(3);
    for (const item of DemoEvidenceTemplates) {
      expect(item.sourceRef.startsWith("DEMO:")).toBe(true);
      expect(item.payload.demo).toBe(true);
      expect(item.payload.disclaimer).toMatch(/fictícios/i);
    }
  });

  it("counts a demo source only when content, purpose and status match its template", () => {
    const template = DemoEvidenceTemplates[0];
    const valid = {
      source_ref: template.sourceRef,
      evidence_type: template.evidenceType,
      summary: template.summary,
      payload: { ...template.payload },
      sensitivity: template.sensitivity,
      purpose_codes: ["DEMO_CONTROLLED"],
      verification_status: "unverified",
    };
    expect(isCanonicalDemoEvidenceRecord(valid)).toBe(true);
    expect(canonicalDemoEvidenceCount([valid, valid])).toBe(1);
    expect(isCanonicalDemoEvidenceRecord({ ...valid, payload: { ...valid.payload, content: "Outro conteúdo" } })).toBe(false);
    expect(isCanonicalDemoEvidenceRecord({ ...valid, purpose_codes: ["CORE_OPERATION"] })).toBe(false);
    expect(isCanonicalDemoEvidenceRecord({ ...valid, verification_status: "verified" })).toBe(false);
  });

  it("recognizes a fully loaded package", () => {
    expect(demoEvidenceAlreadyLoaded(DemoEvidenceTemplates.map((item) => item.sourceRef))).toBe(true);
    expect(demoEvidenceAlreadyLoaded([DemoEvidenceTemplates[0].sourceRef])).toBe(false);
  });

  it("counts canonical sources once and ignores legacy demo records", () => {
    expect(demoEvidenceLoadedCount([
      DemoEvidenceTemplates[0].sourceRef,
      DemoEvidenceTemplates[0].sourceRef,
      DemoEvidenceTemplates[1].sourceRef,
      "DEMO:legacy-record",
      `${DemoEvidenceTemplates[0].sourceRef}-extra`,
      null,
    ])).toBe(2);
    expect(isCanonicalDemoEvidence(DemoEvidenceTemplates[0].sourceRef)).toBe(true);
    expect(isCanonicalDemoEvidence("DEMO:legacy-record")).toBe(false);
    expect(isCanonicalDemoEvidence(`${DemoEvidenceTemplates[0].sourceRef}-extra`)).toBe(false);
  });
});
