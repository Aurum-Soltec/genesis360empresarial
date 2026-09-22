"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DemoPackage({
  companyId,
  diagnosticId,
  loaded,
}: {
  companyId: string;
  diagnosticId: string | null;
  loaded: boolean;
}) {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadPackage() {
    if (!confirmed || working) return;
    setWorking(true);
    setMessage(null);
    try {
      const response = await fetch("/api/demo/evidence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ companyId, diagnosticId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "DEMO_PACKAGE_FAILED");
      setMessage(body.created
        ? `${body.created} documentos fictícios foram registrados com rastreabilidade.`
        : "O pacote fictício já estava registrado para esta empresa.");
      router.refresh();
    } catch {
      setMessage("Não foi possível registrar o pacote fictício. Nenhum dado real foi enviado.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="demo-package" aria-labelledby="demo-package-title">
      <div>
        <span className="section-eyebrow">Ambiente demonstrativo controlado</span>
        <h2 id="demo-package-title">Pacote documental da Empresa Aurora</h2>
        <p>
          Três documentos sintéticos mostram o fluxo de estratégia, indicadores e riscos.
          O conteúdo é fixo, identificável e permanece como não verificado.
        </p>
      </div>
      <ul className="demo-document-list">
        <li><strong>Direcionadores estratégicos</strong><span>TXT · declaração</span></li>
        <li><strong>Indicadores gerenciais</strong><span>CSV · métrica</span></li>
        <li><strong>Mapa de processos e riscos</strong><span>JSON · observação</span></li>
      </ul>
      <label className="attestation-check">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
        />
        <span>Confirmo que usarei somente o cenário fictício desta demonstração.</span>
      </label>
      <div className="action-row">
        <button
          className="button button-primary"
          disabled={!confirmed || working || loaded}
          onClick={loadPackage}
        >
          {working ? "Registrando…" : loaded ? "Pacote já registrado" : "Enviar documentação fictícia"}
        </button>
        <span className="demo-safety-note">Upload real continua desligado.</span>
      </div>
      {message ? <p className="form-hint" role="status">{message}</p> : null}
    </section>
  );
}
