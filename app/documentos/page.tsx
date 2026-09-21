import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getFeatureFlags } from "@/lib/feature-flags";
import { requireTenantContext } from "@/lib/tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DocumentosPage() {
  let ctx;
  try { ctx = await requireTenantContext(); } catch { redirect("/"); }

  const flags = getFeatureFlags();
  const db = await createSupabaseServerClient();
  const { data: company } = await db
    .from("companies")
    .select("id,trade_name")
    .eq("tenant_id", ctx.tenantId)
    .limit(1)
    .maybeSingle();

  const { data: version } = await db
    .from("data_submission_attestation_versions")
    .select("id,version,title,declaration_text,warning_text,genesis_responsibility_text")
    .eq("code", "DIAGNOSTIC_EVIDENCE_UPLOAD")
    .eq("status", "active")
    .maybeSingle();

  const { data: evidence, error: evidenceError } = company
    ? await db
        .from("evidence_items")
        .select("id,evidence_type,source_ref,summary,captured_at,verification_status,sensitivity")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .order("captured_at", { ascending: false })
        .limit(50)
    : { data: [], error: null };

  const evidenceTypeLabel: Record<string, string> = {
    user_declaration: "Declaração",
    document: "Documento",
    metric: "Métrica",
    integration: "Integração",
    observation: "Observação",
    agent_output: "Saída de agente",
  };

  const evidenceStatusLabel: Record<string, string> = {
    unverified: "Não verificada",
    pending: "Em verificação",
    verified: "Verificada",
    rejected: "Rejeitada",
    expired: "Expirada",
  };

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Evidências e documentos</div>
          <h1 className="page-title">Envio governado</h1>
          <p className="page-subtitle">
            Todo upload exige finalidade apresentada, declaração versionada e
            trilha auditável. A declaração do usuário não transfere as
            obrigações próprias da GENESIS.
          </p>
        </div>
      </header>

      {!version ? (
        <section className="card empty-state">
          <h3>Envio ainda não habilitado.</h3>
          <p>
            A infraestrutura de declaração e sessão de upload está pronta, mas
            a versão jurídica da declaração permanece em revisão. Nenhum
            checkbox genérico será usado para contornar esse gate.
          </p>
        </section>
      ) : (
        <section className="card card-pad">
          <div className="kicker">{version.title}</div>
          <p className="page-subtitle">{version.declaration_text}</p>
          <div className="callout" style={{ marginTop: 18 }}>
            {version.warning_text}
          </div>
          <p className="metric-note" style={{ marginTop: 16 }}>
            {version.genesis_responsibility_text}
          </p>
          <label className="attestation-check">
            <input type="checkbox" disabled={!flags.dataUpload || !company} />
            <span>Li, compreendi e confirmo a declaração apresentada.</span>
          </label>
          <button className="button button-primary" disabled>
            Iniciar envio
          </button>
          <p className="metric-note">
            O botão permanece desabilitado neste pacote porque o fluxo binário
            de upload, antivírus/content scan e retenção ainda não passou pelo
            gate de produção.
          </p>
        </section>
      )}

      <section className="evidence-register" aria-labelledby="evidence-register-title">
        <div className="section-heading-row">
          <div>
            <span className="section-eyebrow">Base informacional</span>
            <h2 id="evidence-register-title">Evidências registradas</h2>
          </div>
          <span className="badge">{evidence?.length ?? 0} registros</span>
        </div>

        {evidenceError ? (
          <div className="precision-empty" role="status">
            <strong>Não foi possível carregar as evidências.</strong>
            <p>A indisponibilidade permanece explícita e não é convertida em ausência de dados.</p>
          </div>
        ) : evidence?.length ? (
          <ol className="evidence-list">
            {evidence.map((item) => (
              <li key={item.id}>
                <div className="evidence-list-main">
                  <div className="evidence-list-meta">
                    <span>{evidenceTypeLabel[item.evidence_type] ?? item.evidence_type}</span>
                    <span>{new Intl.DateTimeFormat("pt-BR").format(new Date(item.captured_at))}</span>
                  </div>
                  <strong>{item.summary}</strong>
                  {item.source_ref ? <small>Fonte: {item.source_ref}</small> : null}
                </div>
                <span className={`evidence-status is-${item.verification_status}`}>
                  {evidenceStatusLabel[item.verification_status] ?? item.verification_status}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="precision-empty">
            <strong>Nenhuma evidência registrada para esta empresa.</strong>
            <p>
              Declarações e referências documentais aparecerão aqui com origem,
              data e estado de verificação. Ausência de evidência não será tratada como confirmação.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
