import Link from "next/link";
import { headers } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { loadDashboardOverview, type DashboardTimingPhase } from "@/lib/dashboard-overview";
import { operationalLog } from "@/lib/observability";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import type { TenantContextTimingPhase } from "@/lib/tenant-context";

type HomeTimingPhase = TenantContextTimingPhase | DashboardTimingPhase;

async function logHomeTiming(started: number, phases: Partial<Record<HomeTimingPhase, number>>) {
  try {
    const correlation = (await headers()).get("x-correlation-id");
    const safeCorrelation = correlation && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(correlation)
      ? correlation : null;
    console.log(operationalLog("info", "home_latency", {
      ...(safeCorrelation ? { correlation_id: safeCorrelation } : {}),
      duration_ms: Math.round((performance.now() - started) * 100) / 100,
      phases_ms: phases,
    }));
  } catch { /* Telemetry must never change page rendering or authorization. */ }
}

async function observeHomeReads<T>(
  trace: boolean,
  run: (observe: ((phase: HomeTimingPhase, durationMs: number) => void) | undefined) => Promise<T>,
): Promise<T> {
  if (!trace) return run(undefined);
  const started = performance.now();
  const phases: Partial<Record<HomeTimingPhase, number>> = {};
  const observe = (phase: HomeTimingPhase, durationMs: number) => {
    phases[phase] = Math.round(durationMs * 100) / 100;
  };
  try {
    return await run(observe);
  } finally {
    await logHomeTiming(started, phases);
  }
}

export default async function DashboardPage() {
  let data: Awaited<ReturnType<typeof loadDashboardOverview>>;
  try {
    data = await observeHomeReads(process.env.HSP4_PERF_TRACE === "1", async (observe) => {
      const context = await requirePageTenantContext("/", "api.default", observe);
      return loadDashboardOverview(context, observe);
    });
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "COMPANY_SELECTION_REQUIRED") throw error;
    return (
      <AppShell>
        <section className="card empty-state" aria-labelledby="company-selection-required">
          <p className="section-eyebrow">Empresa ativa</p>
          <h1 id="company-selection-required">É preciso escolher uma empresa.</h1>
          <p>Há mais de uma empresa neste contexto. O Genesis não mostrará score, prioridades ou missões de uma empresa arbitrária. Peça ao administrador para definir a empresa ativa; essa seleção ainda não está disponível nesta versão.</p>
        </section>
      </AppShell>
    );
  }

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
                aria-valuenow={averageConfidence ?? undefined}
                aria-valuetext={averageConfidence === null ? "Sem leitura" : undefined}
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
