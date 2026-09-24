import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SignInPage from "./page";

const auth = vi.hoisted(() => ({
  setSession: vi.fn(),
  getUser: vi.fn(),
  signOut: vi.fn(),
  createClient: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: auth.replace, refresh: auth.refresh }),
}));
vi.mock("@/lib/supabase/client", () => ({ createClient: () => {
  auth.createClient();
  return { auth };
} }));
vi.mock("@/components/brand-mark", () => ({ BrandMark: () => <span>Genesis</span> }));

beforeEach(() => {
  vi.clearAllMocks();
  auth.setSession.mockResolvedValue({ error: null });
  auth.getUser.mockResolvedValue({ data: { user: { id: "invited-user" } }, error: null });
  auth.signOut.mockResolvedValue({ error: null });
  window.history.replaceState(null, "", "/entrar");
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/entrar");
});

describe("Callback de convite na entrada", () => {
  it("não expõe credenciais por GET antes da hidratação", () => {
    const html = renderToString(<SignInPage />);
    expect(html).toMatch(/<form[^>]*method="post"/);
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Entrar<\/button>/);
  });

  it("remove o fragmento antes de estabelecer sessão e abre definição de senha", async () => {
    window.history.replaceState(null, "", "/entrar?next=%2F#access_token=test-access&refresh_token=test-refresh&type=invite");
    const removeFragment = vi.spyOn(window.history, "replaceState");

    render(<SignInPage />);

    await waitFor(() => expect(auth.replace).toHaveBeenCalledWith("/nova-senha"));
    expect(window.location.hash).toBe("");
    expect(removeFragment.mock.invocationCallOrder[0]).toBeLessThan(auth.createClient.mock.invocationCallOrder[0]);
    expect(auth.setSession).toHaveBeenCalledWith({ access_token: "test-access", refresh_token: "test-refresh" });
    expect(auth.getUser).toHaveBeenCalledOnce();
    expect(auth.refresh).toHaveBeenCalledOnce();
    expect(document.body.textContent).not.toContain("test-access");
    expect(document.body.textContent).not.toContain("test-refresh");
    removeFragment.mockRestore();
  });

  it("falha fechado sem refresh token e não usa sessão não verificada", async () => {
    window.history.replaceState(null, "", "/entrar#access_token=test-access&type=invite");
    render(<SignInPage />);

    expect(window.location.hash).toBe("");
    expect((await screen.findByRole("alert")).textContent).toMatch(/convite não pôde ser confirmado/i);
    expect(auth.setSession).not.toHaveBeenCalled();
    expect(auth.replace).not.toHaveBeenCalled();
  });

  it("não encaminha quando Auth rejeita a sessão", async () => {
    auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error("invalid session") });
    window.history.replaceState(null, "", "/entrar#access_token=test-access&refresh_token=test-refresh&type=invite");
    render(<SignInPage />);

    expect((await screen.findByRole("alert")).textContent).toMatch(/convite não pôde ser confirmado/i);
    expect(window.location.hash).toBe("");
    expect(auth.replace).not.toHaveBeenCalled();
    expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});
