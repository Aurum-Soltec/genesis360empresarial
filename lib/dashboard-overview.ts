import type { TenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";

export type DashboardOverview = {
  companyName: string;
  latestDiagnosticId: string | null;
  growthScore: number | null;
  confidencePercent: number | null;
  growthScoreStatus: string;
  pains: Array<{ id: string; title: string; gap_summary: string | null; severity: number; confidence: number }>;
};

export type DashboardTimingPhase = "company_selection" | "diagnostic" | "pains";
export type DashboardTimingObserver = (phase: DashboardTimingPhase, durationMs: number) => void;

async function timed<T>(
  phase: DashboardTimingPhase,
  observer: DashboardTimingObserver | undefined,
  run: () => PromiseLike<T>,
): Promise<T> {
  if (!observer) return await run();
  const started = performance.now();
  try {
    return await run();
  } finally {
    // Timing is diagnostic only; a broken observer must never affect a read.
    try { observer(phase, Math.max(0, performance.now() - started)); } catch { /* best effort */ }
  }
}

export async function loadDashboardOverview(
  ctx: TenantContext,
  observeTiming?: DashboardTimingObserver,
): Promise<DashboardOverview | null> {
  const db = await createSupabaseServerClient();
  const selection = await timed(
    "company_selection", observeTiming,
    () => selectUniqueTenantCompany(db, ctx.tenantId, isDemoTenantAllowed(ctx.tenantId)),
  );
  if (selection.status !== "ready") {
    if (selection.status === "ambiguous") throw new Error("COMPANY_SELECTION_REQUIRED");
    return null;
  }
  const { company } = selection;

  const diagnosticQuery = db
    .from("diagnostics")
    .select("id,growth_score,growth_score_status,confidence,confidence_rule_version")
    .eq("status", "scored")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: diagnostic, error: diagnosticError } = await timed(
    "diagnostic", observeTiming, () => diagnosticQuery,
  );
  if (diagnosticError) throw new Error("DASHBOARD_READ_FAILED");
  let pains: DashboardOverview["pains"] = [];
  if (diagnostic) {
    const painQuery = db
      .from("pain_findings")
      .select("id,title,gap_summary,severity,confidence")
      .eq("tenant_id", ctx.tenantId)
      .eq("diagnostic_id", diagnostic.id)
      .order("severity", { ascending: false })
      .limit(3);

    const { data: painRows, error: painError } = await timed(
      "pains", observeTiming, () => painQuery,
    );
    if (painError) throw new Error("DASHBOARD_READ_FAILED");
    pains = (painRows ?? []) as DashboardOverview["pains"];
  }
  return {
    companyName: company.trade_name,
    latestDiagnosticId: diagnostic?.id ?? null,
    growthScore: diagnostic?.growth_score ?? null,
    confidencePercent: diagnostic?.confidence_rule_version ? Number(diagnostic.confidence) : null,
    growthScoreStatus: diagnostic?.growth_score_status ?? "insufficient_data",
    pains,
  };
}
