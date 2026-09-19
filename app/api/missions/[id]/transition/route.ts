import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { transitionMission } from "@/lib/server/trusted-data-access";
import {
  assertTransition,
  MissionStates,
  type MissionState,
} from "@/lib/mission-engine";

const Schema = z.object({ to: z.enum(MissionStates) });

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
      return NextResponse.json({ error: "INVALID_STATE" }, { status: 400 });
    }

    const db = await createSupabaseServerClient();
    const { data: mission, error: missionError } = await db
      .from("missions")
      .select("status,template_id")
      .eq("id", id)
      .eq("tenant_id", ctx.tenantId)
      .single();

    if (missionError) {
      return NextResponse.json({ error: "MISSION_READ_FAILED" }, { status: 500 });
    }
    if (!mission) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    try {
      assertTransition(mission.status as MissionState, parsed.data.to);
    } catch {
      return NextResponse.json({ error: "INVALID_TRANSITION" }, { status: 409 });
    }

    if (parsed.data.to === "COMPLETED") {
      const { data: template, error: templateError } = await db
        .from("mission_templates")
        .select("evidence_requirements")
        .eq("id", mission.template_id)
        .maybeSingle();

      if (templateError || !template) {
        return NextResponse.json(
          { error: "MISSION_POLICY_UNAVAILABLE" },
          { status: 500 },
        );
      }

      const requirements = Array.isArray(template.evidence_requirements)
        ? template.evidence_requirements
        : [];

      if (requirements.length > 0) {
        const requiredCount = requirements.reduce((sum, requirement) => {
          if (
            typeof requirement === "object" &&
            requirement !== null &&
            "minimum" in requirement &&
            typeof requirement.minimum === "number"
          ) {
            return sum + Math.max(1, Math.floor(requirement.minimum));
          }
          return sum + 1;
        }, 0);

        const { count, error: evidenceError } = await db
          .from("mission_evidence")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", ctx.tenantId)
          .eq("mission_id", id);

        if (evidenceError || count === null) {
          return NextResponse.json(
            { error: "MISSION_EVIDENCE_READ_FAILED" },
            { status: 500 },
          );
        }

        if (count < requiredCount) {
          return NextResponse.json({ error: "EVIDENCE_REQUIRED" }, { status: 409 });
        }
      }
    }

    const now = new Date().toISOString();
    const { data: updated, error } = await transitionMission(ctx, {
      missionId: id,
      expectedStatus: mission.status,
      targetStatus: parsed.data.to,
      changedAt: now,
    });

    if (error) {
      const status = error.message.includes("INVALID_MISSION_TRANSITION") ? 409 : 500;
      return NextResponse.json(
        { error: status === 409 ? "INVALID_TRANSITION" : "UPDATE_FAILED" },
        { status },
      );
    }

    if (!updated) {
      return NextResponse.json(
        { error: "MISSION_STATE_CHANGED" },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true, status: parsed.data.to });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
