import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { loadDashboardOverview } from "@/lib/dashboard-overview";

const dimensionLabels: Record<string, string> = {
  EST: "Estratégia",
  INO: "Inovação",
  MKT: "Marketing",
  VEN: "Vendas",
  CLI: "Cliente",
  OPE: "Operações",
  FIN: "Financeiro",
  TAX: "Tributário",
  PES: "Pessoas",
  TEC: "Tecnologia",
  JUR: "Jurídico",
  RSC: "Riscos",
};

function humanMissionStatus(status: string | undefined) {
  if (!status) return "Nenhuma missão ativa";
  const labels: Record<string, string> = {
    SUGGESTED: "Pronta para sua decisão",
    ACCEPTED: "Aceita",
    IN_PROGRESS: "Em andamento",
    EVIDENCE_PENDING: "Aguardando evidência",
    COMPLETED: "Execução concluída",
    OUTCOME_PENDING: "Aguardando resultado",
    PAUSED: "Pausada",
    BLOCKED: "Bloqueada",
  };
  return labels[status] ?? status.replaceAll("_", " ").toLowerCase();
}

export default async function DashboardPage() {
  const data = await loadDashboardOverview();

  const overall = data?.growthScore ?? null;
  const averageConfidence = data?.confidencePercent ?? null;

  const priority = data?.pains[0] ?? null;
  const orderedScores = [...(data?.scores ?? [])].sort(
    (a, b) => (a.score ?? Infinity) - (b.score ?? Infinity),
  );

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

        <section className="executive-section">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Foco executivo</span>
              <h2>Suas prioridades agora</h2>
            </div>
            {data?.pains.length ? (
              <Link className="text-action" href="/prioridades">
                Abrir análise completa
              </Link>
            ) : null}
          </div>

          {data?.pains.length ? (
            <ol className="executive-priority-list">
              {data.pains.map((pain, index) => (
                <li key={pain.id}>
                  <div className="priority-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="priority-copy">
                    <strong>{pain.title}</strong>
                    <span>
                      {pain.gap_summary ??
                        "Finding registrado pelo diagnóstico vigente."}
                    </span>
                  </div>
                  <div className="priority-confidence">
                    <span>confiança</span>
                    <strong>
                      {Math.round(Number(pain.confidence) * 100)}%
                    </strong>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="precision-empty">
              <strong>Ainda não há prioridades calculadas.</strong>
              <p>
                O diagnóstico cria a primeira baseline para o Genesis separar
                evidência, gap e prioridade.
              </p>
              <Link className="button button-secondary" href="/diagnostico-v1">
                Construir primeira leitura
              </Link>
            </div>
          )}
        </section>

        <section className="executive-section executive-two-column">
          <div>
            <div className="section-heading-row">
              <div>
                <span className="section-eyebrow">Maturidade</span>
                <h2>Onde a empresa precisa de mais atenção</h2>
              </div>
              <Link className="text-action" href="/indicadores">
                Ver indicadores
              </Link>
            </div>

            {orderedScores.length ? (
              <div className="dimension-bars">
                {orderedScores.slice(0, 6).map((score) => (
                  <div className="dimension-bar-row" key={score.dimension}>
                    <span>
                      {dimensionLabels[score.dimension] ?? score.dimension}
                    </span>
                    <div
                      className="dimension-track"
                      role="progressbar"
                      aria-label={`${dimensionLabels[score.dimension] ?? score.dimension}: ${score.score === null ? "sem informação suficiente" : `${score.score} de 100`}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={score.score === null ? undefined : Number(score.score)}
                    >
                      <i style={{ width: `${score.score === null ? 0 : Number(score.score)}%` }} />
                    </div>
                    <strong>{score.score === null ? "—" : Math.round(Number(score.score))}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="precision-empty compact">
                <p>Os indicadores aparecerão após a primeira leitura.</p>
              </div>
            )}
          </div>

          <aside className="mission-focus">
            <div className="section-eyebrow">Missão em foco</div>
            <h2>
              {data?.mission
                ? "Continue a execução da decisão atual."
                : "Transforme uma prioridade em ação."}
            </h2>
            <p>
              {data?.mission
                ? `Situação: ${humanMissionStatus(data.mission.status)}. Continue a missão, registre evidências e feche o ciclo com um outcome.`
                : "Quando uma decisão gerar uma missão, esta área mostrará a próxima ação prática sem competir com o restante da dashboard."}
            </p>
            <div className="mission-step-line" aria-hidden="true">
              <span className={data?.mission ? "done" : "current"} />
              <span className={data?.mission ? "current" : ""} />
              <span />
              <span />
            </div>
            <Link className="button button-secondary" href="/missoes">
              {data?.mission ? "Continuar missão" : "Abrir Evolução"}
            </Link>
          </aside>
        </section>

        <section className="executive-footnote">
          <div>
            <span className="section-eyebrow">Business Passport</span>
            <strong>
              {data?.passportFacts ?? 0} fatos empresariais ativos
            </strong>
          </div>
          <Link className="text-action" href="/passaporte">
            Revisar dados da empresa
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
