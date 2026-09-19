import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/lib/tenant-context";

export async function getEffectiveConsent(
  ctx: TenantContext,
  purposeCode: string,
  companyId: string | null,
) {
  const db = await createSupabaseServerClient();

  const { data: decisions, error } = await db
    .from("consents")
    .select(
      "id,company_id,consent_version_id,purpose_code,granted,granted_at,revoked_at,decision_at,created_at",
    )
    .eq("tenant_id", ctx.tenantId)
    .eq("user_id", ctx.userId)
    .eq("purpose_code", purposeCode)
    .order("decision_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error("CONSENT_READ_FAILED");

  const applicable = (decisions ?? []).filter(
    (decision) =>
      decision.company_id === null ||
      (companyId !== null && decision.company_id === companyId),
  );

  const latest = applicable[0];
  if (!latest || !latest.granted || latest.revoked_at) return null;

  const { data: version, error: versionError } = await db
    .from("consent_versions")
    .select("id,active,purpose_code")
    .eq("id", latest.consent_version_id)
    .maybeSingle();

  if (versionError) throw new Error("CONSENT_READ_FAILED");
  if (!version?.active || version.purpose_code !== purposeCode) return null;
  return latest;
}
