import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "./supabase/server";
import { requireTenantContext } from "./tenant-context";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("./supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));

const tenantId = "8f01d3cb-970d-4b08-b2e8-596a7ade2e9d";
const userId = "fbde780f-0354-41f8-bf0a-58188d1cd4e4";

function client({
  auth = { data: { user: { id: userId } }, error: null },
  membership = { data: { tenant_id: tenantId, role: "owner" }, error: null },
  quota = { data: [{ allowed: true }], error: null },
}: {
  auth?: { data: { user: { id: string } | null }; error: { status?: number; name?: string; code?: string } | null };
  membership?: { data: { tenant_id: string; role: string } | null; error: object | null };
  quota?: { data: Array<{ allowed: boolean }> | null; error: object | null };
} = {}) {
  const maybeSingle = vi.fn(async () => membership);
  const eq = vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle })) }));
  return {
    auth: { getUser: vi.fn(async () => auth) },
    from: vi.fn(() => ({ select: vi.fn(() => ({ eq })) })),
    rpc: vi.fn(async () => quota),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(cookies).mockResolvedValue({ get: () => ({ value: tenantId }) } as never);
});

describe("tenant context read failures", () => {
  it("reports numeric subphase durations without changing membership or quota decisions", async () => {
    const db = client();
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);
    const phases: Array<{ phase: string; durationMs: number }> = [];
    const context = await requireTenantContext("api.default", (phase, durationMs) => {
      phases.push({ phase, durationMs });
    });

    expect(context).toEqual({ userId, tenantId, role: "owner" });
    expect(phases.map(({ phase }) => phase).sort()).toEqual([
      "active_cookie", "auth_user", "membership", "quota",
    ]);
    expect(phases.every(({ durationMs }) => Number.isFinite(durationMs) && durationMs >= 0)).toBe(true);
    expect(db.rpc).toHaveBeenCalledWith("consume_tenant_quota", expect.objectContaining({
      p_tenant_id: tenantId, p_operation: "api.default",
    }));
  });

  it("keeps authorization independent of a failing telemetry observer", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client() as never);
    await expect(requireTenantContext("api.default", () => {
      throw new Error("OBSERVER_FAILED");
    })).resolves.toEqual({ userId, tenantId, role: "owner" });

    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      membership: { data: null, error: null },
    }) as never);
    await expect(requireTenantContext("api.default", () => {
      throw new Error("OBSERVER_FAILED");
    })).rejects.toThrow("TENANT_ACCESS_DENIED");
  });

  it("maps a missing Supabase browser session to 401 without hiding provider failures", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      auth: { data: { user: null }, error: { status: 400, name: "AuthSessionMissingError" } },
    }) as never);
    await expect(requireTenantContext()).rejects.toThrow("AUTH_REQUIRED");

    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      auth: { data: { user: null }, error: { status: 400, code: "validation_failed" } },
    }) as never);
    await expect(requireTenantContext()).rejects.toThrow("AUTH_PROVIDER_READ_FAILED");
  });

  it("keeps an expired session as an authentication failure", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      auth: { data: { user: null }, error: { status: 401 } },
    }) as never);
    await expect(requireTenantContext()).rejects.toThrow("AUTH_REQUIRED");
  });

  it("does not report an auth provider outage as an absent session", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      auth: { data: { user: null }, error: { status: 503 } },
    }) as never);
    await expect(requireTenantContext()).rejects.toThrow("AUTH_PROVIDER_READ_FAILED");
  });

  it("distinguishes membership read errors from access denial", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      membership: { data: null, error: { code: "DB_DOWN" } },
    }) as never);
    await expect(requireTenantContext()).rejects.toThrow("MEMBERSHIP_READ_FAILED");

    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      membership: { data: null, error: null },
    }) as never);
    await expect(requireTenantContext()).rejects.toThrow("TENANT_ACCESS_DENIED");
  });

  it("preserves quota enforcement after a valid membership", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client({
      quota: { data: [{ allowed: false }], error: null },
    }) as never);
    await expect(requireTenantContext()).rejects.toThrow("RATE_LIMIT_EXCEEDED");
  });
});
