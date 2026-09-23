import { describe, expect, it } from "vitest";
import {
  hasPassportValue,
  passportDateLabel,
  readablePassportValue,
  timelineEventPresentation,
  timelinePageNumber,
} from "./passport-presentation";

describe("Passport and Timeline presentation", () => {
  it("counts zero and false as real information but ignores blank values", () => {
    expect(hasPassportValue(0)).toBe(true);
    expect(hasPassportValue(false)).toBe(true);
    expect(hasPassportValue("  ")).toBe(false);
    expect(hasPassportValue(null)).toBe(false);
    expect(hasPassportValue({})).toBe(false);
  });

  it("protects financial and personal values and does not expose JSON objects", () => {
    expect(readablePassportValue("R$ 1.000", "financial")).toBe("Valor protegido");
    expect(readablePassportValue("Nome de pessoa", "personal")).toBe("Valor protegido");
    expect(readablePassportValue({ hidden: "detail" }, "internal")).toBe("Valor estruturado registrado");
    expect(readablePassportValue(false, "internal")).toBe("Não");
  });

  it("uses human labels instead of internal IDs or arbitrary payload in the Timeline", () => {
    expect(timelineEventPresentation("passport.fact.updated", { factKey: "identity.sector" })).toEqual({
      title: "Informação atualizada no Passport",
      detail: "Setor de atuação",
      href: "/passaporte",
    });
    const unknown = timelineEventPresentation("internal.event", { factKey: "financial.secret", subjectId: "uuid-secret" });
    expect(JSON.stringify(unknown)).not.toContain("uuid-secret");
    expect(JSON.stringify(unknown)).not.toContain("financial.secret");
    expect(unknown.href).toBeNull();
  });

  it("formats date consistently and fails closed for invalid timestamps", () => {
    expect(passportDateLabel("2026-09-23T12:00:00Z")).toContain("23 de set.");
    expect(passportDateLabel("not-a-date")).toBe("Data não registrada");
  });

  it("accepts only bounded, explicit Timeline pages", () => {
    expect(timelinePageNumber("2")).toBe(2);
    expect(timelinePageNumber("0")).toBe(1);
    expect(timelinePageNumber("9999999")).toBe(1);
    expect(timelinePageNumber(["1", "2"])).toBe(1);
  });
});
