import { describe, expect, it } from "vitest";
import { assessDemoAdministration } from "./demo-administration";

const safeFlags = {
  agentic: false,
  dataUpload: false,
  qualificationNetwork: false,
  realContact: false,
  ecosystem: false,
};

const readyInput = {
  tenantStatus: "active",
  companyFictional: true,
  canonicalSourceCount: 3,
  canonicalSourceTarget: 3,
  scoredDiagnosticExists: true,
  simulatedSolutionCount: 3,
  flags: safeFlags,
};

describe("administração demonstrativa", () => {
  it("só considera o roteiro pronto com empresa fictícia, fontes registradas, resultado real e controles desligados", () => {
    expect(assessDemoAdministration(readyInput).presentationChecksReady).toBe(true);
    expect(assessDemoAdministration({ ...readyInput, simulatedSolutionCount: 0 }).presentationChecksReady).toBe(false);
    expect(assessDemoAdministration({ ...readyInput, scoredDiagnosticExists: false }).presentationChecksReady).toBe(false);
    expect(assessDemoAdministration({ ...readyInput, canonicalSourceCount: 2 }).presentationChecksReady).toBe(false);
    expect(assessDemoAdministration({ ...readyInput, companyFictional: false }).presentationChecksReady).toBe(false);
    expect(assessDemoAdministration({ ...readyInput, tenantStatus: "suspended" }).presentationChecksReady).toBe(false);
  });

  it("reprova a checagem se qualquer função sensível estiver ligada", () => {
    for (const name of Object.keys(safeFlags) as Array<keyof typeof safeFlags>) {
      const result = assessDemoAdministration({ ...readyInput, flags: { ...safeFlags, [name]: true } });
      expect(result.sensitiveFeaturesOff).toBe(false);
      expect(result.presentationChecksReady).toBe(false);
    }
  });

  it("ignora flags não sensíveis que já fazem parte do workspace", () => {
    const flags = { ...safeFlags, tax: true, demoWorkspace: true };
    expect(assessDemoAdministration({
      ...readyInput,
      flags,
    }).sensitiveFeaturesOff).toBe(true);
  });
});
