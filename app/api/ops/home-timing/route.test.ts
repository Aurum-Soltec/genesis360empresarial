import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadDashboardOverview } from "@/lib/dashboard-overview";
import { requireTenantContext } from "@/lib/tenant-context";
import { GET } from "./route";

vi.mock("@/lib/dashboard-overview", () => ({ loadDashboardOverview: vi.fn() }));
vi.mock("@/lib/tenant-context", () => ({ requireTenantContext: vi.fn() }));

const context = {
  tenantId: "8f01d3cb-970d-4b08-b2e8-596a7ade2e9d",
  userId: "fbde780f-0354-41f8-bf0a-58188d1cd4e4",
  role: "owner",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("HSP4_PERF_TRACE", "1");
  vi.mocked(requireTenantContext).mockResolvedValue(context);
  vi.mocked(loadDashboardOverview).mockResolvedValue(null);
});
afterEach(() => vi.unstubAllEnvs());

describe("HSP-4 Home response timing probe", () => {
  it("stays absent when the operational switch is off", async () => {
    vi.stubEnv("HSP4_PERF_TRACE", "0");
    const response = await GET();

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("server-timing")).toBeNull();
    expect(requireTenantContext).not.toHaveBeenCalled();
    expect(loadDashboardOverview).not.toHaveBeenCalled();
  });

  it("measures the authorized Home read with numeric-only response headers", async () => {
    vi.mocked(requireTenantContext).mockImplementationOnce(async (_operation, observe) => {
      observe?.("auth_user", 128.456);
      observe?.("active_cookie", 0.25);
      observe?.("membership", 151.789);
      observe?.("quota", 147.2);
      return context;
    });
    vi.mocked(loadDashboardOverview).mockImplementationOnce(async (_context, observe) => {
      observe?.("company_selection", 140.12);
      observe?.("diagnostic", 148.23);
      observe?.("pains", 150.34);
      return null;
    });

    const response = await GET();
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({ measured: true, timings_ms: {
      total: expect.any(Number), tenant_context: expect.any(Number),
      auth_user: 128.46, active_cookie: 0.25, membership: 151.79, quota: 147.2,
      dashboard: expect.any(Number), company_selection: 140.12,
      diagnostic: 148.23, pains: 150.34,
    } });
    expect(Object.values(payload.timings_ms).every((duration) =>
      typeof duration === "number" && Number.isFinite(duration) && duration >= 0)).toBe(true);
    expect(JSON.stringify(payload)).not.toContain(context.tenantId);
    expect(JSON.stringify(payload)).not.toContain(context.userId);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(requireTenantContext).toHaveBeenCalledWith("api.default", expect.any(Function));
    expect(loadDashboardOverview).toHaveBeenCalledWith(context, expect.any(Function));
    const timing = response.headers.get("server-timing") ?? "";
    expect(timing).toMatch(/^total;dur=\d+\.\d{2}, tenant_context;dur=\d+\.\d{2}, auth_user;dur=128\.46, active_cookie;dur=0\.25, membership;dur=151\.79, quota;dur=147\.20, dashboard;dur=\d+\.\d{2}, company_selection;dur=140\.12, diagnostic;dur=148\.23, pains;dur=150\.34$/);
    expect(timing).not.toContain(context.tenantId);
    expect(timing).not.toContain(context.userId);
  });

  it("omits non-finite phase observations from both numeric outputs", async () => {
    vi.mocked(loadDashboardOverview).mockImplementationOnce(async (_context, observe) => {
      observe?.("company_selection", Number.NaN);
      observe?.("diagnostic", Number.POSITIVE_INFINITY);
      observe?.("pains", 12.345);
      return null;
    });
    const response = await GET();
    const payload = await response.json();
    expect(payload.timings_ms).not.toHaveProperty("company_selection");
    expect(payload.timings_ms).not.toHaveProperty("diagnostic");
    expect(payload.timings_ms.pains).toBe(12.35);
    expect(response.headers.get("server-timing")).not.toMatch(/NaN|Infinity|company_selection|diagnostic/);
  });

  it.each([
    ["AUTH_REQUIRED", 401],
    ["TENANT_ACCESS_DENIED", 403],
    ["RATE_LIMIT_EXCEEDED", 429],
  ])("preserves fail-closed %s without emitting protected timings", async (code, status) => {
    vi.mocked(requireTenantContext).mockRejectedValueOnce(new Error(String(code)));
    const response = await GET();

    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ error: code });
    expect(response.headers.get("server-timing")).toBeNull();
    expect(loadDashboardOverview).not.toHaveBeenCalled();
  });

  it("does not expose business or provider errors if the Home read fails", async () => {
    vi.mocked(loadDashboardOverview).mockRejectedValueOnce(new Error("DASHBOARD_READ_FAILED"));
    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "INTERNAL_ERROR" });
    expect(response.headers.get("server-timing")).toBeNull();
  });
});
