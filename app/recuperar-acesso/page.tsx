"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useHydrated } from "@/lib/use-hydrated";

export default function RecoverAccessPage() {
  const [message, setMessage] = useState<string | null>(null);
  const hydrated = useHydrated();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/nova-senha`,
    });
    setMessage("Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.");
  }
  return (
    <main className="focused-shell"><section className="focused-panel">
      <p className="eyebrow">Recuperação de acesso</p><h1>Redefinir senha</h1>
      <form method="post" onSubmit={submit} className="stack">
        <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
        <button className="button button-primary" disabled={!hydrated}>Enviar instruções</button>
      </form>
      {message ? <p role="status">{message}</p> : null}
    </section></main>
  );
}
