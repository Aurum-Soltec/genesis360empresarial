import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RecoverAccessPage from "./page";

describe("Recuperação de acesso", () => {
  it("mantém o e-mail fora da URL antes da hidratação", () => {
    const html = renderToString(<RecoverAccessPage />);
    expect(html).toMatch(/<form[^>]*method="post"/);
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Enviar instruções<\/button>/);
  });
});
