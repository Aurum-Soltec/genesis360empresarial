import { describe, expect, it } from "vitest";
import { BusinessFactInputSchema } from "@/lib/business-passport";
import { EvidenceInputSchema } from "@/lib/evidence";

const companyId = "6f4e4ed0-0110-4132-8988-50c7b8d2c711";
const fact = { companyId, factKey: "finance.cash", value: 12 };
describe("public declaration contracts", () => {
  it("defaults to declared without auto-confidence", () => {
    const parsed = BusinessFactInputSchema.parse(fact);
    expect(parsed.source).toBe("declared");
    expect(parsed.confidence).toBeUndefined();
  });
  for (const source of ["verified", "inferred", "imported"]) {
    it(`rejects untrusted provenance ${source}`, () => {
      expect(BusinessFactInputSchema.safeParse({ ...fact, source }).success).toBe(false);
    });
  }
  it("rejects user-supplied confidence and verification status", () => {
    expect(BusinessFactInputSchema.safeParse({ ...fact, confidence: 1 }).success).toBe(false);
    expect(BusinessFactInputSchema.safeParse({ ...fact, verification_status: "verified" }).success).toBe(false);
  });
  it("requires a value, even with Zod unknown", () => {
    expect(BusinessFactInputSchema.safeParse({ companyId, factKey: "finance.cash" }).success).toBe(false);
  });
  for (const evidenceType of ["agent_output", "integration", "document"]) {
    it(`rejects unavailable trusted evidence ${evidenceType}`, () => {
      expect(EvidenceInputSchema.safeParse({ companyId, evidenceType, summary: "Evidence" }).success).toBe(false);
    });
  }
  it("rejects the verifies relationship on public input", () => {
    expect(EvidenceInputSchema.safeParse({
      companyId, evidenceType: "user_declaration", summary: "Evidence",
      link: { subjectType: "diagnostic", subjectId: companyId, relation: "verifies" },
    }).success).toBe(false);
  });
});
