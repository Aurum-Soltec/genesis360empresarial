import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

const Schema = z.object({
  outcomeStatus: z.enum([
    "no_change",
    "small_improvement",
    "improved",
    "significant_improvement",
    "worsened",
    "unknown",
  ]),
  beforeValue: z.unknown().nullable().optional(),
  afterValue: z.unknown().nullable().optional(),
  metricCode: z.string().min(2).max(120).nullable().optional(),
  source: z.literal("declared").default("declared"),
  confidence: z.null().optional(),
}).strict();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "mission:write");
    const { id } = await params;
    const parsed = Schema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_OUTCOME" }, { status: 400 });
    }

    const userDb = await createSupabaseServerClient();
    const { data: mission, error: missionError } = await userDb
      .from("missions")
      .select("id,status")
      .eq("id", id)
      .eq("tenant_id", ctx.tenantId)
      .maybeSingle();

    if (missionError) throw new Error("MISSION_READ_FAILED");

    if (!mission) {
      return NextResponse.json({ error: "MISSION_NOT_FOUND" }, { status: 404 });
    }

    const { data: outcomeId, error } = await trustedTenantRpc(
      ctx,
      "record_mission_outcome",
      {
        p_mission_id: id,
        p_outcome_status: parsed.data.outcomeStatus,
        p_before_value: parsed.data.beforeValue ?? null,
        p_after_value: parsed.data.afterValue ?? null,
        p_metric_code: parsed.data.metricCode ?? null,
        p_source: parsed.data.source,
        p_confidence: null,
      },
    );

    if (error) {
      const status = (error.message.includes("MISSION_NOT_READY_FOR_OUTCOME") || error.message.includes("OUTCOME_ALREADY_RECORDED"))
        ? 409
        : 500;
      return NextResponse.json(
        {
          error:
            status === 409
              ? (error.message.includes("OUTCOME_ALREADY_RECORDED") ? "OUTCOME_ALREADY_RECORDED" : "MISSION_NOT_READY_FOR_OUTCOME")
              : "OUTCOME_CREATE_FAILED",
        },
        { status },
      );
    }

    return NextResponse.json({ outcome: { id: outcomeId } }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
