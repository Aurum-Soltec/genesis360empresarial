"use client";

import Link from "next/link";

export default function AppError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="focused-shell">
      <section className="focused-panel" role="alert">
        <p className="eyebrow">Leitura indisponível</p>
        <h1>Não foi possível carregar esta página.</h1>
        <p>
          Seus dados não foram alterados. Tente novamente; se o problema
          continuar, informe o administrador.
        </p>
        <div className="action-row">
          <button className="button button-primary" type="button" onClick={retry}>
            Tentar novamente
          </button>
          <Link className="button button-secondary" href="/">
            Ir para Hoje
          </Link>
        </div>
      </section>
    </main>
  );
}
