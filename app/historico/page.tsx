import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HistoricoPage() {
  const ctx = await requirePageTenantContext("/historico");

  const db = await createSupabaseServerClient();
  const { data: company } = await db
    .from("companies")
    .select("id,trade_name")
    .eq("tenant_id", ctx.tenantId)
    .limit(1)
    .maybeSingle();

  const events = company
    ? (
        await db
          .from("business_timeline_events")
          .select(
            "id,event_type,occurred_at,actor_type,subject_type,subject_id,payload,source_ref",
          )
          .eq("tenant_id", ctx.tenantId)
          .eq("company_id", company.id)
          .order("occurred_at", { ascending: false })
          .limit(100)
      ).data ?? []
    : [];

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Business Timeline</div>
          <h1 className="page-title">Histórico</h1>
          <p className="page-subtitle">
            Evolução temporal preservada: fatos, decisões, missões e outcomes
            não são reduzidos ao estado atual.
          </p>
        </div>
      </header>

      {!events.length ? (
        <section className="card empty-state">
          <h3>A Timeline ainda está vazia.</h3>
          <p>
            Atualizações do Passport, missões e outcomes começarão a construir
            o histórico empresarial.
          </p>
        </section>
      ) : (
        <section className="priority-list">
          {events.map((event) => (
            <article className="card card-pad" key={event.id}>
              <div className="brief-meta">
                <span>{event.event_type}</span>
                <span>{event.actor_type}</span>
                <span>
                  {new Date(event.occurred_at).toLocaleString("pt-BR")}
                </span>
              </div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {event.subject_type}
              </h2>
              <p className="metric-note">
                Referência: {event.subject_id ?? "—"}
              </p>
            </article>
          ))}
        </section>
      )}
    </AppShell>
  );
}
