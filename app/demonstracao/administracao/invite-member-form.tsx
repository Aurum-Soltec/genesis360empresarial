"use client";

import { FormEvent, useState } from "react";

type InviteState = "idle" | "sending" | "accepted" | "review";

export function InviteMemberForm() {
  const [state, setState] = useState<InviteState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const locked = state === "sending" || state === "accepted" || state === "review";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    setState("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/tenant/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "member" }),
      });
      if (response.status === 201) {
        form.reset();
        setState("accepted");
        setMessage("Convite aceito pela plataforma. Confirme o recebimento do e-mail e a ativação antes de considerar o acesso concluído.");
        return;
      }
      if (response.status === 409) {
        setMessage("Este endereço já possui acesso neste tenant. Verifique o vínculo antes de qualquer novo convite.");
      } else if (response.status === 403) {
        setMessage("Seu perfil não pode convidar membros para esta empresa.");
      } else {
        setMessage("Não foi possível confirmar o convite. A operação deve conferir Auth e o vínculo antes de tentar novamente.");
      }
    } catch {
      setMessage("A resposta do convite é desconhecida. A operação deve conferir Auth e o vínculo antes de tentar novamente.");
    }
    // A failed response does not prove that Auth rejected the request. Prevent a
    // blind retry that could leave a duplicate invitation or an orphaned user.
    setState("review");
  }

  return (
    <form onSubmit={submit} aria-busy={state === "sending"}>
      <div className="precision-field">
        <label htmlFor="demo-member-email">E-mail da pessoa convidada</label>
        <input
          id="demo-member-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="pessoa@empresa.com.br"
          disabled={locked}
          required
        />
      </div>
      <p className="admin-demo-note">O convite concede somente o papel de membro à empresa ativa. Ele não altera permissões de administrador nem aprova a HSP-4.</p>
      <button className="button button-primary" type="submit" disabled={locked}>
        {state === "sending" ? "Enviando convite…" : "Convidar membro"}
      </button>
      {message ? <p className={state === "accepted" ? "form-hint" : "form-error"} role="status">{message}</p> : null}
    </form>
  );
}
