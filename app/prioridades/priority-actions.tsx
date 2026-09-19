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
    setBusy(true);
    setError(null);
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Não foi possível concluir a ação.");
      return;
    }
    router.refresh();
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
      {error ? <p className="metric-note">{error}</p> : null}
    </div>
  );
}
