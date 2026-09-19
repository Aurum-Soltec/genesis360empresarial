"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TenantChooser({
  email,
  memberships,
}: {
  email: string;
  memberships: Array<{ id: string; name: string; role: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  async function selectTenant(tenantId: string) {
    setError(null);
    const response = await fetch("/api/tenant/active", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    if (!response.ok) return setError("Não foi possível selecionar esta empresa.");
    router.push("/");
    router.refresh();
  }
  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/entrar");
    router.refresh();
  }
  return (
    <main className="focused-shell"><section className="focused-panel">
      <p className="eyebrow">Contexto ativo</p><h1>Escolha a empresa</h1>
      <p>{email}</p>
      {memberships.length ? memberships.map((membership) => (
        <button className="tenant-choice" key={membership.id} onClick={() => selectTenant(membership.id)}>
          <strong>{membership.name}</strong><span>{membership.role}</span>
        </button>
      )) : <p role="status">Seu acesso não possui uma empresa ativa. Solicite um convite ao administrador.</p>}
      {error ? <p role="alert">{error}</p> : null}
      <button className="button button-secondary" onClick={signOut}>Sair</button>
    </section></main>
  );
}
