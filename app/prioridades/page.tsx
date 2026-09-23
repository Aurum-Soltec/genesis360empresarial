import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PriorityActions } from "./priority-actions";

export default async function PrioridadesPage() {
  const ctx = await requirePageTenantContext("/prioridades");

  const db = await createSupabaseServerClient();
  const { data: diagnostic, error: diagnosticError } = await db
    .from("diagnostics")
    .select("id,company_id")
    .eq("tenant_id", ctx.tenantId)
    .eq("status", "scored")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (diagnosticError) throw new Error("PRIORITIES_DIAGNOSTIC_READ_FAILED");

  const painsResult = diagnostic
    ? await db
          .from("pain_findings")
          .select("id,title,dimension,severity,confidence,gap_summary")
          .eq("tenant_id", ctx.tenantId)
          .eq("diagnostic_id", diagnostic.id)
          .order("severity", { ascending: false })
          .limit(3)
    : { data: [], error: null };
  if (painsResult.error) throw new Error("PRIORITIES_FINDINGS_READ_FAILED");
  const pains = painsResult.data ?? [];

  const painIds = pains.map((pain) => pain.id);
  const decisionsResult = painIds.length
    ? await db
          .from("decision_records")
          .select("id,pain_finding_id,problem,confidence,recommendation,validation_plan")
          .eq("tenant_id", ctx.tenantId)
          .in("pain_finding_id", painIds)
          .order("created_at", { ascending: false })
    : { data: [], error: null };
  if (decisionsResult.error) throw new Error("PRIORITIES_DECISIONS_READ_FAILED");
  const decisions = decisionsResult.data ?? [];

  const decisionByPain = new Map<string, (typeof decisions)[number]>();
  for (const decision of decisions) {
    if (
      decision.pain_finding_id &&
      !decisionByPain.has(decision.pain_finding_id)
    ) {
      decisionByPain.set(decision.pain_finding_id, decision);
    }
  }

  const decisionIds = [...decisionByPain.values()].map((decision) => decision.id);
  const missionsResult = decisionIds.length
    ? await db
          .from("missions")
          .select("id,decision_record_id,status")
          .eq("tenant_id", ctx.tenantId)
          .in("decision_record_id", decisionIds)
          .order("created_at", { ascending: false })
    : { data: [], error: null };
  if (missionsResult.error) throw new Error("PRIORITIES_MISSIONS_READ_FAILED");
  const missions = missionsResult.data ?? [];

  const missionByDecision = new Map<string, (typeof missions)[number]>();
  for (const mission of missions) {
    if (
      mission.decision_record_id &&
      !missionByDecision.has(mission.decision_record_id)
    ) {
      missionByDecision.set(mission.decision_record_id, mission);
    }
  }

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Diagnóstico → decisão</div>
          <h1 className="page-title">Prioridades</h1>
          <p className="page-subtitle">
            O Genesis separa problema, evidência, confiança e próxima ação. Uma
            dor não é tratada como causa-raiz comprovada.
          </p>
        </div>
      </header>

      {!pains.length ? (
        <section className="card empty-state">
          <h3>Ainda não há prioridades calculadas.</h3>
          <p>
            Conclua um diagnóstico com cobertura suficiente para gerar os
            primeiros pain findings.
          </p>
        </section>
      ) : (
        <section className="priority-list">
          {pains.map((pain, index) => {
            const decision = decisionByPain.get(pain.id) ?? null;
            const mission = decision
              ? missionByDecision.get(decision.id) ?? null
              : null;

            return (
              <article className="card card-pad" key={pain.id}>
                <div className="brief-meta">
                  <span>Prioridade {index + 1}</span>
                  <span>{pain.dimension}</span>
                  <span>
                    Confiança {Math.round(Number(pain.confidence) * 100)}%
                  </span>
                </div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  {pain.title}
                </h2>
                <p className="page-subtitle">{pain.gap_summary}</p>

                {decision ? (
                  <div
                    className="card card-soft card-pad"
                    style={{ marginTop: 18 }}
                  >
                    <div className="kicker">Genesis Decision Standard</div>
                    <p style={{ marginBottom: 8 }}>{decision.problem}</p>
                    <p className="metric-note">
                      GDS registrado · confiança{" "}
                      {Math.round(Number(decision.confidence) * 100)}%
                      {mission ? ` · missão ${mission.status}` : ""}
                    </p>
                  </div>
                ) : (
                  <div
                    className="callout"
                    style={{ marginTop: 18 }}
                  >
                    Causa-raiz ainda não validada. O GDS começará pela evidência
                    disponível e registrará explicitamente os gaps.
                  </div>
                )}

                <div style={{ marginTop: 18 }}>
                  <PriorityActions
                    painId={pain.id}
                    decisionId={decision?.id ?? null}
                    missionId={mission?.id ?? null}
                  />
                </div>
              </article>
            );
          })}
        </section>
      )}
    </AppShell>
  );
}
