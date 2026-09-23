import type { createSupabaseServerClient } from "@/lib/supabase/server";

type ServerDb = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type SelectedCompany = {
  id: string;
  trade_name: string;
  sector: string | null;
  fictional: boolean;
};

export type CompanySelection =
  | { status: "ready"; company: SelectedCompany }
  | { status: "missing" | "ambiguous"; company: null };

/** A tenant is not a company selector. Never silently take an arbitrary first row. */
export async function selectUniqueTenantCompany(
  db: ServerDb,
  tenantId: string,
  fictionalOnly = false,
): Promise<CompanySelection> {
  let query = db.from("companies")
    .select("id,trade_name,sector,fictional")
    .eq("tenant_id", tenantId);
  if (fictionalOnly) query = query.eq("fictional", true);
  const { data, error } = await query.limit(2);
  if (error) throw new Error("COMPANY_SELECTION_READ_FAILED");
  if (!data?.length) return { status: "missing", company: null };
  if (data.length > 1) return { status: "ambiguous", company: null };
  return { status: "ready", company: data[0] };
}
