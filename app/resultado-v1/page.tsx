import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

function maturityLabel(score: number | null) {
  if (score === null) return "Ainda sem leitura";
  if (score < 35) return "Estruturando fundamentos";
  if (score < 55) return "Em evolução";
  if (score < 72) return "Maturidade em consolidação";
  if (score < 86) return "Boa maturidade";
  return "Alta maturidade";
}

export default async function ResultadoV1({
  searchParams,
}: {
  searchParams: Promise<{ diagnostic?: string }>;
}) {
  const ctx = await requireTenantContext().catch(() => null);
  if (!ctx) redirect("/");

  const params = await searchParams;
  const db = await createSupabaseServerClient();

  let diagnosticId = params.diagnostic ?? null;

  if (!diagnosticId) {
    const { data: latest } = await db
      .from("diagnostics")
      .select("id")
      .eq("tenant_id", ctx.tenantId)
      .eq("status", "scored")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    diagnosticId = latest?.id ?? null;
  }

  if (!diagnosticId) redirect("/diagnostico-v1");

  const { data: diagnosticRow } = await db
    .from("diagnostics")
    .select("id,company_id,status,coverage,confidence,confidence_level,submitted_at,growth_score,growth_score_status,confidence_rule_version")
    .eq("tenant_id", ctx.tenantId)
    .eq("id", diagnosticId)
    .maybeSingle();

  if (!diagnosticRow || diagnosticRow.status !== "scored") redirect("/diagnostico-v1");

  const { data: company } = await db
    .from("companies")
    .select("trade_name")
    .eq("tenant_id", ctx.tenantId)
    .eq("id", diagnosticRow.company_id)
    .maybeSingle();

  const { data: scores } = await db
    .from("score_results")
    .select("dimension,score,coverage,confidence,rule_version")
    .eq("tenant_id", ctx.tenantId)
    .eq("diagnostic_id", diagnosticId)
    .order("score");

  const { data: pains } = await db
    .from("pain_findings")
    .select("id,title,dimension,severity,confidence,gap_summary")
    .eq("tenant_id", ctx.tenantId)
    .eq("diagnostic_id", diagnosticId)
    .order("severity", { ascending: false })
    .limit(3);

  const overall: number | null = diagnosticRow.growth_score;
  const confidence: number | null = diagnosticRow.confidence_rule_version && diagnosticRow.confidence !== null
    ? Math.round(Number(diagnosticRow.confidence)) : null;

  const primaryPain = pains?.[0] ?? null;

  return (
    <AppShell>
      <div className="result-experience">
        <header className="result-header">
          <div>
            <span className="section-eyebrow">Sua leitura empresarial</span>
            <h1>{company?.trade_name ?? "Resultado Genesis 360"}</h1>
            <p>
              Primeiro a interpretação. Score, cobertura, confiança e
              metodologia continuam disponíveis sem competir com a decisão.
            </p>
          </div>
          <Link className="button button-secondary" href="/diagnostico-v1">
            Atualizar diagnóstico
          </Link>
        </header>

        <section className="result-hero">
          <div className="result-score">
            {overall === null ? <p className="metric-note">
              {diagnosticRow.growth_score_status === "legacy_unreviewed"
                ? "Leitura histórica: realize nova avaliação com a regra corrigida."
                : "Cobertura insuficiente para o índice global. Sem nota não significa nota zero."}
            </p> : null}
            <span>Growth Score</span>
            <strong>
              {overall ?? "—"}
              {overall !== null ? <small>/100</small> : null}
            </strong>
            <p>{maturityLabel(overall)}</p>
          </div>

          <div className="result-confidence">
            <div className="meter-head">
              <span>Confiabilidade da análise</span>
              <strong>{confidence !== null ? `${confidence}%` : "—"}</strong>
            </div>
            <div
              className="precision-meter confidence"
              role="progressbar"
              aria-label="Confiabilidade da análise"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={confidence ?? 0}
            >
              <span style={{ width: `${confidence ?? 0}%` }} />
            </div>
            <p>
              Cobertura {diagnosticRow.coverage ?? "—"}%. A confiança permanece
              separada do score para deixar explícita a qualidade da base
              informacional.
            </p>
          </div>

          <div className="result-next-move">
            <span className="section-eyebrow">O que merece atenção agora</span>
            <h2>
              {primaryPain?.title ??
                "Nenhuma prioridade suficientemente forte foi registrada."}
            </h2>
            <p>
              {primaryPain?.gap_summary ??
                "Revise a cobertura e as respostas pendentes antes de transformar incerteza em recomendação."}
            </p>
            <div className="action-row">
              <Link className="button button-primary" href="/prioridades">
                Ver plano de decisão
              </Link>
              <Link className="text-action" href="/indicadores">
                Entender os números
              </Link>
            </div>
          </div>
        </section>

        <section className="result-section">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Prioridades</span>
              <h2>Os sinais mais importantes desta leitura</h2>
            </div>
          </div>

          {pains?.length ? (
            <ol className="executive-priority-list">
              {pains.map((pain, index) => (
                <li key={pain.id}>
                  <div className="priority-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="priority-copy">
                    <strong>{pain.title}</strong>
                    <span>
                      {pain.gap_summary ?? "Finding registrado pelo diagnóstico."}
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
              <strong>Sem prioridades suficientes para recomendar ação.</strong>
              <p>
                Isso é preferível a preencher a tela com conclusões sem base.
              </p>
            </div>
          )}
        </section>

        <section className="result-section">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Maturidade por dimensão</span>
              <h2>Onde a empresa está mais forte e onde há espaço para evoluir</h2>
            </div>
          </div>

          {scores?.length ? (
            <div className="dimension-bars result-dimensions">
              {scores.map((score) => (
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
                  <small>
                    cob. {score.coverage}% · conf. {score.confidence}%
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div className="precision-empty">
              <p>Sem score persistido para este diagnóstico.</p>
            </div>
          )}
        </section>

        <details className="methodology-disclosure">
          <summary>Ver detalhes técnicos da leitura</summary>
          <div>
            <p>
              Uma dor identificada não é automaticamente uma causa-raiz. O
              Genesis preserva score, cobertura e confiança separadamente e usa
              o GDS para validar evidências antes de recomendar intervenção.
            </p>
            <p>
              Resultado gerado pelo diagnóstico selecionado. Versões de regra
              permanecem registradas nos score results.
            </p>
          </div>
        </details>
      </div>
    </AppShell>
  );
}
