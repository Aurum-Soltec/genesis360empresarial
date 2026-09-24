import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DiagnosticJourney from "./journey";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    <a href={href}>{children}</a>,
}));

const diagnosticState = {
  diagnosticId: "diagnostic-demo",
  answerRevision: 0,
  unresolvedQuestionIds: [],
  progressPercent: 0,
  confidencePercent: 0,
  confidenceLevel: "LOW",
  recommendations: [],
  nextQuestionId: "EST-001",
  stageCode: "EST",
  stageOrder: 1,
  stageName: "Estratégia",
  answeredCount: 0,
  seenCount: 0,
  currentQueueCount: 31,
  typicalRange: [31, 42],
  adaptiveCount: 0,
  unresolvedCount: 0,
  canSubmit: false,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("diagnostic demo provenance", () => {
  it("does not attach the registered demo package to a new answer", async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url === "/api/diagnostics" && init?.method === "POST") {
        return { ok: true, json: async () => ({ diagnostic: { id: "diagnostic-demo" } }) };
      }
      if (url === "/api/diagnostics/diagnostic-demo/state") {
        return { ok: true, json: async () => diagnosticState };
      }
      if (url === "/api/diagnostics/diagnostic-demo/answers" && init?.method === "PUT") {
        return { ok: true, json: async () => ({ state: diagnosticState }) };
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DiagnosticJourney companyId="company-demo" companyName="Empresa Aurora" demoSourceCount={3} />);
    expect(screen.getByText(/não comprovam nem são vinculadas automaticamente/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Iniciar ou continuar diagnóstico completo/i }));
    fireEvent.click(await screen.findByRole("button", { name: "Não sei" }));

    await waitFor(() => {
      const call = fetchMock.mock.calls.find(([url, init]) =>
        url === "/api/diagnostics/diagnostic-demo/answers" && init?.method === "PUT");
      expect(call).toBeDefined();
      const payload = JSON.parse(String(call?.[1]?.body));
      expect(payload.evidenceRefs).toEqual([]);
    });
  });
});
