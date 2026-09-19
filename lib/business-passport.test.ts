import { describe, expect, it } from "vitest";
import { BusinessFactInputSchema, passportCompleteness } from "./business-passport";

describe("Business Passport", () => {
  it("calculates completeness deterministically", () => {
    expect(passportCompleteness(["a", "c"], ["a", "b", "c", "d"])).toBe(0.5);
  });

  it("rejects invalid confidence", () => {
    expect(BusinessFactInputSchema.safeParse({
      companyId: "c1e7ad08-2f65-4b7a-8f86-bf4bb87cb1df",
      factKey: "identity.sector",
      value: "servicos",
      source: "declared",
      confidence: 2,
      sensitivity: "internal",
      purposeCodes: ["CORE_OPERATION"],
    }).success).toBe(false);
  });
});
