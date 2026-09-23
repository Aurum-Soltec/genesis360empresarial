import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CapacidadesPage() {
  const ctx = await requirePageTenantContext("/capacidades");

  const db = await createSupabaseServerClient();
  const { data: company, error: companyError } = await db
    .from("companies")
    .select("id,trade_name")
    .eq("tenant_id", ctx.tenantId)
    .limit(1)
    .maybeSingle();
  if (companyError) throw new Error("CAPABILITIES_COMPANY_READ_FAILED");

  const { data: subscriptions, error: subscriptionsError } = await db
    .from("tenant_subscriptions")
    .select("plan_id,status")
    .eq("tenant_id", ctx.tenantId)
    .in("status", ["trialing", "active"])
    .limit(1);
  if (subscriptionsError) throw new Error("CAPABILITIES_SUBSCRIPTIONS_READ_FAILED");

  const planId = subscriptions?.[0]?.plan_id ?? null;
  const { data: plan, error: planError } = planId
    ? await db
        .from("plan_catalog")
        .select("name,provider_network_eligible")
        .eq("id", planId)
        .maybeSingle()
    : { data: null, error: null };
  if (planError) throw new Error("CAPABILITIES_PLAN_READ_FAILED");

  const { data: rows, error: rowsError } = company
    ? await db
        .from("provider_capabilities")
        .select(
          "id,capability_id,qualification_status,qualification_score,capacity_status,compliance_status,valid_until",
        )
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .order("updated_at", { ascending: false })
    : { data: [] as Array<Record<string, unknown>>, error: null };
  if (rowsError) throw new Error("CAPABILITIES_ROWS_READ_FAILED");

  const capabilityIds = [...new Set((rows ?? []).map((row) => String(row.capability_id)))];
  const { data: capabilities, error: capabilitiesError } = capabilityIds.length
    ? await db
        .from("capabilities")
        .select("id,code,title,domain")
        .in("id", capabilityIds)
    : { data: [] as Array<Record<string, unknown>>, error: null };
  if (capabilitiesError) throw new Error("CAPABILITIES_CATALOG_READ_FAILED");
  const capabilityById = new Map(
    (capabilities ?? []).map((item) => [String(item.id), item]),
  );

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Empresa prestadora</div>
          <h1 className="page-title">Minhas capacidades</h1>
          <p className="page-subtitle">
            A empresa só participa da Rede Genesis quando capability,
            qualificação, compliance, capacidade e elegibilidade comercial
            estiverem válidos.
          </p>
        </div>
      </header>

      <section className="card card-pad">
        <div className="metric-label">Plano atual</div>
        <h2 className="section-title" style={{ marginTop: 10 }}>
          {plan?.name ?? "Sem assinatura ativa registrada"}
        </h2>
        <p className="metric-note">
          Elegibilidade de rede:{" "}
          {plan?.provider_network_eligible
            ? "habilitada pelo plano"
            : "não habilitada / decisão pendente"}
          . O plano nunca altera o ranking.
        </p>
      </section>

      <section className="section">
        {!rows?.length ? (
          <div className="card empty-state">
            <h3>Nenhuma capability qualificada ainda.</h3>
            <p>
              O cadastro e a metodologia de qualificação serão administrados
              pelo Genesis sem autoaprovação pelo próprio provider.
            </p>
          </div>
        ) : (
          <div className="priority-list">
            {rows.map((row) => {
              const capability = capabilityById.get(String(row.capability_id)) as
                | { title?: string; code?: string; domain?: string }
                | undefined;
              return (
                <article className="card card-pad" key={String(row.id)}>
                  <div className="brief-meta">
                    <span>{capability?.domain ?? "Capability"}</span>
                    <span>{String(row.qualification_status)}</span>
                    <span>{String(row.compliance_status)}</span>
                  </div>
                  <h2 className="section-title" style={{ marginTop: 10 }}>
                    {capability?.title ?? capability?.code ?? "Capability"}
                  </h2>
                  <p className="metric-note">
                    Score{" "}
                    {row.qualification_score === null
                      ? "—"
                      : Math.round(Number(row.qualification_score))}
                    /100 · capacidade {String(row.capacity_status)}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
