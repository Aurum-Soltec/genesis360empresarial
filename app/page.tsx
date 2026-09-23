import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { loadDashboardOverview } from "@/lib/dashboard-overview";
import { requirePageTenantContext } from "@/lib/page-tenant-context";

export default async function DashboardPage() {
  const context = await requirePageTenantContext("/");
  const data = await loadDashboardOverview(context);

  if (!data) return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="company-provisioning-required">
        <p className="section-eyebrow">Empresa ativa</p>
        <h1 id="company-provisioning-required">O acesso está pronto; falta vincular a empresa.</h1>
        <p>Peça ao administrador para provisionar uma empresa neste tenant. Até isso acontecer, diagnóstico, indicadores e recomendações permanecem indisponíveis.</p>
        <Link className="button button-secondary" href="/passaporte">Abrir Business Passport</Link>
      </section>
    </AppShell>
  );

  const overall = data?.growthScore ?? null;
  const averageConfidence = data?.confidencePercent ?? null;

  const priority = data?.pains[0] ?? null;
  return (
    <AppShell>
      <div className="executive-home">
        <header className="executive-header">
          <div>
            <div className="section-eyebrow">Hoje</div>
            <h1>{data?.companyName ?? "Sua empresa no Genesis"}</h1>
            <p>
              Uma visão objetiva do que merece atenção e do próximo movimento
              mais útil para a empresa.
            </p>
          </div>
          <div className="executive-header-status">
            <span className="status-dot" aria-hidden="true" />
            <span>
              {data?.latestDiagnosticId
                ? "Leitura empresarial disponível"
                : "Primeira leitura pendente"}
            </span>
          </div>
        </header>

        <section className="executive-hero" aria-label="Resumo executivo">
          <div className="executive-hero-copy">
            <div className="section-eyebrow">Próximo movimento</div>
            <h2>
              {priority
                ? priority.title
                : "Construa sua primeira leitura empresarial."}
            </h2>
            <p>
              {priority?.gap_summary ??
                "Conclua o diagnóstico para o Genesis separar sinais, prioridades e confiança antes de recomendar uma ação."}
            </p>

            <div className="executive-action-context">
              {priority ? (
                <>
                  <span>Prioridade atual</span>
                  <span>
                    Confiança {Math.round(Number(priority.confidence) * 100)}%
                  </span>
                </>
              ) : (
                <span>Sem dados fictícios ou estimativas de preenchimento</span>
              )}
            </div>

            <div className="action-row executive-actions">
              <Link
                className="button button-primary"
                href={
                  data?.latestDiagnosticId
                    ? "/prioridades"
                    : "/diagnostico-v1"
                }
              >
                {data?.latestDiagnosticId
                  ? "Ver recomendação"
                  : "Iniciar diagnóstico"}
              </Link>
              <Link className="text-action" href="/indicadores">
                Entender a leitura
              </Link>
            </div>
          </div>

          <div className="executive-score-panel">
            <div className="score-pair">
              <div>
                <span className="metric-label">Growth Score</span>
                <strong className="executive-score">
                  {overall ?? "—"}
                  {overall !== null ? <small>/100</small> : null}
                </strong>
              </div>
              <div>
                <span className="metric-label">Confiabilidade</span>
                <strong className="executive-confidence">
                  {averageConfidence !== null
                    ? `${averageConfidence}%`
                    : "—"}
                </strong>
              </div>
            </div>

            <div className="confidence-summary">
              <div className="meter-head">
                <span>Base informacional</span>
                <span>
                  {averageConfidence === null
                    ? "Sem leitura"
                    : averageConfidence >= 82
                      ? "Alta"
                      : averageConfidence >= 65
                        ? "Boa"
                        : averageConfidence >= 45
                          ? "Moderada"
                          : "Baixa"}
                </span>
              </div>
              <div
                className="precision-meter"
                role="progressbar"
                aria-label="Confiabilidade média da leitura"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={averageConfidence ?? 0}
              >
                <span style={{ width: `${averageConfidence ?? 0}%` }} />
              </div>
              <p>
                Score e confiança permanecem separados. O Genesis não transforma
                falta de informação em falsa maturidade.
              </p>
            </div>
          </div>
        </section>

      </div>
    </AppShell>
  );
}
