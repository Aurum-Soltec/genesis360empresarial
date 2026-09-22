import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { demoEvidenceLoadedCount } from "@/lib/demo-scenario";
import { canAccessDemoAdministration } from "@/lib/demo-solution-preview";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireTenantContext } from "@/lib/tenant-context";

export default async function DemonstracaoPage() {
  const ctx = await requireTenantContext().catch(() => null);
  if (!ctx) redirect("/");
  if (!isDemoTenantAllowed(ctx.tenantId)) notFound();
  const db = await createSupabaseServerClient();
  const { data: company } = await db.from("companies").select("id,trade_name,sector").eq("tenant_id", ctx.tenantId).limit(1).maybeSingle();
  const { data: diagnostics } = company
    ? await db.from("diagnostics").select("id,status,profile_code,growth_score,confidence").eq("tenant_id", ctx.tenantId).eq("company_id", company.id).order("created_at", { ascending: false }).limit(10)
    : { data: [] };
  const { data: evidence } = company
    ? await db.from("evidence_items").select("id,source_ref").eq("tenant_id", ctx.tenantId).eq("company_id", company.id).like("source_ref", "DEMO:%")
    : { data: [] };
  const scored = diagnostics?.find((item) => item.status === "scored");
  const draft = diagnostics?.find((item) => item.status === "draft");
  const evidenceCount = demoEvidenceLoadedCount((evidence ?? []).map((item) => item.source_ref));
  const steps = [
    { number: "01", title: "Empresa fictícia", detail: company ? `${company.trade_name}${company.sector ? ` · ${company.sector}` : ""}` : "Empresa ainda não cadastrada", ready: Boolean(company), href: "/passaporte", action: "Ver empresa" },
    { number: "02", title: "Documentação", detail: `${evidenceCount} de 3 fontes fictícias registradas`, ready: evidenceCount >= 3, href: "/documentos", action: "Enviar pacote" },
    { number: "03", title: "Diagnóstico completo", detail: draft ? `${draft.profile_code} em andamento` : scored ? `${scored.profile_code} concluído` : "Pronto para iniciar", ready: Boolean(scored), href: "/diagnostico-v1", action: draft ? "Continuar" : "Abrir diagnóstico" },
    { number: "04", title: "Relatório executivo", detail: scored ? `Growth Score ${scored.growth_score ?? "—"} · confiança ${Math.round(Number(scored.confidence ?? 0))}%` : "Gerado após a conclusão", ready: Boolean(scored), href: scored ? `/resultado-v1?diagnostic=${scored.id}` : "/diagnostico-v1", action: "Abrir relatório" },
    { number: "05", title: "Soluções compatíveis", detail: scored ? "Serviços e empresas fictícias explicados pela menor maturidade" : "Disponíveis após o relatório", ready: Boolean(scored), href: scored ? `/demonstracao/solucoes?diagnostic=${scored.id}` : "/diagnostico-v1", action: "Ver soluções" },
    { number: "06", title: "Conselho Genesis", detail: scored ? "Sínteses rastreáveis disponíveis" : "Disponível após o relatório", ready: Boolean(scored), href: "/conselho", action: "Interagir" },
    { number: "07", title: "Central administrativa", detail: canAccessDemoAdministration(ctx.role) ? `Controle do tenant disponível para ${ctx.role}` : "Exige perfil owner ou admin", ready: canAccessDemoAdministration(ctx.role), href: "/demonstracao/administracao", action: "Abrir central" },
  ];

  return (
    <AppShell>
      <header className="demo-hero">
        <div>
          <span className="section-eyebrow">Roteiro de apresentação</span>
          <h1>Do documento à decisão, em um único fluxo.</h1>
          <p>Use esta área para conduzir a demonstração sem perder contexto. Cada etapa preserva origem, confiança e limites da informação.</p>
        </div>
        <div className="demo-readiness-score"><strong>{steps.filter((step) => step.ready).length}/7</strong><span>etapas prontas</span></div>
      </header>
      <section className="demo-boundaries">
        <span><i /> Dados 100% fictícios</span>
        <span><i /> Upload real desligado</span>
        <span><i /> Agentic desligado</span>
        <span><i /> Rede e contato real desligados</span>
        <span><i /> Proveniência visível</span>
      </section>
      <ol className="demo-flow">
        {steps.map((step) => (
          <li key={step.number} className={step.ready ? "is-ready" : ""}>
            <span className="demo-step-number">{step.number}</span>
            <div><span className="demo-step-status">{step.ready ? "Pronto" : "Próximo passo"}</span><h2>{step.title}</h2><p>{step.detail}</p></div>
            <Link className={step.ready ? "button button-secondary" : "button button-primary"} href={step.href}>{step.action}</Link>
          </li>
        ))}
      </ol>
      <section className="demo-presenter-note">
        <span className="section-eyebrow">Mensagem central</span>
        <blockquote>“O Genesis não transforma opinião em certeza. Ele mostra o que sabemos, a qualidade da base e a próxima decisão mais defensável.”</blockquote>
      </section>
    </AppShell>
  );
}
