import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PriorityActions } from "./priority-actions";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

afterEach(() => {
  vi.unstubAllGlobals();
  refresh.mockClear();
});

describe("Priority decision actions", () => {
  it("recovers after an uncertain network failure without claiming that GDS was saved", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("network unavailable")));
    render(<PriorityActions painId="pain-1" decisionId={null} missionId={null} />);

    fireEvent.click(screen.getByRole("button", { name: "Criar GDS" }));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/Não foi possível confirmar a gravação/));
    expect(screen.getByRole("button", { name: "Criar GDS" }).hasAttribute("disabled")).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("refreshes priorities after a confirmed successful write", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ decision: { id: "decision-1" } }) }));
    vi.stubGlobal("fetch", fetchMock);
    render(<PriorityActions painId="pain-1" decisionId={null} missionId={null} />);

    fireEvent.click(screen.getByRole("button", { name: "Criar GDS" }));

    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith("/api/pains/pain-1/gds", expect.objectContaining({ method: "POST", signal: expect.any(AbortSignal) }));
  });
});
