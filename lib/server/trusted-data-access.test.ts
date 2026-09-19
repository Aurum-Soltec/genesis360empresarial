import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingle = vi.fn();
const rpc = vi.fn();
const query: Record<string, unknown> = {};
query.select = vi.fn(() => query);
query.eq = vi.fn(() => query);
query.maybeSingle = maybeSingle;
const admin = { from: vi.fn(() => query), rpc };

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => admin,
}));

import { trustedTenantRpc } from "./trusted-data-access";

const tenantA = "10000000-0000-4000-8000-000000000001";
const tenantB = "20000000-0000-4000-8000-000000000002";
const user = "30000000-0000-4000-8000-000000000003";
const ctx = { tenantId: tenantA, userId: user, role: "owner" };

describe("trusted data access boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    maybeSingle.mockResolvedValue({
      data: { tenant_id: tenantA, user_id: user, role: "owner" },
      error: null,
    });
    rpc.mockResolvedValue({ data: "ok", error: null });
  });

  it("overwrites a forged tenant and actor before executing an allowed RPC", async () => {
    await trustedTenantRpc(ctx, "record_evidence", {
      p_tenant_id: tenantB,
      p_created_by: "40000000-0000-4000-8000-000000000004",
      p_company_id: "50000000-0000-4000-8000-000000000005",
    });

    expect(rpc).toHaveBeenCalledWith(
      "record_evidence",
      expect.objectContaining({
        p_tenant_id: tenantA,
        p_created_by: user,
      }),
    );
  });

  it("rejects a forged or stale role even when the user belongs to the tenant", async () => {
    maybeSingle.mockResolvedValue({
      data: { tenant_id: tenantA, user_id: user, role: "member" },
      error: null,
    });

    await expect(
      trustedTenantRpc(ctx, "record_business_fact", {}),
    ).rejects.toThrow("TRUSTED_CONTEXT_DENIED");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects missing or malformed tenant context before opening privileged access", async () => {
    await expect(
      trustedTenantRpc({ ...ctx, tenantId: "" }, "record_business_fact", {}),
    ).rejects.toThrow("TRUSTED_CONTEXT_INVALID");
    expect(admin.from).not.toHaveBeenCalled();
  });

  it("checks the selected tenant for a multi-tenant user", async () => {
    await trustedTenantRpc(ctx, "create_mission_from_decision", {
      p_decision_record_id: "60000000-0000-4000-8000-000000000006",
    });

    expect(query.eq).toHaveBeenCalledWith("tenant_id", tenantA);
    expect(query.eq).toHaveBeenCalledWith("user_id", user);
  });
});
