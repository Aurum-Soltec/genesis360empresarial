import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MissionActions } from "./mission-actions";

export default async function MissoesPage() {
  const ctx = await requirePageTenantContext("/missoes");

  const db = await createSupabaseServerClient();
  const { data: missions } = await db
    .from("missions")
    .select(
      "id,template_id,decision_record_id,status,personalized_payload,due_at,accepted_at,completed_at,created_at",
    )
    .eq("tenant_id", ctx.tenantId)
    .order("created_at", { ascending: false })
    .limit(50);

  const templateIds = [
    ...new Set((missions ?? []).map((mission) => mission.template_id)),
  ];
  const { data: templates } = templateIds.length
    ? await db
        .from("mission_templates")
        .select("id,code,title,objective,steps,evidence_requirements,expected_metric")
        .in("id", templateIds)
    : { data: [] as Array<Record<string, unknown>> };

  const templateById = new Map(
    (templates ?? []).map((template) => [String(template.id), template]),
  );

  const missionIds = (missions ?? []).map((mission) => mission.id);
  const { data: evidence } = missionIds.length
    ? await db
        .from("mission_evidence")
        .select("mission_id,verification_status")
        .eq("tenant_id", ctx.tenantId)
        .in("mission_id", missionIds)
    : { data: [] as Array<{ mission_id: string; verification_status: string }> };

  const evidenceCount = new Map<string, number>();
  for (const item of evidence ?? []) {
    evidenceCount.set(
      item.mission_id,
      (evidenceCount.get(item.mission_id) ?? 0) + 1,
    );
  }

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Decisão → execução → outcome</div>
          <h1 className="page-title">Missões</h1>
          <p className="page-subtitle">
            Cada missão possui estado explícito, critério de execução, evidência
            e resultado. Clique e login não geram evolução.
          </p>
        </div>
      </header>

      {!missions?.length ? (
        <section className="card empty-state">
          <h3>Nenhuma missão sugerida ainda.</h3>
          <p>
            Abra Prioridades, registre um GDS e transforme a decisão em uma
            missão versionada.
          </p>
        </section>
      ) : (
        <section className="priority-list">
          {missions.map((mission) => {
            const template = templateById.get(mission.template_id) as
              | {
                  code?: string;
                  title?: string;
                  objective?: string;
                }
              | undefined;

            return (
              <article className="card card-pad" key={mission.id}>
                <div className="brief-meta">
                  <span>{template?.code ?? "MISSÃO"}</span>
                  <span>{mission.status}</span>
                  <span>{evidenceCount.get(mission.id) ?? 0} evidência(s)</span>
                </div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  {template?.title ?? "Missão Genesis"}
                </h2>
                <p className="page-subtitle">
                  {template?.objective ??
                    "Objetivo definido pela biblioteca versionada de missões."}
                </p>
                {mission.due_at ? (
                  <p className="metric-note">
                    Prazo: {new Date(mission.due_at).toLocaleDateString("pt-BR")}
                  </p>
                ) : null}
                <MissionActions
                  missionId={mission.id}
                  status={mission.status}
                />
              </article>
            );
          })}
        </section>
      )}
    </AppShell>
  );
}
