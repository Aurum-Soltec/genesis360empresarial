import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/glass-card";
import { ProgressBar } from "@/components/progress-bar";

export default function ResultadoPage() {
  return (
    <AppShell>
      <header>
        <div className="eyebrow">Resultado preliminar</div>
        <h1 className="section-title" style={{ marginTop: 8 }}>Clareza antes de investimento.</h1>
        <p className="muted">Resultado demonstrativo baseado em respostas fictícias.</p>
      </header>

      <div className="result-grid">
        <GlassCard>
          <div className="score-orbit" style={{ width: 170, height: 170, margin: "0 auto" }}>
            <div className="score-value" style={{ fontSize: 48 }}>64</div>
            <div className="score-label">Score preliminar</div>
          </div>
          <div className="dimension-list">
            {[
              ["Estratégia", 76],
              ["Financeiro", 41],
              ["Vendas", 69],
              ["Marketing", 72],
              ["Clientes", 74],
              ["Operações", 56],
              ["Pessoas", 60],
              ["Tecnologia", 52],
              ["Jurídico", 57],
              ["Tributário", 48],
              ["Inovação", 61],
              ["Riscos", 44],
            ].map(([name, value]) => (
              <div className="dimension-row" key={String(name)}>
                <span>{name}</span>
                <ProgressBar value={Number(value)} />
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </GlassCard>

        <div style={{ display: "grid", gap: 18 }}>
          <GlassCard>
            <div className="eyebrow">Gargalo prioritário</div>
            <h2 className="section-title" style={{ marginTop: 8 }}>Previsibilidade financeira</h2>
            <p className="muted" style={{ lineHeight: 1.65 }}>
              A empresa não possui visão consolidada das obrigações e entradas de curto prazo. A confiança é moderada porque
              fluxo projetado e aging de recebíveis ainda não foram analisados.
            </p>
          </GlassCard>
          <GlassCard>
            <div className="eyebrow">Primeira missão</div>
            <h2 style={{ margin: "9px 0" }}>Construir o mapa de caixa de 13 semanas</h2>
            <p className="muted">Owner: Financeiro • prazo: 7 dias • evidência: projeção conciliada</p>
            <div style={{ marginTop: 18 }}><ProgressBar value={20} label="Missão" /></div>
          </GlassCard>
          <div className="callout">
            Fatos, hipóteses, documentos faltantes e nível de confiança devem aparecer juntos em toda recomendação.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
