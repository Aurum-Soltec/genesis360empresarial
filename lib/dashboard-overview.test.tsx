import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { headers } from "next/headers";
import DashboardPage from "@/app/page";
import { loadDashboardOverview } from "@/lib/dashboard-overview";
import { createSupabaseServerClient } from "@/lib/supabase/server";

vi.mock("@/components/app-shell", () => ({
  AppShell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/lib/page-tenant-context", () => ({
  requirePageTenantContext: vi.fn(async () => ({
    tenantId: "tenant-a", userId: "user-a", role: "owner",
  })),
}));
vi.mock("@/lib/feature-flags", () => ({ isDemoTenantAllowed: vi.fn(() => false) }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ "x-correlation-id": "hsp4-probe" })),
}));

const context = { tenantId: "tenant-a", userId: "user-a", role: "owner" };

function dashboardDb(withDiagnostic: boolean) {
  const filters: Record<string, Array<[string, unknown]>> = {
    companies: [], diagnostics: [], pain_findings: [],
  };
  const from = vi.fn((table: string) => {
    if (table === "companies") {
      const query = {
        eq: vi.fn((column: string, value: unknown) => {
          filters.companies.push([column, value]); return query;
        }),
        limit: vi.fn(async () => ({
          data: [{ id: "company-a", trade_name: "Empresa Alfa", sector: null, fictional: false }],
          error: null,
        })),
      };
      return { select: vi.fn(() => query) };
    }
    if (table === "diagnostics") {
      const query = {
        eq: vi.fn((column: string, value: unknown) => {
          filters.diagnostics.push([column, value]); return query;
        }),
        order: vi.fn(() => query), limit: vi.fn(() => query),
        maybeSingle: vi.fn(async () => ({
          data: withDiagnostic ? {
            id: "diagnostic-a", growth_score: 68, growth_score_status: "valid",
            confidence: 77, confidence_rule_version: "v1",
          } : null,
          error: null,
        })),
      };
      return { select: vi.fn(() => query) };
    }
    if (table === "pain_findings") {
      const query = {
        eq: vi.fn((column: string, value: unknown) => {
          filters.pain_findings.push([column, value]); return query;
        }),
        order: vi.fn(() => query), limit: vi.fn(() => query),
        then: (resolve: (value: unknown) => unknown) => Promise.resolve({
          data: [{
            id: "pain-a", title: "Capital de giro", gap_summary: "Rever prazo médio",
            severity: 0.8, confidence: 0.7,
          }],
          error: null,
        }).then(resolve),
      };
      return { select: vi.fn(() => query) };
    }
    throw new Error(`Unexpected read: ${table}`);
  });
  return { from, filters };
}

beforeEach(() => { vi.clearAllMocks(); vi.unstubAllEnvs(); });

describe("executive Home reads", () => {
  it("renders the same score and next action without unused data reads", async () => {
    const db = dashboardDb(true);
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);

    const data = await loadDashboardOverview(context);
    const html = renderToStaticMarkup(await DashboardPage());

    expect(data).toEqual({
      companyName: "Empresa Alfa", latestDiagnosticId: "diagnostic-a",
      growthScore: 68, confidencePercent: 77, growthScoreStatus: "valid",
      pains: [{
        id: "pain-a", title: "Capital de giro", gap_summary: "Rever prazo médio",
        severity: 0.8, confidence: 0.7,
      }],
    });
    expect(html).toContain("Empresa Alfa");
    expect(html).toContain("Capital de giro");
    expect(html).toContain("68<small>/100</small>");
    expect(html).toContain("77%");
    expect(db.from.mock.calls.map(([table]) => table)).toEqual([
      "companies", "diagnostics", "pain_findings",
      "companies", "diagnostics", "pain_findings",
    ]);
    expect(db.filters.diagnostics).toContainEqual(["tenant_id", "tenant-a"]);
    expect(db.filters.diagnostics).toContainEqual(["company_id", "company-a"]);
    expect(db.filters.pain_findings).toContainEqual(["tenant_id", "tenant-a"]);
    expect(db.filters.pain_findings).toContainEqual(["diagnostic_id", "diagnostic-a"]);
  });

  it("keeps the first-reading empty state without a scored diagnostic", async () => {
    const db = dashboardDb(false);
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);

    const html = renderToStaticMarkup(await DashboardPage());

    expect(html).toContain("Construa sua primeira leitura empresarial.");
    expect(html).toContain("Iniciar diagnóstico");
    expect(db.from.mock.calls.map(([table]) => table)).toEqual(["companies", "diagnostics"]);
  });

  it("records numeric Home phases without exposing business data or changing the read", async () => {
    const db = dashboardDb(true);
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);
    const phases: Array<[string, number]> = [];
    const data = await loadDashboardOverview(context, (phase, durationMs) => {
      phases.push([phase, durationMs]);
    });
    expect(data?.growthScore).toBe(68);
    expect(phases.map(([phase]) => phase)).toEqual(["company_selection", "diagnostic", "pains"]);
    expect(phases.every(([, duration]) => Number.isFinite(duration) && duration >= 0)).toBe(true);

    vi.stubEnv("HSP4_PERF_TRACE", "1");
    const output = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await DashboardPage();
      const event = JSON.parse(String(output.mock.calls.at(-1)?.[0]));
      expect(headers).toHaveBeenCalledOnce();
      expect(event.operation).toBe("home_latency");
      expect(event.correlation_id).toBe("hsp4-probe");
      expect(event.phases_ms).toEqual(expect.objectContaining({
        company_selection: expect.any(Number), diagnostic: expect.any(Number), pains: expect.any(Number),
      }));
      expect(JSON.stringify(event)).not.toContain("Empresa Alfa");
      expect(JSON.stringify(event)).not.toContain("tenant-a");
    } finally {
      output.mockRestore();
    }
  });

  it("preserves the Home read when a timing observer throws", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(dashboardDb(true) as never);
    await expect(loadDashboardOverview(context, () => { throw new Error("TELEMETRY_FAILED"); }))
      .resolves.toMatchObject({ companyName: "Empresa Alfa", growthScore: 68 });
  });

  it("keeps numeric Home telemetry when the optional correlation header fails", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(dashboardDb(true) as never);
    vi.mocked(headers).mockRejectedValueOnce(new Error("HEADER_UNAVAILABLE"));
    vi.stubEnv("HSP4_PERF_TRACE", "1");
    const output = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      const html = renderToStaticMarkup(await DashboardPage());
      const event = JSON.parse(String(output.mock.calls.at(-1)?.[0]));
      expect(html).toContain("Empresa Alfa");
      expect(event.operation).toBe("home_latency");
      expect(event).not.toHaveProperty("correlation_id");
      expect(event.phases_ms).toEqual(expect.objectContaining({
        company_selection: expect.any(Number), diagnostic: expect.any(Number), pains: expect.any(Number),
      }));
      expect(JSON.stringify(event)).not.toContain("Empresa Alfa");
      expect(JSON.stringify(event)).not.toContain("tenant-a");
    } finally {
      output.mockRestore();
    }
  });
});
