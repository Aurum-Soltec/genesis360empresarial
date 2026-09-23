import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { buildCouncilBrief } from "@/lib/council-insights";
import { getFeatureFlags, isDemoTenantAllowed } from "@/lib/feature-flags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { DemoCouncil } from "./demo-council";

export default async function Page() {
  const ctx = await requirePageTenantContext("/conselho");
  const db = await createSupabaseServerClient();
  const flags = getFeatureFlags();
  const demoAllowed = isDemoTenantAllowed(ctx.tenantId);
  const { data: diagnostic, error: diagnosticError } = await db
    .from("diagnostics")
    .select("id,company_id,growth_score,confidence")
    .eq("tenant_id", ctx.tenantId)
    .eq("status", "scored")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (diagnosticError) throw new Error("COUNCIL_DIAGNOSTIC_READ_FAILED");

  if (!diagnostic || !demoAllowed) {
    return (
      <AppShell>
        <header className="page-header"><div><div className="kicker">Genesis 360 Empresarial</div><h1 className="page-title">Conselho Genesis</h1></div></header>
        <section className="card empty-state">
          <h3>Conclua um diagnóstico para abrir a síntese do Conselho.</h3>
          <p>A execução agentic permanece protegida pelos gates de runtime, tools, budgets e evals.</p>
          <Link className="button button-primary" href="/diagnostico-v1">Ir ao diagnóstico</Link>
        </section>
      </AppShell>
    );
  }

  const [{ data: company, error: companyError }, { data: scores, error: scoresError }, { data: pains, error: painsError }, { data: answerEvidence, error: answersError }, { data: directEvidence, error: linksError }] = await Promise.all([
    db.from("companies").select("trade_name").eq("tenant_id", ctx.tenantId).eq("id", diagnostic.company_id).maybeSingle(),
    db.from("score_results").select("dimension,score,confidence").eq("tenant_id", ctx.tenantId).eq("diagnostic_id", diagnostic.id),
    db.from("pain_findings").select("title,gap_summary").eq("tenant_id", ctx.tenantId).eq("diagnostic_id", diagnostic.id).order("severity", { ascending: false }).limit(3),
    db.from("answers").select("evidence_refs").eq("tenant_id", ctx.tenantId).eq("diagnostic_id", diagnostic.id),
    db.from("evidence_links").select("evidence_id").eq("tenant_id", ctx.tenantId).eq("company_id", diagnostic.company_id).eq("subject_type", "diagnostic").eq("subject_id", diagnostic.id),
  ]);
  if (companyError || scoresError || painsError || answersError || linksError) {
    throw new Error("COUNCIL_BASIS_READ_FAILED");
  }
  const evidenceIds = [...new Set([
    ...(answerEvidence ?? []).flatMap((answer) => answer.evidence_refs ?? []),
    ...(directEvidence ?? []).map((link) => link.evidence_id),
  ])];
  const { data: evidence, error: evidenceError } = evidenceIds.length
    ? await db.from("evidence_items").select("verification_status").eq("tenant_id", ctx.tenantId).eq("company_id", diagnostic.company_id).in("id", evidenceIds)
    : { data: [], error: null };
  if (evidenceError) throw new Error("COUNCIL_EVIDENCE_READ_FAILED");
  const prompts = buildCouncilBrief({
    companyName: company?.trade_name ?? "empresa analisada",
    growthScore: diagnostic.growth_score === null ? null : Number(diagnostic.growth_score),
    confidence: diagnostic.confidence === null ? null : Math.round(Number(diagnostic.confidence)),
    scores: (scores ?? []).map((item) => ({ dimension: item.dimension, score: item.score === null ? null : Number(item.score), confidence: item.confidence === null ? null : Number(item.confidence) })),
    pains: (pains ?? []).map((item) => ({ title: item.title, gapSummary: item.gap_summary })),
    evidenceCount: evidence?.length ?? 0,
    verifiedEvidenceCount: (evidence ?? []).filter((item) => item.verification_status === "verified").length,
  });

  return (
    <AppShell>
      <header className="page-header council-page-header">
        <div>
          <div className="kicker">Síntese orientada a decisão</div>
          <h1 className="page-title">Conselho Genesis</h1>
          <p className="page-subtitle">Uma única conversa reúne estratégia, finanças, operações e risco com base no diagnóstico concluído.</p>
        </div>
        <Link className="button button-secondary" href={`/resultado-v1?diagnostic=${diagnostic.id}`}>Abrir relatório</Link>
      </header>
      <div className="council-boundary" role="status">
        <strong>Demonstração determinística e somente leitura.</strong>
        <span>Agentic: {flags.agentic ? "habilitado" : "desligado"} · sem tools externas · sem escrita autônoma</span>
      </div>
      <DemoCouncil prompts={prompts} />
    </AppShell>
  );
}
