import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/lib/tenant-context";
import type { ApplicabilityContext } from "@/lib/diagnostic-strategy";

export async function loadDiagnosticApplicabilityContext(
  ctx: TenantContext,
  companyId: string,
): Promise<ApplicabilityContext> {
  const db = await createSupabaseServerClient();

  const { data: company, error: companyError } = await db
    .from("companies")
    .select("sector")
    .eq("tenant_id", ctx.tenantId)
    .eq("id", companyId)
    .maybeSingle();

  const { data: facts, error: factsError } = await db
    .from("business_facts")
    .select("fact_key,value")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", companyId)
    .in("fact_key", ["identity.sector_code", "business.operating_traits"])
    .is("valid_to", null);

  if (companyError || factsError) throw new Error("DIAGNOSTIC_CONTEXT_READ_FAILED");
  if (!company) throw new Error("COMPANY_NOT_FOUND");
  const factByKey = new Map((facts ?? []).map((fact) => [fact.fact_key, fact.value]));
  const sectorFact = factByKey.get("identity.sector_code");
  const traitsFact = factByKey.get("business.operating_traits");

  const sectorCode =
    typeof sectorFact === "string"
      ? sectorFact
      : company?.sector ?? null;

  const operatingTraits =
    typeof traitsFact === "object" &&
    traitsFact !== null &&
    !Array.isArray(traitsFact)
      ? Object.fromEntries(
          Object.entries(traitsFact as Record<string, unknown>).map(
            ([key, value]) => [key, typeof value === "boolean" ? value : undefined],
          ),
        )
      : {};

  return { sectorCode, operatingTraits };
}
