import { assertSameOrigin } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordDecisionFromPain } from "@/lib/server/trusted-data-access";
import { buildDeterministicGds } from "@/lib/gds";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(_);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "decision:write");
    const { id } = await params;
    const db = await createSupabaseServerClient();

    const { data: pain } = await db
      .from("pain_findings")
      .select(
        "id,company_id,diagnostic_id,dimension,title,severity,confidence,gap_summary",
      )
      .eq("id", id)
      .eq("tenant_id", ctx.tenantId)
      .single();

    if (!pain) {
      return NextResponse.json({ error: "PAIN_NOT_FOUND" }, { status: 404 });
    }

    const gds = buildDeterministicGds({
      painId: pain.id,
      title: pain.title,
      dimension: pain.dimension,
      severity: Number(pain.severity),
      confidence: Number(pain.confidence),
      gapSummary: pain.gap_summary,
    });

    const { data, error } = await recordDecisionFromPain(ctx, pain.id, gds);

    if (error) {
      return NextResponse.json({ error: "GDS_CREATE_FAILED" }, { status: 500 });
    }
    return NextResponse.json({ decision: data }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
