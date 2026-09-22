import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { buildDemoSolutionPreview } from "@/lib/demo-solution-preview";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireTenantContext } from "@/lib/tenant-context";

export default async function DemoSolutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ diagnostic?: string }>;
}) {
  const ctx = await requireTenantContext().catch(() => null);
  if (!ctx) redirect("/");
  if (!isDemoTenantAllowed(ctx.tenantId)) notFound();

  const db = await createSupabaseServerClient();
  const params = await searchParams;
  let diagnosticId = params.diagnostic ?? null;
  if (!diagnosticId) {
    const { data: latest } = await db.from("diagnostics").select("id").eq("tenant_id", ctx.tenantId).eq("status", "scored").order("created_at", { ascending: false }).limit(1).maybeSingle();
    diagnosticId = latest?.id ?? null;
  }
  if (!diagnosticId) redirect("/demonstracao");

  const { data: diagnostic } = await db.from("diagnostics").select("id,company_id,growth_score,confidence").eq("tenant_id", ctx.tenantId).eq("id", diagnosticId).eq("status", "scored").maybeSingle();
  if (!diagnostic) redirect("/demonstracao");
  const [{ data: company }, { data: scores }] = await Promise.all([
    db.from("companies").select("trade_name").eq("tenant_id", ctx.tenantId).eq("id", diagnostic.company_id).maybeSingle(),
    db.from("score_results").select("dimension,score").eq("tenant_id", ctx.tenantId).eq("diagnostic_id", diagnostic.id),
  ]);
  const solutions = buildDemoSolutionPreview((scores ?? []).map((item) => ({ dimension: item.dimension, score: item.score === null ? null : Number(item.score) })));

  return (
    <AppShell>
      <header className="page-header demo-subpage-header">
        <div>
          <div className="kicker">Demonstração controlada</div>
          <h1 className="page-title">Soluções compatíveis</h1>
          <p className="page-subtitle">Uma tradução das menores leituras de {company?.trade_name ?? "empresa fictícia"} em capacidades de apoio, com a lógica de aderência aberta.</p>
        </div>
        <Link className="button button-secondary" href={`/resultado-v1?diagnostic=${diagnostic.id}`}>Voltar ao relatório</Link>
      </header>

      <div className="solution-boundary" role="status">
        <strong>Dados e empresas 100% fictícios.</strong>
        <span>Qualification Network: desligada · Contato real: desligado · nenhuma contratação é recomendada</span>
      </div>

      <section className="solution-analysis-summary" aria-label="Resumo da simulação">
        <div><span>Growth Score</span><strong>{diagnostic.growth_score ?? "—"}</strong></div>
        <div><span>Confiança</span><strong>{diagnostic.confidence === null ? "—" : `${Math.round(Number(diagnostic.confidence))}%`}</strong></div>
        <div><span>Soluções analisadas</span><strong>{solutions.length}</strong></div>
      </section>

      {solutions.length ? (
        <ol className="solution-analysis-list">
          {solutions.map((solution, index) => (
            <li key={solution.dimension}>
              <div className="solution-rank">{String(index + 1).padStart(2, "0")}</div>
              <div className="solution-analysis-copy">
                <span className="section-eyebrow">{solution.dimensionLabel} · leitura {Math.round(solution.score)}/100</span>
                <h2>{solution.service}</h2>
                <p>{solution.outcome}</p>
                <details>
                  <summary>Por que esta solução aparece</summary>
                  <p>{solution.explanation}</p>
                </details>
              </div>
              <aside className="fictional-provider-card">
                <span>Empresa fictícia ilustrativa</span>
                <strong>{solution.providerName}</strong>
                <p>{solution.providerSpecialty}</p>
                <small>Contato indisponível nesta simulação</small>
              </aside>
            </li>
          ))}
        </ol>
      ) : (
        <section className="card empty-state"><h2>Sem leitura suficiente</h2><p>Conclua o diagnóstico antes de formar uma simulação de aderência.</p></section>
      )}
    </AppShell>
  );
}
