import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/tenant-context";
import { assertTenantPermission } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/http-security";
import { apiErrorDetails, assertUuid } from "@/lib/api-errors";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";
import { loadDiagnosticEvaluation } from "@/lib/server/diagnostic-state";
import { ScoringRuleVersion } from "@/lib/diagnostic-scoring";
import { ConfidenceRuleVersion } from "@/lib/diagnostic-confidence";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "diagnostic:write");
    const { id } = await params;
    assertUuid(id);
    const { diagnostic, evaluation } = await loadDiagnosticEvaluation(ctx, id);
    if (diagnostic.status === "scored") return NextResponse.json({ ...evaluation, replayed: true });

    if (!evaluation.state.canSubmit) {
      const error = evaluation.state.submissionBlockers[0] ?? "INSUFFICIENT_COVERAGE";
      return NextResponse.json({ error, state: evaluation.state }, { status: 422 });
    }
    const result = {
      ...evaluation,
      state: { ...evaluation.state, status: "scored", canSubmit: false, submissionBlockers: [] },
    };
    const { data: persisted, error } = await trustedTenantRpc(ctx, "persist_diagnostic_result_v1_2_1", {
      p_diagnostic_id: id,
      p_expected_revision: diagnostic.answer_revision,
      p_snapshot: result,
      p_rule_version: ScoringRuleVersion,
      p_confidence_version: ConfidenceRuleVersion,
    });
    if (error) {
      if (error.message.includes("DIAGNOSTIC_CHANGED")) throw new Error("DIAGNOSTIC_CHANGED");
      if (error.message.includes("ROLE_NOT_ALLOWED")) throw new Error("ROLE_NOT_ALLOWED");
      throw new Error("DIAGNOSTIC_RESULT_PERSIST_FAILED");
    }
    if (!persisted) throw new Error("DIAGNOSTIC_RESULT_PERSIST_FAILED");
    return NextResponse.json(persisted);
  } catch (error) {
    const details = apiErrorDetails(error);
    return NextResponse.json({ error: details.code }, { status: details.status });
  }
}
