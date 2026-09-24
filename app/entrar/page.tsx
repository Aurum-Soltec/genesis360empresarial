"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { createClient } from "@/lib/supabase/client";
import { safeInternalPath } from "@/lib/safe-navigation";
import { useHydrated } from "@/lib/use-hydrated";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const hydrated = useHydrated();

  useEffect(() => {
    const fragment = window.location.hash;
    if (!fragment) return;

    // Supabase's default invitation email returns an implicit Auth fragment.
    // Remove it before initializing the browser client or changing routes.
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    const values = new URLSearchParams(fragment.slice(1));
    if (values.get("type") !== "invite") return;

    const accessToken = values.get("access_token");
    const refreshToken = values.get("refresh_token");
    void (async () => {
      await Promise.resolve();
      if (!accessToken || !refreshToken) {
        setError("Este convite não pôde ser confirmado. Solicite um novo convite ao administrador.");
        return;
      }

      setBusy(true);
      let auth: ReturnType<typeof createClient>["auth"] | null = null;
      let sessionInstalled = false;
      try {
        auth = createClient().auth;
        const { error: sessionError } = await auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) throw sessionError;
        sessionInstalled = true;
        const { data, error: userError } = await auth.getUser();
        if (userError || !data.user) throw userError ?? new Error("Invite session unavailable");
        router.replace("/nova-senha");
        router.refresh();
      } catch {
        if (sessionInstalled) {
          try {
            await auth?.signOut({ scope: "local" });
          } catch {
            // Keep the public error generic even if local cleanup fails.
          }
        }
        setError("Este convite não pôde ser confirmado. Solicite um novo convite ao administrador.");
        setBusy(false);
      }
    })();
  }, [router]);

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
    const next = safeInternalPath(new URLSearchParams(window.location.search).get("next"));
    router.push(next);
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
        <form method="post" onSubmit={submit} className="stack">
          <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
          <label>Senha<input name="password" type="password" autoComplete="current-password" required /></label>
          {error ? <p role="alert">{error}</p> : null}
          <button className="button button-primary" disabled={!hydrated || busy}>{busy ? "Entrando…" : "Entrar"}</button>
        </form>
        <Link href="/recuperar-acesso">Esqueci minha senha</Link>
      </section>
    </main>
  );
}
