import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DemonstracaoPage from "./demonstracao/page";
import DemoSolutionsPage from "./demonstracao/solucoes/page";
import CouncilPage from "./conselho/page";
import DiagnosticoV1Page from "./diagnostico-v1/page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

vi.mock("@/components/app-shell", () => ({ AppShell: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("next/link", () => ({ default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a> }));
vi.mock("@/lib/page-tenant-context", () => ({ requirePageTenantContext: vi.fn(async () => ({ tenantId: "tenant-demo", role: "owner" })) }));
vi.mock("@/lib/feature-flags", () => ({
  isDemoTenantAllowed: vi.fn(() => true),
  getFeatureFlags: vi.fn(() => ({ agentic: false })),
}));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: vi.fn() }));

function companiesOnlyDb(companies: Array<{ id: string; fictional: boolean; trade_name: string; sector: string | null }>) {
  const filters: Array<[string, unknown]> = [];
  const query = {
    eq: vi.fn((key: string, value: unknown) => { filters.push([key, value]); return query; }),
    limit: vi.fn(async (count: number) => ({
      data: companies.filter((company) => filters.every(([key, value]) => key === "tenant_id" || company[key as keyof typeof company] === value)).slice(0, count),
      error: null,
    })),
  };
  const from = vi.fn((table: string) => {
    if (table !== "companies") throw new Error(`unexpected read of ${table}`);
    return { select: vi.fn(() => query) };
  });
  return { from };
}

beforeEach(() => vi.clearAllMocks());

describe("controlled demo company boundary", () => {
  it("does not use a real company for demo cockpit, solutions, Council or diagnosis", async () => {
    const db = companiesOnlyDb([{ id: "real-one", fictional: false, trade_name: "Cliente Real", sector: null }]);
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);

    const cockpit = renderToStaticMarkup(await DemonstracaoPage());
    const solutions = renderToStaticMarkup(await DemoSolutionsPage({ searchParams: Promise.resolve({ diagnostic: "real-report" }) }));
    const council = renderToStaticMarkup(await CouncilPage());
    const diagnosis = renderToStaticMarkup(await DiagnosticoV1Page());

    expect(cockpit).toContain("Nenhuma empresa fictícia");
    expect(solutions).toContain("Empresa fictícia indisponível");
    expect(council).toContain("Síntese demonstrativa indisponível");
    expect(diagnosis).toContain("roteiro requer uma empresa fictícia");
    expect(cockpit + solutions + council + diagnosis).not.toContain("Cliente Real");
    expect(db.from).toHaveBeenCalledTimes(4);
    expect(db.from).toHaveBeenCalledWith("companies");
  });

  it("blocks a demo tenant containing two fictional companies", async () => {
    const db = companiesOnlyDb([
      { id: "demo-a", fictional: true, trade_name: "A", sector: null },
      { id: "demo-b", fictional: true, trade_name: "B", sector: null },
    ]);
    vi.mocked(createSupabaseServerClient).mockResolvedValue(db as never);
    const cockpit = renderToStaticMarkup(await DemonstracaoPage());
    expect(cockpit).toContain("mais de uma empresa fictícia");
    expect(cockpit).not.toContain("etapas prontas");
    expect(db.from).toHaveBeenCalledTimes(1);
  });

  it("does not render a real-company report through the fictional solutions route", async () => {
    const companyDb = companiesOnlyDb([
      { id: "demo-one", fictional: true, trade_name: "Empresa Exemplo", sector: null },
      { id: "real-one", fictional: false, trade_name: "Cliente Real", sector: null },
    ]);
    const diagnosticFilters: Array<[string, unknown]> = [];
    const diagnosticQuery = {
      eq: vi.fn((key: string, value: unknown) => { diagnosticFilters.push([key, value]); return diagnosticQuery; }),
      maybeSingle: vi.fn(async () => ({ data: null, error: null })),
    };
    const from = vi.fn((table: string) => {
      if (table === "companies") return companyDb.from(table);
      if (table === "diagnostics") return { select: vi.fn(() => diagnosticQuery) };
      throw new Error(`unexpected read of ${table}`);
    });
    vi.mocked(createSupabaseServerClient).mockResolvedValue({ from } as never);

    const html = renderToStaticMarkup(await DemoSolutionsPage({ searchParams: Promise.resolve({ diagnostic: "real-report" }) }));
    expect(html).toContain("Ainda não há um relatório concluído");
    expect(html).not.toContain("Cliente Real");
    expect(diagnosticFilters).toContainEqual(["company_id", "demo-one"]);
    expect(diagnosticFilters).toContainEqual(["id", "real-report"]);
    expect(from).not.toHaveBeenCalledWith("score_results");
  });
});
