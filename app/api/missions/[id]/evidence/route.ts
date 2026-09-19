import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

const Schema = z.object({
  evidenceType: z.enum(["declaration", "metric", "link"]),
  summary: z.string().min(3).max(1000),
  payload: z.record(z.string(), z.unknown()).default({}),
  sourceRef: z.string().max(500).nullable().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "evidence:write");
    const { id } = await params;
    const parsed = Schema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_EVIDENCE" }, { status: 400 });
    }

    const userDb = await createSupabaseServerClient();
    const { data: mission } = await userDb
      .from("missions")
      .select("id,status")
      .eq("id", id)
      .eq("tenant_id", ctx.tenantId)
      .maybeSingle();

    if (!mission) {
      return NextResponse.json({ error: "MISSION_NOT_FOUND" }, { status: 404 });
    }

    const { data: evidenceId, error } = await trustedTenantRpc(
      ctx,
      "record_mission_evidence",
      {
        p_mission_id: id,
        p_evidence_type: parsed.data.evidenceType,
        p_payload: parsed.data.payload,
        p_summary: parsed.data.summary,
        p_source_ref: parsed.data.sourceRef ?? null,
      },
    );

    if (error) {
      const status = error.message.includes("MISSION_NOT_ACCEPTING_EVIDENCE")
        ? 409
        : 500;
      return NextResponse.json(
        {
          error:
            status === 409
              ? "MISSION_NOT_ACCEPTING_EVIDENCE"
              : "EVIDENCE_CREATE_FAILED",
        },
        { status },
      );
    }

    return NextResponse.json({ evidence: { id: evidenceId } }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
