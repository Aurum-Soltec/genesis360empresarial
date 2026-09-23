import { describe, expect, it, vi } from "vitest";
import { selectUniqueTenantCompany } from "./company-selection";

const tenantId = "tenant-one";
const fictional = { id: "demo-one", tenant_id: tenantId, trade_name: "Empresa Exemplo", sector: "Serviços", fictional: true };
const real = { id: "real-one", tenant_id: tenantId, trade_name: "Cliente Real", sector: "Indústria", fictional: false };

function fakeDb(rows: typeof fictional[], error: unknown = null) {
  const filters: Array<[string, unknown]> = [];
  const query = {
    eq: vi.fn((key: string, value: unknown) => {
      filters.push([key, value]);
      return query;
    }),
    limit: vi.fn(async (count: number) => ({
      data: rows.filter((row) => filters.every(([key, value]) => row[key as keyof typeof row] === value)).slice(0, count),
      error,
    })),
  };
  return {
    db: { from: vi.fn(() => ({ select: vi.fn(() => query) })) },
    query,
    filters,
  };
}

describe("tenant company selection", () => {
  it("selects only the unique fictional company for a controlled demo", async () => {
    const { db, query, filters } = fakeDb([real, fictional]);
    expect(await selectUniqueTenantCompany(db as never, tenantId, true)).toEqual({ status: "ready", company: fictional });
    expect(filters).toEqual([["tenant_id", tenantId], ["fictional", true]]);
    expect(query.limit).toHaveBeenCalledWith(2);
  });

  it("never chooses an arbitrary company when selection is ambiguous", async () => {
    const { db } = fakeDb([fictional, { ...fictional, id: "demo-two" }]);
    expect(await selectUniqueTenantCompany(db as never, tenantId, true)).toEqual({ status: "ambiguous", company: null });
  });

  it("rejects a real company as a demo company and surfaces database errors", async () => {
    const one = fakeDb([real]);
    expect(await selectUniqueTenantCompany(one.db as never, tenantId, true)).toEqual({ status: "missing", company: null });
    const failed = fakeDb([], { code: "DB_DOWN" });
    await expect(selectUniqueTenantCompany(failed.db as never, tenantId, true)).rejects.toThrow("COMPANY_SELECTION_READ_FAILED");
  });

  it("requires unique selection for ordinary tenant routes as well", async () => {
    const { db } = fakeDb([real, fictional]);
    expect(await selectUniqueTenantCompany(db as never, tenantId)).toEqual({ status: "ambiguous", company: null });
  });
});
