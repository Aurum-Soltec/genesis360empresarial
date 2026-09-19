"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type MissionStatus =
  | "SUGGESTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "EVIDENCE_PENDING"
  | "COMPLETED"
  | "OUTCOME_PENDING"
  | "OUTCOME_RECORDED"
  | "PAUSED"
  | "BLOCKED"
  | "CANCELLED"
  | "EXPIRED";

export function MissionActions({
  missionId,
  status,
}: {
  missionId: string;
  status: MissionStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post(url: string, body: unknown) {
    if (busy) return false;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(body), signal: AbortSignal.timeout(15000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Não foi possível concluir a ação.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Não foi possível confirmar a gravação. Atualize a missão antes de tentar novamente.");
      return false;
    } finally { setBusy(false); }
  }

  async function transition(to: MissionStatus) {
    await post(`/api/missions/${missionId}/transition`, { to });
  }

  async function submitEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);
    const summary = String(form.get("summary") ?? "").trim();
    if (!summary) return;
    const ok = await post(`/api/missions/${missionId}/evidence`, {
      evidenceType: "declaration",
      summary,
      payload: { declaration: summary },
    });
    if (ok) element.reset();
  }

  async function submitOutcome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);
    const outcomeStatus = String(form.get("outcomeStatus") ?? "unknown");
    const metricCode = String(form.get("metricCode") ?? "").trim();
    const afterValue = String(form.get("afterValue") ?? "").trim();

    const ok = await post(`/api/missions/${missionId}/outcome`, {
      outcomeStatus,
      metricCode: metricCode || null,
      afterValue: afterValue ? { value: afterValue } : null,
      source: "declared",
    });
    if (ok) element.reset();
  }

  return (
    <div style={{ marginTop: 18 }}>
      <div className="action-row">
        {status === "SUGGESTED" ? (
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => transition("ACCEPTED")}
          >
            Aceitar missão
          </button>
        ) : null}

        {status === "ACCEPTED" || status === "PAUSED" || status === "BLOCKED" ? (
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => transition("IN_PROGRESS")}
          >
            Iniciar / retomar
          </button>
        ) : null}

        {status === "EVIDENCE_PENDING" ? (
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => transition("COMPLETED")}
          >
            Concluir missão
          </button>
        ) : null}
      </div>

      {status === "IN_PROGRESS" || status === "EVIDENCE_PENDING" ? (
        <form onSubmit={submitEvidence} style={{ marginTop: 14 }}>
          <label className="metric-label" htmlFor={`evidence-${missionId}`}>
            Evidência de execução
          </label>
          <div className="action-row" style={{ marginTop: 8 }}>
            <input
              id={`evidence-${missionId}`}
              name="summary"
              required
              minLength={3}
              maxLength={1000}
              placeholder="Descreva a evidência registrada"
              style={{
                minHeight: 44,
                flex: "1 1 360px",
                border: "1px solid var(--g-line-strong)",
                borderRadius: 12,
                padding: "0 12px",
                background: "white",
              }}
            />
            <button className="button button-secondary" disabled={busy}>
              Registrar evidência
            </button>
          </div>
        </form>
      ) : null}

      {status === "COMPLETED" || status === "OUTCOME_PENDING" ? (
        <form onSubmit={submitOutcome} style={{ marginTop: 14 }}>
          <div className="kicker">Registrar outcome</div>
          <div className="action-row" style={{ marginTop: 8 }}>
            <select
              name="outcomeStatus"
              defaultValue="improved"
              style={{
                minHeight: 44,
                border: "1px solid var(--g-line-strong)",
                borderRadius: 12,
                padding: "0 12px",
                background: "white",
              }}
            >
              <option value="significant_improvement">Melhora significativa</option>
              <option value="improved">Melhorou</option>
              <option value="small_improvement">Pequena melhora</option>
              <option value="no_change">Sem mudança</option>
              <option value="worsened">Piorou</option>
              <option value="unknown">Ainda não sabemos</option>
            </select>
            <input
              name="metricCode"
              placeholder="Métrica (opcional)"
              style={{
                minHeight: 44,
                border: "1px solid var(--g-line-strong)",
                borderRadius: 12,
                padding: "0 12px",
                background: "white",
              }}
            />
            <input
              name="afterValue"
              placeholder="Valor/resultados observados"
              style={{
                minHeight: 44,
                flex: "1 1 220px",
                border: "1px solid var(--g-line-strong)",
                borderRadius: 12,
                padding: "0 12px",
                background: "white",
              }}
            />
            <button className="button button-primary" disabled={busy}>
              Registrar resultado
            </button>
          </div>
        </form>
      ) : null}

      {error ? <p className="metric-note">{error}</p> : null}
    </div>
  );
}
