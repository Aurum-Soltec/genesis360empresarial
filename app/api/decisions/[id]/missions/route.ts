import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";

const Schema = z.object({
  dueAt: z.string().datetime().nullable().optional(),
});

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
      return NextResponse.json({ error: "INVALID_MISSION_REQUEST" }, { status: 400 });
    }

    const userDb = await createSupabaseServerClient();
    const { data: decision } = await userDb
      .from("decision_records")
      .select("id,company_id")
      .eq("id", id)
      .eq("tenant_id", ctx.tenantId)
      .maybeSingle();

    if (!decision) {
      return NextResponse.json({ error: "DECISION_NOT_FOUND" }, { status: 404 });
    }

    const { data: missionId, error } = await trustedTenantRpc(
      ctx,
      "create_mission_from_decision",
      {
        p_decision_record_id: id,
        p_due_at: parsed.data.dueAt ?? null,
      },
    );

    if (error) {
      const status = error.message.includes("MISSION_ALREADY_EXISTS") ? 409 : 500;
      return NextResponse.json(
        {
          error:
            status === 409
              ? "MISSION_ALREADY_EXISTS"
              : "MISSION_CREATE_FAILED",
        },
        { status },
      );
    }

    return NextResponse.json({ mission: { id: missionId } }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
