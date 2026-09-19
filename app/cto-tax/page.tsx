import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/glass-card";

export default function TaxPage() {
  return (
    <AppShell>
      <header>
        <div className="eyebrow">CTO-Tax • triagem preliminar</div>
        <p className="muted">Rules-first • humano no loop • demonstração</p>
      </header>

      <section className="tax-hero">
        <div className="glass tax-signal">
          <div className="signal-status"><span className="signal-dot" /> Possível aderência para revisão</div>
          <h1>Há sinais que merecem análise especializada.</h1>
          <p className="muted" style={{ maxWidth: 720, lineHeight: 1.68 }}>
            As respostas indicam pressão de caixa, retenções e mudança operacional recente. A triagem não confirma
            crédito, valor ou direito. A conclusão depende de documentos e validação profissional.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/referral">Avaliar encaminhamento</Link>
            <Link className="button button-secondary" href="/diagnostico">Revisar respostas</Link>
          </div>
        </div>

        <div className="glass sponsor-card">
          <div className="eyebrow">Parceira patrocinadora de lançamento</div>
          <div className="sponsor-wordmark" style={{ marginTop: 22 }}>REDE GENESIS</div>
          <p className="muted" style={{ lineHeight: 1.62 }}>
            A empresa qualificada poderá receber solicitações de análise somente com autorização. O patrocínio não garante
            elegibilidade, resultado ou superioridade técnica.
          </p>
          <div className="callout callout-tax">
            DEMO-001 • critérios simulados • nenhum envio real
          </div>
        </div>
      </section>

      <section className="section grid-3">
        {[
          ["Regime", "Informado", "Revisão há mais de 24 meses"],
          ["Pressão de caixa", "Alta", "Obrigações de curto prazo"],
          ["Documentação", "Parcial", "3 itens ainda necessários"],
        ].map(([title, value, note]) => (
          <GlassCard key={title}>
            <div className="eyebrow">{title}</div>
            <div className="metric-value">{value}</div>
            <p className="muted">{note}</p>
          </GlassCard>
        ))}
      </section>
    </AppShell>
  );
}
