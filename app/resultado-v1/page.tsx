import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { BrandMark } from "@/components/brand-mark";
import { PrintReportButton } from "@/components/print-report-button";
import {
  answersWithEvidence,
  evidenceIdsFromAnswers,
  evidenceSetComplete,
  verifiedEvidenceCount,
} from "@/lib/report-provenance";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildExecutivePlan, evidenceQualityMessage } from "@/lib/report-insights";
import { buildDemoSolutionPreview } from "@/lib/demo-solution-preview";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";

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
  const params = await searchParams;
  const destination = params.diagnostic
    ? `/resultado-v1?diagnostic=${encodeURIComponent(params.diagnostic)}`
    : "/resultado-v1";
  const ctx = await requirePageTenantContext(destination);
  const db = await createSupabaseServerClient();

  let diagnosticId = params.diagnostic ?? null;

  if (!diagnosticId) {
    const { data: latest, error: latestError } = await db
      .from("diagnostics")
      .select("id")
      .eq("tenant_id", ctx.tenantId)
      .eq("status", "scored")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latestError) throw new Error("REPORT_DIAGNOSTIC_READ_FAILED");
    diagnosticId = latest?.id ?? null;
  }

  if (!diagnosticId) redirect("/diagnostico-v1");

  const { data: diagnosticRow, error: diagnosticError } = await db
    .from("diagnostics")
    .select("id,company_id,status,coverage,confidence,confidence_level,submitted_at,growth_score,growth_score_status,confidence_rule_version")
    .eq("tenant_id", ctx.tenantId)
    .eq("id", diagnosticId)
    .maybeSingle();
  if (diagnosticError) throw new Error("REPORT_DIAGNOSTIC_READ_FAILED");

  if (!diagnosticRow || diagnosticRow.status !== "scored") redirect("/diagnostico-v1");

  const { data: company, error: companyError } = await db
    .from("companies")
    .select("trade_name,fictional")
    .eq("tenant_id", ctx.tenantId)
    .eq("id", diagnosticRow.company_id)
    .maybeSingle();
  if (companyError) throw new Error("REPORT_COMPANY_READ_FAILED");
  const demoSelection = company?.fictional && isDemoTenantAllowed(ctx.tenantId)
    ? await selectUniqueTenantCompany(db, ctx.tenantId, true)
    : null;
  const isCurrentDemoCompany = demoSelection?.status === "ready" && demoSelection.company.id === diagnosticRow.company_id;

  const { data: scores, error: scoresError } = await db
    .from("score_results")
    .select("dimension,score,coverage,confidence,rule_version")
    .eq("tenant_id", ctx.tenantId)
    .eq("diagnostic_id", diagnosticId)
    .order("score");

  const { data: pains, error: painsError } = await db
    .from("pain_findings")
    .select("id,title,dimension,severity,confidence,gap_summary")
    .eq("tenant_id", ctx.tenantId)
    .eq("diagnostic_id", diagnosticId)
    .order("severity", { ascending: false })
    .limit(3);
  if (scoresError || painsError) throw new Error("REPORT_ANALYSIS_READ_FAILED");

  const { data: answerEvidenceRows, error: answerEvidenceError } = await db
    .from("answers")
    .select("evidence_refs")
    .eq("tenant_id", ctx.tenantId)
    .eq("diagnostic_id", diagnosticId);

  const { data: diagnosticEvidenceLinks, error: diagnosticEvidenceLinksError } = await db
    .from("evidence_links")
    .select("evidence_id,relation")
    .eq("tenant_id", ctx.tenantId)
    .eq("company_id", diagnosticRow.company_id)
    .eq("subject_type", "diagnostic")
    .eq("subject_id", diagnosticId);

  const evidenceIds = [
    ...new Set([
      ...evidenceIdsFromAnswers(answerEvidenceRows),
      ...(diagnosticEvidenceLinks ?? []).map((link) => link.evidence_id),
    ]),
  ];
  const { data: evidenceRows, error: evidenceError } = evidenceIds.length
    ? await db
        .from("evidence_items")
        .select("id,evidence_type,source_ref,summary,captured_at,verification_status")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", diagnosticRow.company_id)
        .in("id", evidenceIds)
        .order("captured_at", { ascending: false })
    : { data: [], error: null };

  const provenanceAvailable =
    !answerEvidenceError && !diagnosticEvidenceLinksError && !evidenceError &&
    evidenceSetComplete(evidenceIds, evidenceRows);
  const evidencedAnswers = answersWithEvidence(answerEvidenceRows);
  const verifiedEvidence = verifiedEvidenceCount(evidenceRows);
  const contextualSourceCount = (diagnosticEvidenceLinks ?? [])
    .filter((link) => link.relation === "context_for").length;
  const ruleVersions = [...new Set((scores ?? []).map((score) => score.rule_version).filter(Boolean))];
  const reportDate = diagnosticRow.submitted_at
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" })
        .format(new Date(diagnosticRow.submitted_at))
    : "Data de conclusão indisponível";

  const overall: number | null = diagnosticRow.growth_score;
  const confidence: number | null = diagnosticRow.confidence_rule_version && diagnosticRow.confidence !== null
    ? Math.round(Number(diagnosticRow.confidence)) : null;

  const primaryPain = pains?.[0] ?? null;
  const executivePlan = buildExecutivePlan((scores ?? []).map((score) => ({
    dimension: score.dimension,
    score: score.score === null ? null : Number(score.score),
  })));
  const demoSolutionPreview = isCurrentDemoCompany
    ? buildDemoSolutionPreview((scores ?? []).map((score) => ({
        dimension: score.dimension,
        score: score.score === null ? null : Number(score.score),
      })))
    : [];
  const evidenceQuality = provenanceAvailable
    ? evidenceQualityMessage(evidenceRows?.length ?? 0, verifiedEvidence)
    : "A proveniência está indisponível; nenhuma conclusão sobre ausência de evidência foi assumida.";

  return (
    <AppShell>
      <div className="result-experience">
        <div className="report-print-brand" aria-hidden="true">
          <BrandMark />
          <span>Relatório executivo de diagnóstico empresarial</span>
        </div>
        <header className="result-header">
          <div>
            <span className="section-eyebrow">Sua leitura empresarial</span>
            <h1>{company?.trade_name ?? "Resultado Genesis 360"}</h1>
            <p>
              Primeiro a interpretação. Score, cobertura, confiança e
              metodologia continuam disponíveis sem competir com a decisão.
            </p>
          </div>
          <div className="result-header-actions">
            <PrintReportButton />
            <Link className="button button-secondary" href="/diagnostico-v1">
              Atualizar diagnóstico
            </Link>
          </div>
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
              aria-valuenow={confidence ?? undefined}
              aria-valuetext={confidence === null ? "Sem leitura" : undefined}
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

        <section className="result-section executive-brief" aria-labelledby="executive-brief-title">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Síntese executiva</span>
              <h2 id="executive-brief-title">Leitura, limite e direção recomendada</h2>
            </div>
          </div>
          <div className="executive-brief-grid">
            <article>
              <span>Leitura principal</span>
              <p>{primaryPain?.gap_summary ?? "A base ainda não sustenta uma prioridade única. Complete as informações críticas antes de decidir."}</p>
            </article>
            <article>
              <span>Qualidade da evidência</span>
              <p>{evidenceQuality}</p>
            </article>
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

        <section className="result-section ninety-day-plan" aria-labelledby="ninety-day-title">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Plano executivo</span>
              <h2 id="ninety-day-title">Próximos 90 dias</h2>
            </div>
          </div>
          {executivePlan.length ? (
            <ol>
              {executivePlan.map((item) => (
                <li key={item.horizon}>
                  <div><span>{item.horizon}</span><strong>{item.dimension} · leitura {Math.round(item.score)}/100</strong></div>
                  <p>{item.action}</p>
                  <small>Evidência de conclusão: {item.evidence}</small>
                </li>
              ))}
            </ol>
          ) : (
            <div className="precision-empty"><p>Não há dimensões suficientes para formar um plano responsável.</p></div>
          )}
        </section>

        {demoSolutionPreview.length ? (
          <section className="result-section solution-preview" aria-labelledby="solution-preview-title">
            <div className="section-heading-row">
              <div>
                <span className="section-eyebrow">Soluções compatíveis com as necessidades</span>
                <h2 id="solution-preview-title">Capacidades que podem apoiar as prioridades</h2>
              </div>
              <Link className="text-action report-screen-only" href={`/demonstracao/solucoes?diagnostic=${diagnosticId}`}>
                Ver análise de aderência
              </Link>
            </div>
            <div className="solution-boundary" role="note">
              <strong>Simulação demonstrativa.</strong>
              <span>Empresas 100% fictícias · Qualification Network desligada · contato real desligado</span>
            </div>
            <ol className="solution-preview-grid">
              {demoSolutionPreview.map((solution) => (
                <li key={solution.dimension}>
                  <div className="solution-preview-head">
                    <span>{solution.dimensionLabel} · {Math.round(solution.score)}/100</span>
                    <strong>Compatibilidade {solution.compatibility.toLowerCase()}</strong>
                  </div>
                  <h3>{solution.service}</h3>
                  <p>{solution.outcome}</p>
                  <div className="fictional-provider">
                    <span>Empresa fictícia ilustrativa</span>
                    <strong>{solution.providerName}</strong>
                    <small>{solution.providerSpecialty}</small>
                  </div>
                  <small className="solution-explanation">{solution.explanation}</small>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="result-section result-dimensions-section">
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

        <section className="result-section report-provenance" aria-labelledby="report-provenance-title">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">Rastreabilidade</span>
              <h2 id="report-provenance-title">Origem e limites da leitura</h2>
            </div>
            <Link className="text-action report-screen-only" href="/documentos">
              Revisar evidências
            </Link>
          </div>

          <div className="provenance-metrics">
            <div>
              <span>Respostas avaliadas</span>
              <strong>{answerEvidenceRows?.length ?? "Indisponível"}</strong>
            </div>
            <div>
              <span>Respostas com referência declarada</span>
              <strong>{provenanceAvailable ? evidencedAnswers : "Indisponível"}</strong>
            </div>
            <div>
              <span>Fontes registradas no diagnóstico</span>
              <strong>{provenanceAvailable ? evidenceRows?.length ?? 0 : "Indisponível"}</strong>
            </div>
            <div>
              <span>Fontes verificadas</span>
              <strong>{provenanceAvailable ? verifiedEvidence : "Indisponível"}</strong>
            </div>
          </div>

          <p className="report-provenance-note">
            Referência declarada não comprova que a fonte sustenta a resposta. A
            pertinência e a verificação devem ser confirmadas antes de usar esta
            leitura como fato documental.
            {contextualSourceCount > 0
              ? " As fontes de contexto do diagnóstico não validam respostas individuais nem o score."
              : ""}
            {isCurrentDemoCompany ? " Neste cenário, as fontes são fictícias." : ""}
          </p>

          {!provenanceAvailable ? (
            <div className="precision-empty compact">
              <p>A proveniência não pôde ser carregada. O relatório não presume ausência de evidência.</p>
            </div>
          ) : evidenceRows?.length ? (
            <ol className="report-evidence-list">
              {evidenceRows.slice(0, 8).map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.summary}</strong>
                    <span>
                      {item.source_ref ? `${item.source_ref} · ` : ""}
                      {new Intl.DateTimeFormat("pt-BR").format(new Date(item.captured_at))}
                    </span>
                  </div>
                  <span>{item.verification_status === "verified" ? "Verificada" : "Não verificada"}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="precision-empty compact">
              <p>Esta leitura foi calculada com respostas declaradas, sem evidência vinculada.</p>
            </div>
          )}

          <div className="report-method-meta">
            <span>Diagnóstico: {diagnosticId}</span>
            <span>Concluído em: {reportDate}</span>
            <span>Regra de score: {ruleVersions.join(", ") || "não informada"}</span>
            <span>Regra de confiança: {diagnosticRow.confidence_rule_version ?? "não informada"}</span>
          </div>
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
