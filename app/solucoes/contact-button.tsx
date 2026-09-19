"use client";

import { useState } from "react";

export function ContactButton({
  painId,
  providerCapabilityId,
  enabled,
}: {
  painId: string;
  providerCapabilityId: string;
  enabled: boolean;
}) {
  const [state, setState] = useState<
    "idle" | "busy" | "success" | "consent" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function requestContact() {
    if (!enabled) return;
    setState("busy");
    setMessage(null);

    const response = await fetch("/api/solutions/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ painId, providerCapabilityId }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      setState("success");
      setMessage("Solicitação registrada. O contato seguirá o fluxo autorizado.");
      return;
    }

    if (data.error === "CONSENT_REQUIRED") {
      setState("consent");
      setMessage(
        "É necessário consentimento QUALIFIED_MATCHING ativo antes de compartilhar contato.",
      );
      return;
    }

    setState("error");
    setMessage(data.error ?? "Não foi possível solicitar contato.");
  }

  return (
    <div>
      <button
        className={enabled ? "button button-primary" : "button button-quiet"}
        disabled={!enabled || state === "busy" || state === "success"}
        onClick={requestContact}
      >
        {!enabled
          ? "Contato real desativado"
          : state === "success"
            ? "Solicitação registrada"
            : "Solicitar contato"}
      </button>
      {message ? <p className="metric-note">{message}</p> : null}
    </div>
  );
}
