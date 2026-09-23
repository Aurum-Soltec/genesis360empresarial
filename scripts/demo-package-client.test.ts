import { describe, expect, it, vi } from "vitest";
import { requestDemoEvidencePackage } from "./demo-package-client.mjs";

const companyId = "11111111-1111-4111-8111-111111111111";
const diagnosticId = "22222222-2222-4222-8222-222222222222";
const evidenceIds = [
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
];

describe("demo preparation evidence package", () => {
  it("requests only the fixed server-owned package and accepts a complete fictional response", async () => {
    const apiJson = vi.fn(async () => ({ evidenceIds, created: 3, fictional: true }));
    const page = {};

    await expect(requestDemoEvidencePackage(apiJson, page, companyId, diagnosticId))
      .resolves.toEqual(evidenceIds);
    expect(apiJson).toHaveBeenCalledExactlyOnceWith(page, "POST", "/api/demo/evidence", {
      companyId,
      diagnosticId,
    });
  });

  it("accepts an idempotent rerun without creating duplicate sources", async () => {
    const apiJson = vi.fn(async () => ({ evidenceIds, created: 0, fictional: true }));
    await expect(requestDemoEvidencePackage(apiJson, {}, companyId, diagnosticId))
      .resolves.toEqual(evidenceIds);
  });

  it("fails closed when the server rejects a conflicting historical source", async () => {
    const apiJson = vi.fn(async () => {
      throw new Error("POST /api/demo/evidence failed (409): DEMO_SOURCE_CONFLICT");
    });
    await expect(requestDemoEvidencePackage(apiJson, {}, companyId, diagnosticId))
      .rejects.toThrow("DEMO_SOURCE_CONFLICT");
    expect(apiJson).toHaveBeenCalledTimes(1);
  });

  it.each([
    { evidenceIds: evidenceIds.slice(0, 2), created: 2, fictional: true },
    { evidenceIds: [evidenceIds[0], evidenceIds[0], evidenceIds[2]], created: 1, fictional: true },
    { evidenceIds, created: 3, fictional: false },
    { evidenceIds, created: 4, fictional: true },
  ])("rejects an incomplete or inconsistent server package: %j", async (result) => {
    const apiJson = vi.fn(async () => result);
    await expect(requestDemoEvidencePackage(apiJson, {}, companyId, diagnosticId))
      .rejects.toThrow("canonical fictional evidence package was not confirmed");
  });
});
