import { afterEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import { requireTenantContext } from "@/lib/tenant-context";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  }),
}));

vi.mock("@/lib/tenant-context", () => ({
  requireTenantContext: vi.fn(),
}));

describe("requirePageTenantContext", () => {
  afterEach(() => vi.clearAllMocks());

  it("sends unauthenticated users to login and preserves their destination", async () => {
    vi.mocked(requireTenantContext).mockRejectedValueOnce(new Error("AUTH_REQUIRED"));
    const destination = "/resultado-v1?diagnostic=example-id";

    await expect(requirePageTenantContext(destination)).rejects.toThrow("NEXT_REDIRECT:");
    expect(redirect).toHaveBeenCalledWith(
      `/entrar?next=${encodeURIComponent(destination)}`,
    );
  });

  it.each(["ACTIVE_TENANT_REQUIRED", "TENANT_ACCESS_DENIED"])(
    "sends %s to company selection and preserves the destination",
    async (code) => {
      vi.mocked(requireTenantContext).mockRejectedValueOnce(new Error(code));
      const destination = "/diagnostico-v1";

      await expect(requirePageTenantContext(destination)).rejects.toThrow("NEXT_REDIRECT:");
      expect(redirect).toHaveBeenCalledWith(
        `/selecionar-empresa?next=${encodeURIComponent(destination)}`,
      );
    },
  );

  it("keeps non-auth operational failures visible instead of redirecting home", async () => {
    const failure = new Error("RATE_LIMIT_CHECK_FAILED");
    vi.mocked(requireTenantContext).mockRejectedValueOnce(failure);

    await expect(requirePageTenantContext("/missoes")).rejects.toBe(failure);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("forwards optional timing observation without weakening authorization", async () => {
    const observe = vi.fn();
    const context = { tenantId: "tenant-a", userId: "user-a", role: "owner" };
    vi.mocked(requireTenantContext).mockResolvedValueOnce(context);

    await expect(requirePageTenantContext("/", "api.default", observe)).resolves.toEqual(context);
    expect(requireTenantContext).toHaveBeenCalledWith("api.default", observe);
  });
});
