import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DemoPackage } from "./demo-package";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("controlled demo document package", () => {
  it("lets an existing package become context for a new diagnostic without claiming verification", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ created: 0 }) }));
    vi.stubGlobal("fetch", fetchMock);
    render(<DemoPackage companyId="company-a" diagnosticId="diagnostic-new" loaded linked={false} />);

    const action = screen.getByRole("button", { name: "Vincular ao diagnóstico" });
    expect(action.hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("checkbox", { name: /somente o cenário fictício/i }));
    fireEvent.click(action);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith("/api/demo/evidence", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ companyId: "company-a", diagnosticId: "diagnostic-new" }),
    }));
    expect(await screen.findByRole("status")).toHaveProperty("textContent",
      "As três fontes fictícias foram vinculadas como contexto do diagnóstico. Elas não verificam respostas individuais.");
    expect(screen.getByRole("button", { name: "Pacote vinculado ao diagnóstico" }).hasAttribute("disabled")).toBe(true);
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("keeps an already linked package idempotent", () => {
    render(<DemoPackage companyId="company-a" diagnosticId="diagnostic-old" loaded linked />);
    fireEvent.click(screen.getByRole("checkbox", { name: /somente o cenário fictício/i }));
    expect(screen.getByRole("button", { name: "Pacote vinculado ao diagnóstico" }).hasAttribute("disabled")).toBe(true);
  });
});
