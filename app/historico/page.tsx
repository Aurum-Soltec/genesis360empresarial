import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { isDemoTenantAllowed } from "@/lib/feature-flags";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { passportDateLabel, timelineEventPresentation, timelinePageNumber } from "@/lib/passport-presentation";
import { selectUniqueTenantCompany } from "@/lib/server/company-selection";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../passaporte/passport.module.css";

const PAGE_SIZE = 100;

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const ctx = await requirePageTenantContext("/historico");
  const page = timelinePageNumber((await searchParams).page);
  const offset = (page - 1) * PAGE_SIZE;

  const db = await createSupabaseServerClient();
  const demoTenant = isDemoTenantAllowed(ctx.tenantId);
  const selection = await selectUniqueTenantCompany(db, ctx.tenantId, demoTenant);
  const company = selection.company;

  const eventsResult = company
    ? await db
          .from("business_timeline_events")
          .select("id,event_type,occurred_at,payload")
          .eq("tenant_id", ctx.tenantId)
          .eq("company_id", company.id)
          .order("occurred_at", { ascending: false })
          .order("id", { ascending: false })
          .range(offset, offset + PAGE_SIZE)
    : { data: [], error: null };
  if (eventsResult.error) throw new Error("TIMELINE_EVENTS_READ_FAILED");
  const pageEvents = eventsResult.data ?? [];
  const beyondNavigationLimit = page === 1000 && pageEvents.length > PAGE_SIZE;
  const hasMore = page < 1000 && pageEvents.length > PAGE_SIZE;
  const events = pageEvents.slice(0, PAGE_SIZE);

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

      {selection.status !== "ready" ? (
        <section className="card empty-state">
          <h2>{selection.status === "ambiguous" ? "É preciso escolher uma empresa." : "Empresa ainda não vinculada."}</h2>
          <p>{selection.status === "ambiguous"
            ? "Há mais de uma empresa possível neste contexto. O Genesis não exibirá o histórico de uma empresa arbitrária."
            : demoTenant
              ? "A demonstração requer uma empresa fictícia identificável; nenhum histórico real será usado neste roteiro."
              : "Solicite ao administrador o cadastro da empresa para iniciar o histórico empresarial."}</p>
        </section>
      ) : !events.length ? (
        <section className="card empty-state">
          <h3>{page > 1 ? "Não há registros nesta página." : "A Timeline ainda está vazia."}</h3>
          <p>{page > 1 ? "Volte à página anterior para continuar a leitura." : "Eventos podem ainda não existir ou estar restritos ao seu perfil. Atualizações do Passport, missões e resultados construirão o histórico visível."}</p>
          <Link className="text-action" href={page > 1 ? `/historico?page=${page - 1}` : "/passaporte"}>{page > 1 ? "Página anterior ←" : "Abrir Business Passport →"}</Link>
        </section>
      ) : (
        <section className="section" aria-label={`Histórico de ${company?.trade_name ?? "empresa selecionada"}`}>
          <p className={styles.timelineIntro}>Eventos de {company?.trade_name ?? "empresa selecionada"}, do mais recente ao mais antigo. Página {page}, até {PAGE_SIZE} registros por página.</p>
          <ol className={styles.timeline}>
            {events.map((event) => {
              const presentation = timelineEventPresentation(event.event_type, event.payload);
              return (
                <li key={event.id}>
                  <article className={styles.timelineEvent}>
                    <time dateTime={event.occurred_at}>{passportDateLabel(event.occurred_at)}</time>
                    <h2>{presentation.title}</h2>
                    <p>{presentation.detail}</p>
                    {presentation.href ? <Link className="text-action" href={presentation.href}>Ver contexto →</Link> : null}
                  </article>
                </li>
              );
            })}
          </ol>
          {page > 1 || hasMore ? (
            <nav className={styles.timelinePages} aria-label="Páginas do histórico">
              {page > 1 ? <Link className="button button-secondary" href={`/historico?page=${page - 1}`}>Mais recentes</Link> : null}
              {hasMore ? <Link className="button button-secondary" href={`/historico?page=${page + 1}`}>Mais antigos</Link> : null}
            </nav>
          ) : null}
          {beyondNavigationLimit ? <p className={styles.disclosure}>Há registros mais antigos além do limite de navegação desta tela. A consulta histórica completa ainda precisa de um mecanismo de busca ou exportação.</p> : null}
          <p className={styles.disclosure}>A Timeline mostra eventos permitidos ao seu perfil. Um registro não representa verificação independente dos dados declarados.</p>
        </section>
      )}
    </AppShell>
  );
}
