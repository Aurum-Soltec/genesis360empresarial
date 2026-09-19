import { describe, expect, it } from "vitest";
import { buildDeterministicGds, GdsRecordSchema } from "./gds";
describe("GDS", () => {
  it("does not invent root cause", () => {
    const r=buildDeterministicGds({painId:"p1",title:"Gap financeiro",dimension:"FIN",severity:.7,confidence:.8});
    expect(r.causeHypotheses).toHaveLength(0);
    expect(r.gaps).toContain("Causa-raiz ainda não validada.");
    expect(GdsRecordSchema.safeParse(r).success).toBe(true);
  });
});
