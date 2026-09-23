import { beforeEach, describe, expect, it, vi } from "vitest";
import DiagnosticoPage from "./diagnostico/page";
import ResultadoPage from "./resultado/page";
import ReferralPage from "./referral/page";
import TaxPage from "./cto-tax/page";
import EcossistemaPage from "./ecossistema/page";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { getFeatureFlags } from "@/lib/feature-flags";

vi.mock("next/navigation", () => ({
  redirect: (destination: string) => { throw new Error(`REDIRECT:${destination}`); },
  notFound: () => { throw new Error("NOT_FOUND"); },
}));
vi.mock("@/lib/page-tenant-context", () => ({
  requirePageTenantContext: vi.fn(async () => ({ tenantId: "tenant-a" })),
}));
vi.mock("@/lib/feature-flags", () => ({
  getFeatureFlags: vi.fn(() => ({ tax: false, ecosystem: false })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("legacy public routes", () => {
  it("guards diagnosis before redirecting to the current questionnaire", async () => {
    await expect(DiagnosticoPage()).rejects.toThrow("REDIRECT:/diagnostico-v1");
    expect(requirePageTenantContext).toHaveBeenCalledWith("/diagnostico");
  });

  it("guards result and preserves only a valid diagnostic identifier", async () => {
    const id = "36bf0d7d-0f71-4a09-957d-635587c27e2a";
    await expect(ResultadoPage({ searchParams: Promise.resolve({ diagnostic: id }) }))
      .rejects.toThrow(`REDIRECT:/resultado-v1?diagnostic=${id}`);
    expect(requirePageTenantContext).toHaveBeenCalledWith(`/resultado-v1?diagnostic=${id}`);
    vi.mocked(requirePageTenantContext).mockClear();
    await expect(ResultadoPage({ searchParams: Promise.resolve({ diagnostic: "invalid" }) }))
      .rejects.toThrow("REDIRECT:/resultado-v1");
    expect(requirePageTenantContext).toHaveBeenCalledWith("/resultado-v1");
  });

  it("guards referral before routing to the qualified solutions explanation", async () => {
    await expect(ReferralPage()).rejects.toThrow("REDIRECT:/solucoes");
    expect(requirePageTenantContext).toHaveBeenCalledWith("/referral");
  });

  it("keeps tax and ecosystem surfaces closed when their flags are off", async () => {
    await expect(TaxPage()).rejects.toThrow("NOT_FOUND");
    await expect(EcossistemaPage()).rejects.toThrow("NOT_FOUND");
    expect(getFeatureFlags).toHaveBeenCalledTimes(2);
    expect(requirePageTenantContext).not.toHaveBeenCalled();
  });
});
