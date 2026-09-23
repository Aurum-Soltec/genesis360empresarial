import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DemonstracaoPage from "./demonstracao/page";
import DemoSolutionsPage from "./demonstracao/solucoes/page";
import CouncilPage from "./conselho/page";
import DiagnosticoV1Page from "./diagnostico-v1/page";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DemoEvidenceTemplates } from "@/lib/demo-scenario";

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

  it("does not mark document-to-report flow ready when registered sources are absent from the latest report", async () => {
    const companyDb = companiesOnlyDb([
      { id: "demo-one", fictional: true, trade_name: "Empresa Exemplo", sector: null },
    ]);
    const evidence = DemoEvidenceTemplates.map((template, index) => ({
      id: `source-${index + 1}`,
      source_ref: template.sourceRef,
      evidence_type: template.evidenceType,
      summary: template.summary,
      payload: template.payload,
      sensitivity: template.sensitivity,
      purpose_codes: ["DEMO_CONTROLLED"],
      verification_status: "unverified",
    }));
    const observedFilters: Record<string, Array<[string, unknown]>> = {};
    function mockDb(linked: boolean) {
      const rows: Record<string, unknown[]> = {
        diagnostics: [{ id: "latest-report", status: "scored", profile_code: "FULL", growth_score: 48, confidence: 78 }],
        evidence_items: evidence,
        answers: [{ evidence_refs: [] }],
        evidence_links: linked ? [{ evidence_id: "source-1" }] : [],
      };
      const from = vi.fn((table: string) => {
        if (table === "companies") return companyDb.from(table);
        if (!(table in rows)) throw new Error(`unexpected read of ${table}`);
        const filters: Array<[string, unknown]> = [];
        observedFilters[table] = filters;
        const result = { data: rows[table], error: null };
        const query = {
          select: vi.fn(() => query),
          eq: vi.fn((key: string, value: unknown) => { filters.push([key, value]); return query; }),
          order: vi.fn(() => query),
          limit: vi.fn(async () => result),
          like: vi.fn(async () => result),
          then: (resolve: (value: typeof result) => void) => Promise.resolve(result).then(resolve),
        };
        return query;
      });
      return { from };
    }

    vi.mocked(createSupabaseServerClient).mockResolvedValue(mockDb(false) as never);
    const withoutLink = renderToStaticMarkup(await DemonstracaoPage());
    expect(withoutLink).toContain("6/7");
    expect(withoutLink).toContain("3 de 3 fontes fictícias registradas · 0 fontes fictícias vinculadas à leitura");
    expect(withoutLink).toContain("/resultado-v1?diagnostic=latest-report");
    expect(observedFilters.answers).toContainEqual(["diagnostic_id", "latest-report"]);
    expect(observedFilters.evidence_links).toContainEqual(["subject_id", "latest-report"]);

    vi.mocked(createSupabaseServerClient).mockResolvedValue(mockDb(true) as never);
    const withLink = renderToStaticMarkup(await DemonstracaoPage());
    expect(withLink).toContain("7/7");
    expect(withLink).toContain("3 de 3 fontes fictícias registradas · 1 fonte fictícia vinculada à leitura");
  });
});
