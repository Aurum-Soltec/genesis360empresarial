import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export async function loadDashboardOverview(): Promise<DashboardOverview | null> {
  let ctx;
  try { ctx = await requireTenantContext(); } catch { return null; }

  const db = await createSupabaseServerClient();
  const { data: company, error: companyError } = await db
    .from("companies")
    .select("id,trade_name")
    .eq("tenant_id", ctx.tenantId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (companyError) throw new Error("DASHBOARD_READ_FAILED");
  if (!company) return null;

  const { count: passportFacts, error: passportError } = await db
    .from("business_facts")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", company.id)
    .is("valid_to", null);

  const { data: diagnostic, error: diagnosticError } = await db
    .from("diagnostics")
    .select("id,growth_score,growth_score_status,confidence,confidence_rule_version")
    .eq("status", "scored")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (passportError || diagnosticError) throw new Error("DASHBOARD_READ_FAILED");
  let scores: DashboardOverview["scores"] = [];
  let pains: DashboardOverview["pains"] = [];
  if (diagnostic) {
    const { data: scoreRows, error: scoreError } = await db
      .from("score_results")
      .select("dimension,score,coverage,confidence")
      .eq("tenant_id", ctx.tenantId)
      .eq("diagnostic_id", diagnostic.id)
      .order("score");
    if (scoreError) throw new Error("DASHBOARD_READ_FAILED");
    scores = (scoreRows ?? []) as DashboardOverview["scores"];

    const { data: painRows, error: painError } = await db
      .from("pain_findings")
      .select("id,title,gap_summary,severity,confidence")
      .eq("tenant_id", ctx.tenantId)
      .eq("diagnostic_id", diagnostic.id)
      .order("severity", { ascending: false })
      .limit(3);
    if (painError) throw new Error("DASHBOARD_READ_FAILED");
    pains = (painRows ?? []) as DashboardOverview["pains"];
  }

  const { data: mission, error: missionError } = await db
    .from("missions")
    .select("id,status,due_at")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", company.id)
    .not("status", "in", '("CANCELLED","EXPIRED","OUTCOME_RECORDED")')
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (missionError) throw new Error("DASHBOARD_READ_FAILED");
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
