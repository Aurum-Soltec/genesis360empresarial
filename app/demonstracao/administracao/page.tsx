import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { canAccessDemoAdministration } from "@/lib/demo-solution-preview";
import { getFeatureFlags, isDemoTenantAllowed } from "@/lib/feature-flags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireTenantContext } from "@/lib/tenant-context";

export default async function DemoAdministrationPage() {
  const ctx = await requireTenantContext().catch(() => null);
  if (!ctx) redirect("/");
  if (!isDemoTenantAllowed(ctx.tenantId) || !canAccessDemoAdministration(ctx.role)) notFound();

  const db = await createSupabaseServerClient();
  const flags = getFeatureFlags();
  const [{ data: tenant }, { data: company }, { data: memberships }] = await Promise.all([
    db.from("tenants").select("name,status").eq("id", ctx.tenantId).maybeSingle(),
    db.from("companies").select("id,trade_name,sector,fictional").eq("tenant_id", ctx.tenantId).limit(1).maybeSingle(),
    db.from("memberships").select("id,role").eq("tenant_id", ctx.tenantId),
  ]);
  const { data: diagnostics } = company
    ? await db.from("diagnostics").select("id,status,profile_code,growth_score,confidence,coverage,submitted_at").eq("tenant_id", ctx.tenantId).eq("company_id", company.id).order("created_at", { ascending: false }).limit(10)
    : { data: [] };
  const latest = diagnostics?.[0] ?? null;
  const scored = diagnostics?.find((item) => item.status === "scored") ?? null;
  const { data: evidence } = company
    ? await db.from("evidence_items").select("id,verification_status,source_ref").eq("tenant_id", ctx.tenantId).eq("company_id", company.id)
    : { data: [] };
  const verifiedEvidence = (evidence ?? []).filter((item) => item.verification_status === "verified").length;
  const flagRows = [
    ["Agentic", flags.agentic],
    ["Data Upload para usuários reais", flags.dataUpload],
    ["Qualification Network", flags.qualificationNetwork],
    ["Real Contact", flags.realContact],
    ["Ecosystem", flags.ecosystem],
  ] as const;

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
        <span>Escopo: {tenant?.name ?? "tenant selecionado"} · perfil atual: {ctx.role} · sem acesso global à plataforma</span>
      </div>

      <section className="admin-demo-metrics" aria-label="Indicadores administrativos">
        <article><span>Empresa</span><strong>{company?.trade_name ?? "Pendente"}</strong><small>{company?.fictional ? "Cadastro fictício controlado" : "Confirme o marcador fictício"}</small></article>
        <article><span>Diagnóstico</span><strong>{scored ? "Concluído" : latest?.status ?? "Pendente"}</strong><small>{scored ? `${scored.profile_code} · score ${scored.growth_score ?? "—"}` : "Sem relatório disponível"}</small></article>
        <article><span>Evidências</span><strong>{evidence?.length ?? 0}</strong><small>{verifiedEvidence} verificadas · demais declaradas</small></article>
        <article><span>Acessos do tenant</span><strong>{memberships?.length ?? 0}</strong><small>Seu perfil: {ctx.role}</small></article>
      </section>

      <div className="admin-demo-grid">
        <section className="admin-demo-panel">
          <div className="section-heading-row"><div><span className="section-eyebrow">Controle da apresentação</span><h2>Gate operacional</h2></div></div>
          <ol className="admin-checklist">
            <li className={company?.fictional ? "is-ready" : ""}><span>Empresa fictícia isolada</span><strong>{company?.fictional ? "PASS" : "REVISAR"}</strong></li>
            <li className={(evidence?.length ?? 0) >= 3 ? "is-ready" : ""}><span>Pacote documental demonstrativo</span><strong>{(evidence?.length ?? 0) >= 3 ? "PASS" : "PENDENTE"}</strong></li>
            <li className={scored ? "is-ready" : ""}><span>Diagnóstico e relatório</span><strong>{scored ? "PASS" : "PENDENTE"}</strong></li>
            <li className={scored ? "is-ready" : ""}><span>Soluções simuladas explicáveis</span><strong>{scored ? "PASS" : "PENDENTE"}</strong></li>
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

      {scored ? (
        <div className="action-row admin-demo-actions">
          <Link className="button button-primary" href={`/resultado-v1?diagnostic=${scored.id}`}>Abrir relatório executivo</Link>
          <Link className="button button-secondary" href={`/demonstracao/solucoes?diagnostic=${scored.id}`}>Revisar soluções simuladas</Link>
        </div>
      ) : null}
    </AppShell>
  );
}
