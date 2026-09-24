import { beforeEach, describe, expect, it, vi } from "vitest";
import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";
import { GET, POST } from "./route";

vi.mock("@/lib/http-security", () => ({ assertSameOrigin: vi.fn(), readJsonBody: vi.fn() }));
vi.mock("@/lib/authz", () => ({ assertTenantPermission: vi.fn() }));
vi.mock("@/lib/tenant-context", () => ({ requireTenantContext: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));
vi.mock("@/lib/server/trusted-data-access", () => ({ trustedTenantRpc: vi.fn() }));

const tenantId = "8f01d3cb-970d-4b08-b2e8-596a7ade2e9d";
const companyId = "19f0a230-c90c-4c5b-869c-7e272d7c4e1d";
const factId = "f1642d30-e853-4ec1-89ac-f1d475bc4eea";
const context = { tenantId, userId: factId, role: "owner" };

function readClient(result: { data: unknown; error: unknown }) {
  const query = { eq: vi.fn(), is: vi.fn(), order: vi.fn(async () => result) };
  query.eq.mockReturnValue(query);
  query.is.mockReturnValue(query);
  const client = { from: vi.fn(() => ({ select: vi.fn(() => query) })) };
  return { client, query };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireTenantContext).mockResolvedValue(context as never);
  vi.mocked(readJsonBody).mockResolvedValue({
    companyId, factKey: "finance.forecast", value: { synthetic: true },
    source: "declared", sensitivity: "internal", purposeCodes: ["CORE_OPERATION"],
  });
  vi.mocked(trustedTenantRpc).mockResolvedValue({ data: factId, error: null } as never);
});

describe("passport facts timing boundary", () => {
  it("exposes only numeric authorized subphases and preserves the response contract", async () => {
    vi.mocked(requireTenantContext).mockImplementationOnce(async (_operation, observeTiming) => {
      observeTiming?.("auth_user", 123.456);
      observeTiming?.("active_cookie", 0.25);
      observeTiming?.("membership", 56.789);
      observeTiming?.("quota", 34.5);
      return context;
    });
    const { client } = readClient({ data: [], error: null });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);

    const response = await GET(new Request(`https://genesis.example/api/passport/facts?companyId=${companyId}`));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ facts: [] });
    const timing = response.headers.get("server-timing") ?? "";
    expect(timing).toMatch(/^tenant_context;dur=\d+\.\d{2}, auth_user;dur=123\.46, active_cookie;dur=0\.25, membership;dur=56\.79, quota;dur=34\.50, data_access;dur=\d+\.\d{2}$/);
    expect(timing).not.toContain(tenantId);
    expect(timing).not.toContain(companyId);
    expect(timing).not.toContain(factId);
  });

  it("reports only numeric context and read durations while preserving tenant and company filters", async () => {
    const { client, query } = readClient({ data: [{ id: factId }], error: null });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);

    const response = await GET(new Request(`https://genesis.example/api/passport/facts?companyId=${companyId}`));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ facts: [{ id: factId }] });
    expect(query.eq).toHaveBeenCalledWith("tenant_id", tenantId);
    expect(query.eq).toHaveBeenCalledWith("company_id", companyId);
    const timing = response.headers.get("server-timing");
    expect(timing).toMatch(/^tenant_context;dur=\d+\.\d{2}, data_access;dur=\d+\.\d{2}$/);
    expect(timing).not.toContain(tenantId);
    expect(timing).not.toContain(companyId);
  });

  it("times the trusted write without changing its authorization or response", async () => {
    const response = await POST(new Request("https://genesis.example/api/passport/facts", { method: "POST" }));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ fact: { id: factId } });
    expect(assertSameOrigin).toHaveBeenCalled();
    expect(assertTenantPermission).toHaveBeenCalledWith("owner", "passport:write");
    expect(trustedTenantRpc).toHaveBeenCalledWith(context, "record_business_fact", expect.objectContaining({
      p_company_id: companyId, p_fact_key: "finance.forecast",
    }));
    expect(response.headers.get("server-timing")).toMatch(/^tenant_context;dur=\d+\.\d{2}, data_access;dur=\d+\.\d{2}$/);
  });

  it("retains fail-closed statuses and does not claim data-access timing before authorization", async () => {
    vi.mocked(requireTenantContext).mockImplementationOnce(async (_operation, observeTiming) => {
      observeTiming?.("auth_user", 42);
      throw new Error("AUTH_REQUIRED");
    });
    const denied = await POST(new Request("https://genesis.example/api/passport/facts", { method: "POST" }));
    expect(denied.status).toBe(401);
    expect(await denied.json()).toEqual({ error: "AUTH_REQUIRED" });
    expect(denied.headers.get("server-timing")).toMatch(/^tenant_context;dur=\d+\.\d{2}$/);
    expect(denied.headers.get("server-timing")).not.toContain("auth_user");
    expect(trustedTenantRpc).not.toHaveBeenCalled();

    const { client } = readClient({ data: null, error: { code: "DB_DOWN" } });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    const failed = await GET(new Request(`https://genesis.example/api/passport/facts?companyId=${companyId}`));
    expect(failed.status).toBe(500);
    expect(await failed.json()).toEqual({ error: "PASSPORT_READ_FAILED" });
    expect(failed.headers.get("server-timing")).toContain("data_access;dur=");
  });
});
