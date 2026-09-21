"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Não foi possível entrar. Confira seus dados ou recupere o acesso.");
      setBusy(false);
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next?.startsWith("/") ? next : "/selecionar-empresa");
    router.refresh();
  }

  return (
    <main className="focused-shell">
      <section className="focused-panel">
        <div className="focused-brand">
          <BrandMark priority />
        </div>
        <p className="eyebrow">Acesso seguro</p>
        <h1>Entrar no Genesis 360</h1>
        <form onSubmit={submit} className="stack">
          <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
          <label>Senha<input name="password" type="password" autoComplete="current-password" required /></label>
          {error ? <p role="alert">{error}</p> : null}
          <button className="button button-primary" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
        </form>
        <Link href="/recuperar-acesso">Esqueci minha senha</Link>
      </section>
    </main>
  );
}
