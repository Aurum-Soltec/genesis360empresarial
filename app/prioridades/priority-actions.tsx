"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PriorityActions({
  painId,
  decisionId,
  missionId,
}: {
  painId: string;
  decisionId: string | null;
  missionId: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(url: string, body: unknown = {}) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Não foi possível concluir a ação.");
        return;
      }
      router.refresh();
    } catch {
      setError("Não foi possível confirmar a gravação. Atualize Prioridades antes de tentar novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="action-row">
        {!decisionId ? (
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => run(`/api/pains/${painId}/gds`)}
          >
            Criar GDS
          </button>
        ) : !missionId ? (
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => run(`/api/decisions/${decisionId}/missions`)}
          >
            Criar missão
          </button>
        ) : (
          <a className="button button-secondary" href="/missoes">
            Abrir missão
          </a>
        )}
      </div>
      {error ? <p className="metric-note" role="alert">{error}</p> : null}
    </div>
  );
}
