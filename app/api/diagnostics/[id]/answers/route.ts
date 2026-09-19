import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trustedTenantRpc } from "@/lib/server/trusted-data-access";
import { questionBank } from "@/lib/diagnostic-strategy";
import { normalizeDiagnosticAnswer } from "@/lib/diagnostic-answer-quality";
import { loadDiagnosticEvaluation, loadDiagnosticState } from "@/lib/server/diagnostic-state";
import { assertSameOrigin, readJsonBody } from "@/lib/http-security";
import { assertTenantPermission } from "@/lib/authz";
import { apiErrorDetails, assertUuid } from "@/lib/api-errors";
import { ConfidenceRuleVersion } from "@/lib/diagnostic-confidence";

const Schema = z.object({
  questionId: z.string().min(1).max(80),
  expectedRevision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  answerState: z.enum(["ANSWERED", "UNKNOWN", "NOT_APPLICABLE", "DEFERRED"]).default("ANSWERED"),
  response: z.unknown().optional(),
  maturity: z.number().int().min(0).max(4).nullable().optional(),
  informationSlots: z.record(z.string(), z.unknown()).default({}),
  evidenceRefs: z.array(z.string().uuid()).max(20).default([]),
}).strict();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const ctx = await requireTenantContext();
    assertTenantPermission(ctx.role, "diagnostic:write");
    const { id } = await params;
    assertUuid(id);
    const parsed = Schema.safeParse(await readJsonBody(request));
    if (!parsed.success) return NextResponse.json({ error: "INVALID_ANSWER" }, { status: 400 });
    const { diagnostic, evaluation } = await loadDiagnosticEvaluation(ctx, id);
    if (diagnostic.status !== "draft") throw new Error("DIAGNOSTIC_NOT_EDITABLE");
    if (parsed.data.expectedRevision !== diagnostic.answer_revision) throw new Error("DIAGNOSTIC_CHANGED");

    // Only the next question or an already stored answer can be changed.
    // The conditional SQL write below checks this snapshot's revision again.
    const db = await createSupabaseServerClient();
    const { data: existing, error: existingError } = await db.from("answers")
      .select("question_id").eq("tenant_id", ctx.tenantId).eq("diagnostic_id", id)
      .eq("question_id", parsed.data.questionId).maybeSingle();
    if (existingError) throw new Error("DIAGNOSTIC_ANSWERS_READ_FAILED");
    if (!existing && evaluation.state.nextQuestionId !== parsed.data.questionId) {
      throw new Error("QUESTION_NOT_IN_ACTIVE_PATH");
    }
    const question = questionBank().find((item) => item.id === parsed.data.questionId);
    if (!question) throw new Error("UNKNOWN_QUESTION");
    const normalized = normalizeDiagnosticAnswer(question, {
      ...parsed.data, response: parsed.data.response,
      evidenceRefs: [...new Set(parsed.data.evidenceRefs.map((reference) => reference.toLowerCase()))],
    }, Date.now());

    // A reference must exist and be accessible in the same company and tenant.
    // Its existence still does not mean it verifies this answer.
    if (normalized.evidenceRefs.length) {
      const { data: evidence, error: evidenceError } = await db.from("evidence_items")
        .select("id,verification_status").eq("tenant_id", ctx.tenantId)
        .eq("company_id", diagnostic.company_id).in("id", normalized.evidenceRefs);
      if (evidenceError) throw new Error("EVIDENCE_READ_FAILED");
      if (evidence?.length !== normalized.evidenceRefs.length ||
          evidence.some((item) => ["expired", "rejected"].includes(item.verification_status))) {
        throw new Error("EVIDENCE_REFERENCE_NOT_AVAILABLE");
      }
    }
    const { data: revision, error } = await trustedTenantRpc(ctx, "save_diagnostic_answer_v1_2_1", {
      p_diagnostic_id: id,
      p_expected_revision: parsed.data.expectedRevision,
      p_answer: { ...normalized, questionId: question.id, qualityVersion: ConfidenceRuleVersion },
    });
    if (error) {
      const known = ["DIAGNOSTIC_CHANGED", "DIAGNOSTIC_NOT_EDITABLE", "ROLE_NOT_ALLOWED", "EVIDENCE_REFERENCE_NOT_AVAILABLE"]
        .find((code) => error.message.includes(code));
      throw new Error(known ?? "AUTOSAVE_FAILED");
    }

    // A concurrent later edit can make the subsequent read conflict. The save
    // already committed: report that fact rather than invite a blind retry.
    try {
      const state = await loadDiagnosticState(ctx, id);
      return NextResponse.json({ ok: true, answerRevision: revision, state });
    } catch {
      return NextResponse.json({ ok: true, answerRevision: revision, refreshRequired: true });
    }
  } catch (error) {
    const { code, status } = apiErrorDetails(error);
    return NextResponse.json({ error: code }, { status });
  }
}
