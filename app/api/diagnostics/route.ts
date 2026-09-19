import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails } from "@/lib/api-errors";
import { NextResponse } from "next/server";
import { z } from "zod";
import master from "@/data/diagnostic-master.json";
import { loadDiagnosticApplicabilityContext } from "@/lib/server/diagnostic-context";
import { ScoringRuleVersion } from "@/lib/diagnostic-scoring";
import { ConfidenceRuleVersion } from "@/lib/diagnostic-confidence";
import { DiagnosticStrategyVersion } from "@/lib/diagnostic-strategy";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { startDiagnostic } from "@/lib/server/trusted-data-access";

const Schema = z.object({
  companyId: z.string().uuid(),
  profile: z.enum(["ESSENTIAL", "FULL"]).default("ESSENTIAL"),
});

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "diagnostic:write");
    const parsed = Schema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_START" }, { status: 400 });
    }

    const db = await createSupabaseServerClient();

    const { data: existing, error: existingError } = await db
      .from("diagnostics")
      .select("id,profile_code,status,started_at")
      .eq("tenant_id", ctx.tenantId)
      .eq("company_id", parsed.data.companyId)
      .eq("profile_code", parsed.data.profile)
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) throw new Error("DIAGNOSTIC_READ_FAILED");
    if (existing) {
      return NextResponse.json({ diagnostic: existing, resumed: true });
    }

    const { data: version, error: versionError } = await db
      .from("diagnostic_versions")
      .select("id,version,rules_version,strategy_version")
      .eq("version", master.version)
      .eq("status", "published")
      .maybeSingle();

    if (versionError || !version) {
      return NextResponse.json(
        { error: "DIAGNOSTIC_VERSION_NOT_PUBLISHED" },
        { status: 503 },
      );
    }

    const contextSnapshot = await loadDiagnosticApplicabilityContext(ctx, parsed.data.companyId);
    const { data, error } = await startDiagnostic(ctx, {
      companyId: parsed.data.companyId,
      diagnosticVersionId: version.id,
      profileCode: parsed.data.profile,
      strategyVersion: DiagnosticStrategyVersion,
      contextSnapshot,
      rulesVersion: ScoringRuleVersion,
      confidenceRuleVersion: ConfidenceRuleVersion,
      estimatedQuestionCount: parsed.data.profile === "FULL" ? 60 : 42,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "DIAGNOSTIC_START_CONFLICT", retryable: true }, { status: 409 });
      }
      return NextResponse.json({ error: "DIAGNOSTIC_START_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ diagnostic: data, resumed: false }, { status: 201 });
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
