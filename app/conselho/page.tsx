import { AppShell } from "@/components/app-shell";

export default function Page() {
  return (
    <AppShell>
      <header className="page-header">
        <div>
          <div className="kicker">Genesis 360 Empresarial</div>
          <h1 className="page-title">Conselho Genesis</h1>
          <p className="page-subtitle">A camada agentic será ativada somente após runtime, tools, budgets e evals passarem pelos gates.</p>
        </div>
      </header>
      <section className="card empty-state">
        <h3>Fundação de produto preparada.</h3>
        <p>Esta superfície não exibe dados de demonstração. O próximo passo é conectar o fluxo real e provar os gates correspondentes.</p>
      </section>
    </AppShell>
  );
}
