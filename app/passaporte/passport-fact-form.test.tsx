import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PassportFactForm } from "./passport-fact-form";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

afterEach(() => {
  vi.unstubAllGlobals();
  refresh.mockClear();
});

describe("Passport declaration form", () => {
  it("records a financial fact as declared without a verification or confidence claim", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<PassportFactForm companyId="e381c3e6-7672-4abf-8200-08894cd5d404" />);

    fireEvent.change(screen.getByLabelText("Campo essencial"), { target: { value: "finance.cashflow_forecast" } });
    fireEvent.change(screen.getByLabelText("Informação declarada"), { target: { value: "  Previsão mensal  " } });
    fireEvent.click(screen.getByRole("button", { name: "Registrar declaração" }));

    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/passport/facts");
    const payload = JSON.parse(String(options.body));
    expect(payload).toMatchObject({
      factKey: "finance.cashflow_forecast",
      value: "Previsão mensal",
      source: "declared",
      sensitivity: "financial",
      purposeCodes: ["CORE_OPERATION"],
    });
    expect(payload).not.toHaveProperty("confidence");
    expect(payload).not.toHaveProperty("verification_status");
    expect(screen.getByRole("status").textContent).toMatch(/ainda não verificada/);
  });

  it("keeps the value and shows an error when the server rejects a write", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 403 })));
    render(<PassportFactForm companyId="e381c3e6-7672-4abf-8200-08894cd5d404" />);
    fireEvent.change(screen.getByLabelText("Informação declarada"), { target: { value: "Serviços" } });
    fireEvent.click(screen.getByRole("button", { name: "Registrar declaração" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/não permite/));
    expect((screen.getByLabelText("Informação declarada") as HTMLTextAreaElement).value).toBe("Serviços");
    expect(refresh).not.toHaveBeenCalled();
  });
});
