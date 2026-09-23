import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { buildDemoSolutionPreview } from "@/lib/demo-solution-preview";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

export default async function DemoSolutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ diagnostic?: string }>;
}) {
  const ctx = await requirePageTenantContext("/demonstracao/solucoes");
  if (!isDemoTenantAllowed(ctx.tenantId)) return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="demo-solutions-unavailable">
        <p className="kicker">Soluções compatíveis</p>
        <h1 id="demo-solutions-unavailable">A prévia de empresas fictícias está disponível apenas no tenant de demonstração.</h1>
        <p>Nenhuma empresa real foi classificada ou recomendada por esta tela.</p>
        <Link className="button button-secondary" href="/solucoes">Ver disponibilidade de soluções qualificadas</Link>
      </section>
    </AppShell>
  );

  const db = await createSupabaseServerClient();
  const params = await searchParams;
  let diagnosticId = params.diagnostic ?? null;
  if (!diagnosticId) {
    const { data: latest } = await db.from("diagnostics").select("id").eq("tenant_id", ctx.tenantId).eq("status", "scored").order("created_at", { ascending: false }).limit(1).maybeSingle();
    diagnosticId = latest?.id ?? null;
  }
  if (!diagnosticId) return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="demo-solutions-needs-report">
        <p className="kicker">Prévia de soluções</p>
        <h1 id="demo-solutions-needs-report">Conclua o diagnóstico para ver as soluções compatíveis.</h1>
        <p>A prévia usa necessidades do relatório e exibe somente provedores fictícios, com justificativa de aderência.</p>
        <Link className="button button-primary" href="/diagnostico-v1">Abrir diagnóstico</Link>
      </section>
    </AppShell>
  );

  const { data: diagnostic } = await db.from("diagnostics").select("id,company_id,growth_score,confidence").eq("tenant_id", ctx.tenantId).eq("id", diagnosticId).eq("status", "scored").maybeSingle();
  if (!diagnostic) return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="demo-solutions-report-missing">
        <p className="kicker">Prévia de soluções</p>
        <h1 id="demo-solutions-report-missing">Ainda não há um relatório concluído para esta prévia.</h1>
        <p>Finalize o diagnóstico da empresa de demonstração e depois retorne para revisar o encaixe das soluções simuladas.</p>
        <Link className="button button-primary" href="/diagnostico-v1">Continuar diagnóstico</Link>
      </section>
    </AppShell>
  );
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
