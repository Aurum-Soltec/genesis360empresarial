import { AppShell } from "@/components/app-shell";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PrivacidadePage() {
  const ctx = await requirePageTenantContext("/privacidade");

  const db = await createSupabaseServerClient();
  const { data: purposes } = await db
    .from("consent_purposes")
    .select("code,description,required_for_core")
    .eq("active", true)
    .order("required_for_core", { ascending: false });

  const { data: decisions } = await db
    .from("consents")
    .select("purpose_code,granted,decision_at,created_at,company_id")
    .eq("tenant_id", ctx.tenantId)
    .eq("user_id", ctx.userId)
    .order("decision_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  type ConsentDecision = NonNullable<typeof decisions>[number];
  const latestByPurpose = new Map<string, ConsentDecision>();
  for (const decision of decisions ?? []) {
    if (
      decision.purpose_code &&
      !latestByPurpose.has(decision.purpose_code)
    ) {
      latestByPurpose.set(decision.purpose_code, decision);
    }
  }

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Privacidade e finalidade</div>
          <h1 className="page-title">Consentimentos</h1>
          <p className="page-subtitle">
            O Genesis separa operação, IA, matching, ecossistema e benchmark.
            Uma autorização não é reutilizada silenciosamente para outra
            finalidade.
          </p>
        </div>
      </header>

      <section className="priority-list">
        {(purposes ?? []).map((purpose) => {
          const decision = latestByPurpose.get(purpose.code);
          return (
            <article className="card card-pad" key={purpose.code}>
              <div className="brief-meta">
                <span>{purpose.code}</span>
                <span>{purpose.required_for_core ? "Core" : "Opcional"}</span>
              </div>
              <h2 className="section-title" style={{ marginTop: 10 }}>
                {decision
                  ? decision.granted
                    ? "Autorizado"
                    : "Não autorizado"
                  : "Sem decisão registrada"}
              </h2>
              <p className="page-subtitle">{purpose.description}</p>
              {!decision ? (
                <p className="metric-note">
                  A UX de aceite só deve ser habilitada quando houver uma
                  versão de texto de consentimento aprovada e ativa.
                </p>
              ) : null}
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
