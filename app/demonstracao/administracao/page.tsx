import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { assessDemoAdministration } from "@/lib/demo-administration";
import { DemoEvidenceTemplates, canonicalDemoEvidenceCount } from "@/lib/demo-scenario";
import { buildDemoSolutionPreview, canAccessDemoAdministration } from "@/lib/demo-solution-preview";
import { getFeatureFlags, isDemoTenantAllowed } from "@/lib/feature-flags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";

export default async function DemoAdministrationPage() {
  const ctx = await requirePageTenantContext("/demonstracao/administracao");
  if (!isDemoTenantAllowed(ctx.tenantId) || !canAccessDemoAdministration(ctx.role)) notFound();

  const db = await createSupabaseServerClient();
  const flags = getFeatureFlags();
  const [{ data: tenant, error: tenantError }, selection] = await Promise.all([
    db.from("tenants").select("name,status").eq("id", ctx.tenantId).maybeSingle(),
    selectUniqueTenantCompany(db, ctx.tenantId, true),
  ]);
  if (tenantError) throw new Error("DEMO_ADMIN_CONTEXT_READ_FAILED");
  if (selection.status !== "ready") return (
    <AppShell>
      <section className="card empty-state" aria-labelledby="demo-admin-company-unavailable">
        <p className="kicker">Administração · demonstração</p>
        <h1 id="demo-admin-company-unavailable">{selection.status === "ambiguous" ? "Empresas fictícias ambíguas" : "Empresa fictícia ausente"}</h1>
        <p>Esta central requer uma única empresa fictícia no tenant ativo. Nenhum dado real foi convertido em conteúdo demonstrativo.</p>
        <Link className="button button-secondary" href="/demonstracao">Voltar ao roteiro</Link>
      </section>
    </AppShell>
  );
  const company = selection.company;
  const [{ data: latest, error: latestError }, { data: scored, error: scoredError }] = await Promise.all([
    company
      ? db.from("diagnostics").select("id,status,profile_code,growth_score").eq("tenant_id", ctx.tenantId).eq("company_id", company.id).order("created_at", { ascending: false }).limit(1).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    company
      ? db.from("diagnostics").select("id,profile_code,growth_score").eq("tenant_id", ctx.tenantId).eq("company_id", company.id).eq("status", "scored").order("created_at", { ascending: false }).limit(1).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (latestError || scoredError) throw new Error("DEMO_ADMIN_DIAGNOSTICS_READ_FAILED");
  const [{ data: evidence, error: evidenceError }, { data: scores, error: scoresError }] = await Promise.all([
    company
      ? db.from("evidence_items").select("id,verification_status,source_ref,evidence_type,summary,payload,sensitivity,purpose_codes").eq("tenant_id", ctx.tenantId).eq("company_id", company.id)
      : Promise.resolve({ data: [], error: null }),
    scored
      ? db.from("score_results").select("dimension,score").eq("tenant_id", ctx.tenantId).eq("diagnostic_id", scored.id)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (evidenceError || scoresError) throw new Error("DEMO_ADMIN_BASIS_READ_FAILED");
  const verifiedEvidence = (evidence ?? []).filter((item) => item.verification_status === "verified").length;
  const canonicalEvidence = canonicalDemoEvidenceCount(evidence ?? []);
  const simulatedSolutions = buildDemoSolutionPreview((scores ?? []).map((item) => ({
    dimension: item.dimension,
    score: item.score === null ? null : Number(item.score),
  })));
  const flagRows = [
    ["Agentic", flags.agentic],
    ["Data Upload para usuários reais", flags.dataUpload],
    ["Qualification Network", flags.qualificationNetwork],
    ["Real Contact", flags.realContact],
    ["Ecosystem", flags.ecosystem],
  ] as const;
  const checks = assessDemoAdministration({
    tenantStatus: tenant?.status ?? null,
    companyFictional: company?.fictional ?? null,
    canonicalSourceCount: canonicalEvidence,
    canonicalSourceTarget: DemoEvidenceTemplates.length,
    scoredDiagnosticExists: Boolean(scored),
    simulatedSolutionCount: simulatedSolutions.length,
    flags,
  });

  return (
    <AppShell>
      <header className="page-header demo-subpage-header">
        <div>
          <div className="kicker">Administração · demonstração</div>
          <h1 className="page-title">Central Genesis</h1>
          <p className="page-subtitle">Visão restrita ao tenant fictício para acompanhar prontidão, diagnóstico, evidências e limites operacionais durante a apresentação.</p>
        </div>
        <Link className="button button-secondary" href="/demonstracao">Voltar ao roteiro</Link>
      </header>

      <div className="solution-boundary" role="status">
        <strong>Central administrativa demonstrativa.</strong>
        <span>Escopo: {tenant?.name ?? "tenant selecionado"} · seu perfil: {ctx.role} · sem acesso global à plataforma</span>
      </div>

      <div className="solution-boundary" role="status">
        <strong>{checks.presentationChecksReady ? "Checagens do roteiro demonstrativo atendidas." : "Roteiro demonstrativo requer revisão."}</strong>
        <span>Esta leitura cobre apenas os dados exibidos abaixo. Não representa aprovação de HSP-4, prontidão de produção, validação documental ou segurança externa.</span>
      </div>

      <section className="admin-demo-metrics" aria-label="Indicadores administrativos">
        <article><span>Empresa</span><strong>{company?.trade_name ?? "Pendente"}</strong><small>{company?.fictional ? "Cadastro fictício controlado" : "Confirme o marcador fictício"}</small></article>
        <article><span>Diagnóstico</span><strong>{latest?.status ?? "Pendente"}</strong><small>{scored ? `Último relatório concluído: ${scored.profile_code} · score ${scored.growth_score ?? "—"}` : "Sem relatório concluído"}</small></article>
        <article><span>Fontes da demo</span><strong>{canonicalEvidence} registradas</strong><small>{evidence?.length ?? 0} registros no ledger · {verifiedEvidence} com status verificado; registro não prova análise do conteúdo</small></article>
        <article><span>Seu acesso</span><strong>{ctx.role}</strong><small>Contagem de outros membros não disponível nesta leitura restrita</small></article>
      </section>

      <div className="admin-demo-grid">
        <section className="admin-demo-panel">
          <div className="section-heading-row"><div><span className="section-eyebrow">Controle da apresentação</span><h2>Checagens do roteiro</h2></div></div>
          <ol className="admin-checklist">
            <li className={checks.companyReady ? "is-ready" : ""}><span>Tenant ativo e empresa marcada fictícia</span><strong>{checks.companyReady ? "DISPONÍVEL" : "REVISAR"}</strong></li>
            <li className={checks.sourcesRegistered ? "is-ready" : ""}><span>Três fontes fictícias registradas</span><strong>{checks.sourcesRegistered ? "REGISTRADAS" : "PENDENTE"}</strong></li>
            <li className={checks.reportAvailable ? "is-ready" : ""}><span>Relatório de diagnóstico concluído</span><strong>{checks.reportAvailable ? "DISPONÍVEL" : "PENDENTE"}</strong></li>
            <li className={checks.simulatedSolutionsAvailable ? "is-ready" : ""}><span>Prévia calculada de soluções fictícias</span><strong>{checks.simulatedSolutionsAvailable ? `${simulatedSolutions.length} EXIBÍVEIS` : "PENDENTE"}</strong></li>
            <li className={checks.sensitiveFeaturesOff ? "is-ready" : ""}><span>Cinco funções sensíveis desligadas</span><strong>{checks.sensitiveFeaturesOff ? "DESLIGADAS" : "REVISAR"}</strong></li>
          </ol>
        </section>

        <section className="admin-demo-panel">
          <div className="section-heading-row"><div><span className="section-eyebrow">Segurança funcional</span><h2>Flags sensíveis</h2></div></div>
          <ul className="admin-flag-list">
            {flagRows.map(([label, enabled]) => (
              <li key={label}><span>{label}</span><strong className={enabled ? "is-on" : ""}>{enabled ? "LIGADA" : "DESLIGADA"}</strong></li>
            ))}
          </ul>
          <p className="admin-demo-note">A simulação de soluções é local ao tenant demonstrativo. Ela não liga a rede comercial, não publica ranking real e não libera contato.</p>
        </section>
      </div>

      {checks.companyReady && scored ? (
        <div className="action-row admin-demo-actions">
          <Link className="button button-primary" href={`/resultado-v1?diagnostic=${scored.id}`}>Abrir relatório executivo</Link>
          <Link className="button button-secondary" href={`/demonstracao/solucoes?diagnostic=${scored.id}`}>Revisar soluções simuladas</Link>
        </div>
      ) : null}
    </AppShell>
  );
}
