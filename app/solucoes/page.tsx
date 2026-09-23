import { AppShell } from "@/components/app-shell";
import { getFeatureFlags, isDemoTenantAllowed } from "@/lib/feature-flags";
import { loadQualifiedSolutionsForPain } from "@/lib/server/qualified-solutions";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";
import { ContactButton } from "./contact-button";

export default async function SolucoesPage({
  searchParams,
}: {
  searchParams: Promise<{ pain?: string }>;
}) {
  const ctx = await requirePageTenantContext("/solucoes");

  const flags = getFeatureFlags();
  const params = await searchParams;
  const db = await createSupabaseServerClient();
  const demoTenant = isDemoTenantAllowed(ctx.tenantId);
  const networkEnabled = flags.qualificationNetwork && !demoTenant;
  const selection = networkEnabled
    ? await selectUniqueTenantCompany(db, ctx.tenantId)
    : null;
  const company = selection?.status === "ready" && !selection.company.fictional
    ? selection.company : null;

  let painId = params.pain ?? null;
  let pain:
    | {
        id: string;
        title: string;
        pain_code: string;
        gap_summary: string | null;
      }
    | null = null;

  if (painId && company) {
    const { data, error } = await db
      .from("pain_findings")
      .select("id,title,pain_code,gap_summary")
      .eq("tenant_id", ctx.tenantId)
      .eq("company_id", company.id)
      .eq("id", painId)
      .maybeSingle();
    if (error) throw new Error("SOLUTIONS_PAIN_READ_FAILED");
    pain = data ?? null;
  } else if (company) {
    const { data: diagnostic, error: diagnosticError } = await db
      .from("diagnostics")
      .select("id")
      .eq("tenant_id", ctx.tenantId)
      .eq("company_id", company.id)
      .eq("status", "scored")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (diagnosticError) throw new Error("SOLUTIONS_DIAGNOSTIC_READ_FAILED");

    if (diagnostic) {
      const { data, error } = await db
        .from("pain_findings")
        .select("id,title,pain_code,gap_summary")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .eq("diagnostic_id", diagnostic.id)
        .order("severity", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error("SOLUTIONS_PAIN_READ_FAILED");
      pain = data ?? null;
      painId = pain?.id ?? null;
    }
  }

  const search = networkEnabled && company && pain
    ? await loadQualifiedSolutionsForPain(ctx, pain.id)
    : null;

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Necessidade → capability → elegibilidade</div>
          <h1 className="page-title">Soluções qualificadas</h1>
          <p className="page-subtitle">
            Com base nas necessidades identificadas no diagnóstico, o Genesis
            pode encontrar empresas qualificadas na Rede Genesis. Plano pode
            habilitar participação, mas nunca compra posição no ranking.
          </p>
        </div>
      </header>

      {!networkEnabled ? (
        <section className="card empty-state">
          <h3>{demoTenant ? "Rede real indisponível na demonstração." : "Qualification Network está protegida por feature flag."}</h3>
          <p>
            {demoTenant ? "Empresas fictícias aparecem apenas na prévia controlada; nenhum fornecedor real é recomendado neste tenant." : "A fundação está implementada, porém a rede permanece desligada por padrão até política, thresholds e elegibilidade comercial serem aprovados e testados."}
          </p>
        </section>
      ) : !company ? (
        <section className="card empty-state">
          <h3>Empresa real não selecionada.</h3>
          <p>Esta consulta exige uma única empresa real neste tenant. Nenhuma dor de outra empresa será usada para buscar fornecedores.</p>
        </section>
      ) : !pain ? (
        <section className="card empty-state">
          <h3>Precisamos primeiro de uma necessidade identificada.</h3>
          <p>
            Conclua o diagnóstico para o Genesis determinar a dor e buscar a
            capability necessária.
          </p>
        </section>
      ) : (
        <>
          <section className="card card-pad">
            <div className="kicker">Necessidade atual</div>
            <h2 className="section-title" style={{ marginTop: 10 }}>
              {pain.title}
            </h2>
            <p className="page-subtitle">{pain.gap_summary}</p>
          </section>

          <section className="section">
            {search?.status === "POLICY_PENDING" ? (
              <div className="card empty-state">
                <h3>Política de qualificação ainda não publicada.</h3>
                <p>
                  O Genesis falha fechado: nenhum provider aparece enquanto
                  threshold e critérios V1 não forem formalmente aprovados.
                </p>
              </div>
            ) : search?.status === "NO_CAPABILITY_MAPPING" ? (
              <div className="card empty-state">
                <h3>Capability ainda não mapeada.</h3>
                <p>
                  A dor está registrada, mas a metodologia ainda não possui uma
                  regra publicada pain → capability. O Genesis não inventa uma
                  categoria para preencher a tela.
                </p>
              </div>
            ) : search?.status === "NO_ELIGIBLE_PROVIDERS" ? (
              <div className="card empty-state">
                <h3>Nenhuma empresa elegível neste momento.</h3>
                <p>
                  A necessidade continua registrada. Não exibimos empresas que
                  falharam em qualificação, compliance, capacidade ou
                  elegibilidade comercial.
                </p>
              </div>
            ) : search?.status === "READY" ? (
              <div className="priority-list">
                {search.solutions.map((solution) => (
                  <article className="card card-pad" key={solution.providerCapabilityId}>
                    <div className="brief-meta">
                      <span>Qualificada para atender esta necessidade</span>
                      <span>{solution.capabilityTitle}</span>
                    </div>
                    <h2 className="section-title" style={{ marginTop: 12 }}>
                      {solution.providerName}
                    </h2>
                    <p className="page-subtitle">
                      {solution.providerSector
                        ? `Setor: ${solution.providerSector}. `
                        : ""}
                      Qualificação {Math.round(solution.qualificationScore)}/100 ·
                      capacidade {solution.capacityStatus}.
                    </p>
                    <div
                      className="card card-soft card-pad"
                      style={{ marginTop: 16 }}
                    >
                      <div className="metric-label">Por que apareceu</div>
                      <p className="metric-note">
                        Fit {Math.round(solution.explanation.fit * 100)}% ·
                        qualificação{" "}
                        {Math.round(solution.explanation.qualification * 100)}%
                        {solution.explanation.capacity !== null
                          ? ` · capacidade ${Math.round(
                              solution.explanation.capacity * 100,
                            )}%`
                          : " · capacidade sem score numérico"}
                        . Outcomes ainda não entram sem evidência suficiente.
                      </p>
                      <p className="metric-note">
                        {solution.explanation.note}
                      </p>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <ContactButton
                        painId={pain.id}
                        providerCapabilityId={solution.providerCapabilityId}
                        enabled={flags.realContact}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </>
      )}
    </AppShell>
  );
}
