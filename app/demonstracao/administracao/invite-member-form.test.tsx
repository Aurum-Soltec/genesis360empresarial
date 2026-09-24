import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InviteMemberForm } from "./invite-member-form";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Convite administrado", () => {
  it("convida somente como membro e distingue aceite da API de entrega do e-mail", async () => {
    const request = vi.fn(async () => ({ status: 201 }));
    vi.stubGlobal("fetch", request);
    render(<InviteMemberForm />);

    fireEvent.change(screen.getByLabelText("E-mail da pessoa convidada"), {
      target: { value: " teste@example.com " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Convidar membro" }));

    await waitFor(() => expect(request).toHaveBeenCalledOnce());
    const [url, options] = request.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/tenant/members");
    expect(options.method).toBe("POST");
    expect(JSON.parse(String(options.body))).toEqual({ email: "teste@example.com", role: "member" });
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/Confirme o recebimento/));
    expect(screen.getByRole("button", { name: "Convidar membro" }).hasAttribute("disabled")).toBe(true);
  });

  it("bloqueia retry cego quando o resultado do provedor é incerto", async () => {
    const request = vi.fn(async () => ({ status: 502 }));
    vi.stubGlobal("fetch", request);
    render(<InviteMemberForm />);

    fireEvent.change(screen.getByLabelText("E-mail da pessoa convidada"), {
      target: { value: "teste@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Convidar membro" }));

    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/conferir Auth e o vínculo/));
    fireEvent.click(screen.getByRole("button", { name: "Convidar membro" }));
    expect(request).toHaveBeenCalledOnce();
  });
});
