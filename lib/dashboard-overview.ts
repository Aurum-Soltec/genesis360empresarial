import type { TenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";

export type DashboardOverview = {
  companyName: string;
  passportFacts: number;
  latestDiagnosticId: string | null;
  growthScore: number | null;
  confidencePercent: number | null;
  growthScoreStatus: string;
  scores: Array<{ dimension: string; score: number | null; coverage: number; confidence: number }>;
  pains: Array<{ id: string; title: string; gap_summary: string | null; severity: number; confidence: number }>;
  mission: { id: string; status: string; due_at: string | null } | null;
};

export async function loadDashboardOverview(ctx: TenantContext): Promise<DashboardOverview | null> {
  const db = await createSupabaseServerClient();
  const selection = await selectUniqueTenantCompany(
    db,
    ctx.tenantId,
    isDemoTenantAllowed(ctx.tenantId),
  );
  if (selection.status !== "ready") {
    if (selection.status === "ambiguous") throw new Error("COMPANY_SELECTION_REQUIRED");
    return null;
  }
  const { company } = selection;

  const passportQuery = db
    .from("business_facts")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", company.id)
    .is("valid_to", null);

  const diagnosticQuery = db
    .from("diagnostics")
    .select("id,growth_score,growth_score_status,confidence,confidence_rule_version")
    .eq("status", "scored")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const missionQuery = db
    .from("missions")
    .select("id,status,due_at")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", company.id)
    .not("status", "in", '("CANCELLED","EXPIRED","OUTCOME_RECORDED")')
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [passportResult, diagnosticResult, missionResult] = await Promise.all([
    passportQuery,
    diagnosticQuery,
    missionQuery,
  ]);
  const { count: passportFacts, error: passportError } = passportResult;
  const { data: diagnostic, error: diagnosticError } = diagnosticResult;
  const { data: mission, error: missionError } = missionResult;

  if (passportError || diagnosticError || missionError) throw new Error("DASHBOARD_READ_FAILED");
  let scores: DashboardOverview["scores"] = [];
  let pains: DashboardOverview["pains"] = [];
  if (diagnostic) {
    const scoreQuery = db
      .from("score_results")
      .select("dimension,score,coverage,confidence")
      .eq("tenant_id", ctx.tenantId)
      .eq("diagnostic_id", diagnostic.id)
      .order("score");

    const painQuery = db
      .from("pain_findings")
      .select("id,title,gap_summary,severity,confidence")
      .eq("tenant_id", ctx.tenantId)
      .eq("diagnostic_id", diagnostic.id)
      .order("severity", { ascending: false })
      .limit(3);

    const [scoreResult, painResult] = await Promise.all([scoreQuery, painQuery]);
    const { data: scoreRows, error: scoreError } = scoreResult;
    const { data: painRows, error: painError } = painResult;
    if (scoreError || painError) throw new Error("DASHBOARD_READ_FAILED");
    scores = (scoreRows ?? []) as DashboardOverview["scores"];
    pains = (painRows ?? []) as DashboardOverview["pains"];
  }
  return {
    companyName: company.trade_name,
    passportFacts: passportFacts ?? 0,
    latestDiagnosticId: diagnostic?.id ?? null,
    growthScore: diagnostic?.growth_score ?? null,
    confidencePercent: diagnostic?.confidence_rule_version ? Number(diagnostic.confidence) : null,
    growthScoreStatus: diagnostic?.growth_score_status ?? "insufficient_data",
    scores,
    pains,
    mission: mission ?? null,
  };
}
