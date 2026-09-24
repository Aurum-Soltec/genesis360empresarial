import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";

export default async function IndicadoresPage() {
  const ctx = await requirePageTenantContext("/indicadores");

  const db = await createSupabaseServerClient();
  const demoTenant = isDemoTenantAllowed(ctx.tenantId);
  const selection = await selectUniqueTenantCompany(db, ctx.tenantId, demoTenant);
  if (selection.status !== "ready") return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="indicators-company-required">
        <p className="kicker">Indicadores</p>
        <h1 id="indicators-company-required">{selection.status === "ambiguous" ? "Seleção da empresa necessária" : "A empresa ainda não está vinculada."}</h1>
        <p>{selection.status === "ambiguous" ? "Há mais de uma empresa elegível neste tenant. Os indicadores não podem ser atribuídos a uma delas sem seleção explícita." : demoTenant ? "O roteiro demonstrativo requer uma empresa fictícia vinculada ao tenant." : "Peça ao administrador para provisionar uma empresa antes de consultar indicadores."}</p>
      </section>
    </AppShell>
  );
  const companyId = selection.company.id;
  const { data: diagnostic, error: diagnosticError } = await db
    .from("diagnostics")
    .select("id,coverage,confidence,submitted_at,growth_score,growth_score_status")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", companyId)
    .eq("status", "scored")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (diagnosticError) throw new Error("INDICATORS_DIAGNOSTIC_READ_FAILED");

  const scoresResult = diagnostic
    ? await db
          .from("score_results")
          .select("dimension,score,coverage,confidence,rule_version")
          .eq("tenant_id", ctx.tenantId)
          .eq("diagnostic_id", diagnostic.id)
          .order("score")
    : { data: [], error: null };
  if (scoresResult.error) throw new Error("INDICATORS_SCORES_READ_FAILED");
  const scores = scoresResult.data ?? [];

  const overall = diagnostic?.growth_score ?? null;

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Maturidade empresarial</div>
          <h1 className="page-title">Indicadores</h1>
          <p className="page-subtitle">
            Score, cobertura e confiança são dimensões diferentes e permanecem
            visíveis separadamente.
          </p>
        </div>
      </header>

      <section className="manager-grid">
        <article className="card score-summary">
          <div>
            <div className="kicker">Growth Score</div>
            <div className="score-number">
              {overall ?? "—"}
              {overall !== null ? <small>/100</small> : null}
            </div>
          </div>
          <p className="muted">
            {diagnostic
              ? `Cobertura global ${diagnostic.coverage ?? "—"}% · confiança ${diagnostic.confidence ?? "—"}%.`
              : "Ainda não há diagnóstico pontuado."}
          </p>
        </article>

        <article className="card card-pad">
          <div className="kicker">Leitura</div>
          <h2 className="section-title" style={{ marginTop: 10 }}>
            Não use score sem cobertura.
          </h2>
          <p className="page-subtitle">
            O Genesis bloqueia pontuação definitiva quando a cobertura é
            insuficiente e preserva a versão da regra usada no cálculo.
          </p>
        </article>
      </section>

      <section className="section">
        {!scores.length ? (
          <div className="card empty-state">
            <h3>Sem score por dimensão.</h3>
            <p>Conclua o diagnóstico para formar a primeira baseline.</p>
          </div>
        ) : (
          <div className="metric-grid">
            {scores.map((score) => (
              <article className="card metric" key={score.dimension}>
                <div className="metric-label">{score.dimension}</div>
                <div className="metric-value">
                  {score.score === null ? "—" : `${score.score}/100`}
                </div>
                <div className="metric-note">
                  cobertura {score.coverage}% · confiança {score.confidence}% ·{" "}
                  {score.rule_version}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
