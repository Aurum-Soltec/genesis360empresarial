"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const { error } = await createClient().auth.updateUser({ password });
    setComplete(!error);
    setMessage(error ? "Não foi possível atualizar a senha." : "Senha atualizada. Você já pode continuar.");
  }
  return (
    <main className="focused-shell"><section className="focused-panel">
      <p className="eyebrow">Segurança</p><h1>Defina uma nova senha</h1>
      <form onSubmit={submit} className="stack">
        <label>Nova senha<input name="password" type="password" minLength={12} autoComplete="new-password" required /></label>
        <button className="button button-primary" disabled={complete}>Atualizar senha</button>
      </form>
      {message ? <p role="status">{message}</p> : null}
      {complete ? <Link href="/selecionar-empresa">Continuar para sua empresa</Link> : null}
    </section></main>
  );
}
