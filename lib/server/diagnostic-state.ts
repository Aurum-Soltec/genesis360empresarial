import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/lib/tenant-context";
import { evaluateDiagnostic, type EvaluationAnswer, type DiagnosticEvaluation } from "@/lib/diagnostic-evaluation";
import type { AnswerState, DiagnosticProfile } from "@/lib/diagnostic-strategy";

export async function loadDiagnosticEvaluation(ctx: TenantContext, diagnosticId: string) {
  const db = await createSupabaseServerClient();
  const { data: diagnostic, error: diagnosticError } = await db
    .from("diagnostics")
    .select("id,company_id,profile_code,status,strategy_version,answer_revision,result_snapshot,confidence_rule_version,context_snapshot,evaluation_as_of")
    .eq("tenant_id", ctx.tenantId).eq("id", diagnosticId).maybeSingle();
  if (diagnosticError) throw new Error("DIAGNOSTIC_READ_FAILED");
  if (!diagnostic) throw new Error("DIAGNOSTIC_NOT_FOUND");

  // Submitted results are immutable, not recomputed using today's data or rules.
  if (diagnostic.status === "scored") {
    const snapshot = diagnostic.result_snapshot as DiagnosticEvaluation | null;
    if (!snapshot?.state || !snapshot.scores) throw new Error("LEGACY_DIAGNOSTIC_REASSESSMENT_REQUIRED");
    return { diagnostic, evaluation: snapshot };
  }

  if (diagnostic.context_snapshot === null) throw new Error("LEGACY_DIAGNOSTIC_REASSESSMENT_REQUIRED");
  const context = diagnostic.context_snapshot;
  const { data: answerRows, error: answerError } = await db
    .from("answers")
    .select("question_id,response,maturity,answer_state,information_slots,evidence_refs")
    .eq("tenant_id", ctx.tenantId).eq("diagnostic_id", diagnostic.id);
  if (answerError) throw new Error("DIAGNOSTIC_ANSWERS_READ_FAILED");

  const answers: EvaluationAnswer[] = (answerRows ?? []).map((row) => ({
    questionId: row.question_id,
    answerState: row.answer_state as AnswerState,
    response: row.response,
    maturity: row.maturity === null ? null : Number(row.maturity),
    informationSlots: row.information_slots ?? {},
    evidenceRefs: row.evidence_refs ?? [],
  }));
  const evaluation = evaluateDiagnostic({
    profile: diagnostic.profile_code as DiagnosticProfile,
    status: diagnostic.status, answers, context,
    asOf: Date.parse(diagnostic.evaluation_as_of),
  });
  const { data: current, error: revisionError } = await db
    .from("diagnostics").select("answer_revision,status")
    .eq("tenant_id", ctx.tenantId).eq("id", diagnostic.id).maybeSingle();
  if (revisionError) throw new Error("DIAGNOSTIC_READ_FAILED");
  if (!current || current.answer_revision !== diagnostic.answer_revision || current.status !== diagnostic.status) {
    throw new Error("DIAGNOSTIC_CHANGED");
  }
  return { diagnostic, evaluation };
}

export async function loadDiagnosticState(ctx: TenantContext, diagnosticId: string) {
  const { diagnostic, evaluation } = await loadDiagnosticEvaluation(ctx, diagnosticId);
  return {
    ...evaluation.state,
    diagnosticId: diagnostic.id,
    answerRevision: diagnostic.answer_revision,
    status: diagnostic.status,
    canSubmit: diagnostic.status === "draft" && evaluation.state.canSubmit,
  };
}
