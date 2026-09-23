import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import NewPasswordPage from "./page";

const updateUser = vi.hoisted(() => vi.fn());
vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ auth: { updateUser } }) }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Definição de senha", () => {
  it("só oferece continuação após o Auth confirmar a nova senha", async () => {
    updateUser.mockResolvedValue({ error: null });
    render(<NewPasswordPage />);
    expect(screen.queryByRole("link", { name: /continuar para sua empresa/i })).toBeNull();
    fireEvent.change(screen.getByLabelText("Nova senha"), { target: { value: "senha-segura-123" } });
    fireEvent.click(screen.getByRole("button", { name: "Atualizar senha" }));
    await waitFor(() => expect(updateUser).toHaveBeenCalledWith({ password: "senha-segura-123" }));
    expect((await screen.findByRole("link", { name: /continuar para sua empresa/i })).getAttribute("href")).toBe("/selecionar-empresa");
  });

  it("mantém o acesso bloqueado quando a atualização falha", async () => {
    updateUser.mockResolvedValue({ error: new Error("denied") });
    render(<NewPasswordPage />);
    fireEvent.change(screen.getByLabelText("Nova senha"), { target: { value: "senha-segura-123" } });
    fireEvent.click(screen.getByRole("button", { name: "Atualizar senha" }));
    expect((await screen.findByRole("status")).textContent).toMatch(/não foi possível/i);
    expect(screen.queryByRole("link", { name: /continuar para sua empresa/i })).toBeNull();
  });
});
