"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PASSPORT_ESSENTIAL_KEYS } from "@/lib/business-passport";
import { essentialFactLabels, type EssentialFactKey } from "@/lib/passport-presentation";
import styles from "./passport.module.css";

export function PassportFactForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [factKey, setFactKey] = useState<EssentialFactKey>(PASSPORT_ESSENTIAL_KEYS[0]);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = value.trim();
    if (!cleaned) {
      setError("Informe o valor antes de registrar.");
      return;
    }
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/passport/facts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          factKey,
          value: cleaned,
          source: "declared",
          sensitivity: factKey === "finance.cashflow_forecast" ? "financial" : "internal",
          purposeCodes: ["CORE_OPERATION"],
        }),
      });
      if (!response.ok) {
        setError(response.status === 403
          ? "Seu perfil não permite atualizar o Passport."
          : "Não foi possível registrar a informação. Tente novamente.");
        return;
      }
      setValue("");
      setMessage("Informação registrada como declaração, ainda não verificada. O histórico foi atualizado.");
      router.refresh();
    } catch {
      setError("Conexão indisponível. Verifique a rede e tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.formGrid}>
        <label>
          <span>Campo essencial</span>
          <select value={factKey} onChange={(event) => setFactKey(event.target.value as EssentialFactKey)} disabled={pending}>
            {PASSPORT_ESSENTIAL_KEYS.map((key) => <option key={key} value={key}>{essentialFactLabels[key]}</option>)}
          </select>
        </label>
        <label>
          <span>Informação declarada</span>
          <textarea value={value} onChange={(event) => setValue(event.target.value)} maxLength={180} rows={3} required disabled={pending} />
        </label>
      </div>
      <p className={styles.disclosure}>Atualizar um campo preserva a versão anterior. Não inclua dados pessoais ou documentos neste formulário.</p>
      <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Registrando…" : "Registrar declaração"}</button>
      {error ? <p className={styles.formError} role="alert">{error}</p> : null}
      {message ? <p className={styles.formSuccess} role="status">{message}</p> : null}
    </form>
  );
}
