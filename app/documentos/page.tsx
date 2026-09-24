import { AppShell } from "@/components/app-shell";
import { DemoEvidenceTemplates, canonicalDemoEvidenceCount, isCanonicalDemoEvidenceRecord } from "@/lib/demo-scenario";
import { getFeatureFlags, isDemoTenantAllowed } from "@/lib/feature-flags";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DemoPackage } from "./demo-package";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";

export default async function DocumentosPage() {
  const ctx = await requirePageTenantContext("/documentos");

  const flags = getFeatureFlags();
  const demoTenant = isDemoTenantAllowed(ctx.tenantId);
  const db = await createSupabaseServerClient();
  const selection = await selectUniqueTenantCompany(db, ctx.tenantId, demoTenant);
  if (selection.status === "ambiguous") return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="documents-company-ambiguous">
        <p className="kicker">Evidências e documentos</p>
        <h1 id="documents-company-ambiguous">Seleção da empresa necessária</h1>
        <p>Há mais de uma empresa elegível neste tenant. O registro de evidências não escolhe uma empresa arbitrariamente e o pacote fictício permanece indisponível.</p>
      </section>
    </AppShell>
  );
  const company = selection.company;
  const demoAllowed = demoTenant && Boolean(company?.fictional);

  const { data: version, error: versionError } = await db
    .from("data_submission_attestation_versions")
    .select("id,version,title,declaration_text,warning_text,genesis_responsibility_text")
    .eq("code", "DIAGNOSTIC_EVIDENCE_UPLOAD")
    .eq("status", "active")
    .maybeSingle();
  if (versionError) throw new Error("DOCUMENTS_ATTESTATION_READ_FAILED");

  const evidenceFields = "id,evidence_type,source_ref,summary,captured_at,verification_status,sensitivity,payload,purpose_codes" as const;
  const evidenceResult = !company
    ? { data: [], error: null }
    : demoAllowed
      ? await db.from("evidence_items").select(evidenceFields)
          .eq("tenant_id", ctx.tenantId).eq("company_id", company.id)
          .in("source_ref", DemoEvidenceTemplates.map((item) => item.sourceRef))
          .order("captured_at", { ascending: false })
      : await db.from("evidence_items").select(evidenceFields)
          .eq("tenant_id", ctx.tenantId).eq("company_id", company.id)
          .order("captured_at", { ascending: false }).limit(50);
  const { data: evidence, error: evidenceError } = evidenceResult;

  const { data: latestDiagnostic, error: latestDiagnosticError } = company && demoAllowed
    ? await db
        .from("diagnostics")
        .select("id")
        .eq("tenant_id", ctx.tenantId)
        .eq("company_id", company.id)
        .in("status", ["draft", "scored"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null, error: null };
  if (latestDiagnosticError) throw new Error("DOCUMENTS_DIAGNOSTIC_READ_FAILED");

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
  const displayedEvidence = demoAllowed
    ? (evidence ?? []).filter(isCanonicalDemoEvidenceRecord)
    : (evidence ?? []);

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

      {company && demoAllowed && !evidenceError ? (
        <DemoPackage
          companyId={company.id}
          diagnosticId={latestDiagnostic?.id ?? null}
          loaded={canonicalDemoEvidenceCount(evidence) === DemoEvidenceTemplates.length}
        />
      ) : null}

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
          <span className="badge">{displayedEvidence.length} registros</span>
        </div>

        {evidenceError ? (
          <div className="precision-empty" role="status">
            <strong>Não foi possível carregar as evidências.</strong>
            <p>A indisponibilidade permanece explícita e não é convertida em ausência de dados.</p>
          </div>
        ) : displayedEvidence.length ? (
          <ol className="evidence-list">
            {displayedEvidence.map((item) => (
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
