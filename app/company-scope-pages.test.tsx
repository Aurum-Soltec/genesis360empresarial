import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IndicadoresPage from "./indicadores/page";
import MissoesPage from "./missoes/page";
import PrioridadesPage from "./prioridades/page";
import { loadDashboardOverview } from "@/lib/dashboard-overview";
import { createSupabaseServerClient } from "@/lib/supabase/server";

vi.mock("@/components/app-shell", () => ({ AppShell: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@/lib/page-tenant-context", () => ({ requirePageTenantContext: vi.fn(async () => ({ tenantId: "tenant-demo", role: "owner" })) }));
vi.mock("@/lib/feature-flags", () => ({ isDemoTenantAllowed: vi.fn(() => true) }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));

type Company = { id: string; trade_name: string; sector: string | null; fictional: boolean };

function companyScopedDb(companies: Company[]) {
  const companyFilters: Array<[string, unknown]> = [];
  const diagnosticFilters: Array<[string, unknown]> = [];
  const missionFilters: Array<[string, unknown]> = [];
  const companyQuery = {
    eq: vi.fn((key: string, value: unknown) => { companyFilters.push([key, value]); return companyQuery; }),
    limit: vi.fn(async (count: number) => ({
      data: companies.filter((company) => companyFilters.every(([key, value]) => key === "tenant_id" || company[key as keyof Company] === value)).slice(0, count),
      error: null,
    })),
  };
  const diagnosticQuery = {
    eq: vi.fn((key: string, value: unknown) => { diagnosticFilters.push([key, value]); return diagnosticQuery; }),
    order: vi.fn(() => diagnosticQuery),
    limit: vi.fn(() => diagnosticQuery),
    maybeSingle: vi.fn(async () => ({ data: null, error: null })),
  };
  const missionQuery = {
    eq: vi.fn((key: string, value: unknown) => { missionFilters.push([key, value]); return missionQuery; }),
    order: vi.fn(() => missionQuery),
    limit: vi.fn(async () => ({ data: [], error: null })),
  };
  const from = vi.fn((table: string) => {
    if (table === "companies") return { select: vi.fn(() => companyQuery) };
    if (table === "diagnostics") return { select: vi.fn(() => diagnosticQuery) };
    if (table === "missions") return { select: vi.fn(() => missionQuery) };
    throw new Error(`unexpected read of ${table}`);
  });
  return { from, diagnosticFilters, missionFilters };
}

beforeEach(() => vi.clearAllMocks());

describe("company scope on executive pages", () => {
  it("fails closed when a demo tenant has two fictional companies", async () => {
    const db = companyScopedDb([
      { id: "fictional-a", trade_name: "Exemplo A", sector: null, fictional: true },
      { id: "fictional-b", trade_name: "Exemplo B", sector: null, fictional: true },
    ]);
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);

    await expect(loadDashboardOverview({ tenantId: "tenant-demo", role: "owner", userId: "user-1" } as never)).rejects.toThrow("COMPANY_SELECTION_REQUIRED");
    const indicators = renderToStaticMarkup(await IndicadoresPage());
    const priorities = renderToStaticMarkup(await PrioridadesPage());
    const missions = renderToStaticMarkup(await MissoesPage());

    expect(indicators).toContain("Seleção da empresa necessária");
    expect(priorities).toContain("Seleção da empresa necessária");
    expect(missions).toContain("Seleção da empresa necessária");
    expect(db.from).not.toHaveBeenCalledWith("diagnostics");
    expect(db.from).not.toHaveBeenCalledWith("missions");
  });

  it("restricts indicators and priorities to the single fictional company", async () => {
    const db = companyScopedDb([
      { id: "real-company", trade_name: "Cliente Real", sector: null, fictional: false },
      { id: "fictional-company", trade_name: "Empresa Exemplo", sector: null, fictional: true },
    ]);
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);

    renderToStaticMarkup(await IndicadoresPage());
    renderToStaticMarkup(await PrioridadesPage());
    renderToStaticMarkup(await MissoesPage());

    expect(db.diagnosticFilters.filter(([key]) => key === "company_id")).toEqual([
      ["company_id", "fictional-company"],
      ["company_id", "fictional-company"],
    ]);
    expect(db.diagnosticFilters).not.toContainEqual(["company_id", "real-company"]);
    expect(db.missionFilters).toContainEqual(["company_id", "fictional-company"]);
    expect(db.missionFilters).not.toContainEqual(["company_id", "real-company"]);
  });
});
