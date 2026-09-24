import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { requestDemoEvidencePackage } from "./demo-package-client.mjs";
import { demoAnswer } from "./demo-answer.mjs";

const baseURL = (process.env.DEMO_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const email = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;
const tenantName = process.env.DEMO_TENANT_NAME?.trim();
const profile = process.env.DEMO_PROFILE === "FULL" ? "FULL" : "ESSENTIAL";
const executablePath = process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outputDir = process.env.DEMO_OUTPUT_DIR ??
  "docs/audit-2026-09-18/demo-readiness";

if (!email || !password) {
  throw new Error("DEMO_EMAIL and DEMO_PASSWORD are required; credentials are never persisted in evidence.");
}

const metadataSource = JSON.parse(
  fs.readFileSync("data/diagnostic-question-metadata-v1.1.json", "utf8"),
);
const metadataById = new Map(
  metadataSource.questions.map((question) => [question.id, question]),
);
fs.mkdirSync(outputDir, { recursive: true });

function safeName(value) {
  return value.replace(/[^a-z0-9.-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

async function apiJson(page, method, pathname, data) {
  const response = await page.request.fetch(`${baseURL}${pathname}`, {
    method,
    headers: {
      origin: baseURL,
      "sec-fetch-site": "same-origin",
      ...(data === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(data === undefined ? {} : { data }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok()) {
    throw new Error(`${method} ${pathname} failed (${response.status()}): ${body.error ?? "UNKNOWN"}`);
  }
  return body;
}

const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "pt-BR",
});
const page = await context.newPage();
const startedAt = new Date().toISOString();

try {
  await page.goto(`${baseURL}/entrar`, { waitUntil: "networkidle" });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await Promise.all([
    page.waitForURL("**/selecionar-empresa"),
    page.getByRole("button", { name: "Entrar" }).click(),
  ]);

  const tenantButtons = page.locator("button.tenant-choice");
  if (await tenantButtons.count() === 0) {
    throw new Error("No active tenant is available for the demo user");
  }
  const matchingTenants = tenantName
    ? tenantButtons.filter({ has: page.getByText(tenantName, { exact: true }) })
    : tenantButtons;
  if (await matchingTenants.count() !== 1) {
    throw new Error(tenantName
      ? "The named demo tenant must match exactly one active tenant"
      : "DEMO_TENANT_NAME is required when the demo user has multiple active tenants");
  }
  const tenantButton = matchingTenants.first();
  await Promise.all([
    page.waitForURL(`${baseURL}/`),
    tenantButton.click(),
  ]);

  await page.goto(`${baseURL}/diagnostico-v1`, { waitUntil: "networkidle" });
  await page.getByRole("button", {
    name: profile === "FULL" ? /Diagnóstico completo/ : /Leitura essencial/,
  }).click();
  const startResponsePromise = page.waitForResponse(
    (response) => response.url() === `${baseURL}/api/diagnostics` &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Iniciar ou continuar" }).click();
  const startResponse = await startResponsePromise;
  const startBody = await startResponse.json();
  if (!startResponse.ok()) throw new Error(`Diagnostic start failed (${startResponse.status()})`);
  const startRequest = startResponse.request().postDataJSON();
  const diagnosticId = startBody.diagnostic.id;
  const companyId = startRequest.companyId;

  const evidenceIds = await requestDemoEvidencePackage(
    apiJson,
    page,
    companyId,
    diagnosticId,
  );

  let answeredCount = 0;
  for (; answeredCount < 100; answeredCount += 1) {
    const state = await apiJson(page, "GET", `/api/diagnostics/${diagnosticId}/state`);
    if (!state.nextQuestionId) {
      if (!state.canSubmit) {
        throw new Error(`Diagnostic path ended but cannot submit: ${(state.submissionBlockers ?? []).join(", ")}`);
      }
      break;
    }
    await apiJson(page, "PUT", `/api/diagnostics/${diagnosticId}/answers`, {
      questionId: state.nextQuestionId,
      expectedRevision: state.answerRevision,
      ...demoAnswer(state.nextQuestionId, metadataById.get(state.nextQuestionId), answeredCount),
    });
  }
  if (answeredCount >= 100) throw new Error("Diagnostic safety limit exceeded");

  await apiJson(page, "POST", `/api/diagnostics/${diagnosticId}/submit`);
  await page.goto(`${baseURL}/resultado-v1?diagnostic=${diagnosticId}`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Como esta leitura foi sustentada" }).waitFor();
  const resultText = await page.locator("body").innerText();
  if (!resultText.includes("Fontes vinculadas") || !resultText.includes("Regra de score")) {
    throw new Error("Traceable result content was not rendered");
  }
  if (!resultText.includes("Soluções compatíveis com as necessidades") || !resultText.includes("Empresas 100% fictícias")) {
    throw new Error("Controlled solution preview was not rendered in the report");
  }
  const provenanceMetrics = page.locator(".provenance-metrics > div strong");
  if (await provenanceMetrics.count() !== 4 ||
      await provenanceMetrics.nth(1).innerText() !== "0" ||
      await provenanceMetrics.nth(2).innerText() !== String(evidenceIds.length) ||
      await provenanceMetrics.nth(3).innerText() !== "0") {
    throw new Error("Demo provenance is not truthful: expected zero answer-level references, three diagnostic-level fictional sources, and zero verified sources");
  }

  const runSlug = safeName(new Date().toISOString());
  const resultScreenshot = path.join(outputDir, `${runSlug}-resultado.png`);
  const documentsScreenshot = path.join(outputDir, `${runSlug}-evidencias.png`);
  const demoScreenshot = path.join(outputDir, `${runSlug}-roteiro.png`);
  const councilScreenshot = path.join(outputDir, `${runSlug}-conselho.png`);
  const solutionsScreenshot = path.join(outputDir, `${runSlug}-solucoes.png`);
  const administrationScreenshot = path.join(outputDir, `${runSlug}-administracao.png`);
  const reportPdf = path.join(outputDir, `${runSlug}-relatorio.pdf`);
  await page.screenshot({ path: resultScreenshot, fullPage: true });
  await page.pdf({ path: reportPdf, format: "A4", printBackground: true });
  await page.goto(`${baseURL}/documentos`, { waitUntil: "networkidle" });
  await page.screenshot({ path: documentsScreenshot, fullPage: true });
  await page.goto(`${baseURL}/demonstracao`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Do documento à decisão, em um único fluxo." }).waitFor();
  const demoText = await page.locator("body").innerText();
  if (!demoText.includes("7/7") || !demoText.includes("Central administrativa")) {
    throw new Error("Presentation cockpit is not complete");
  }
  await page.screenshot({ path: demoScreenshot, fullPage: true });
  await page.goto(`${baseURL}/demonstracao/solucoes?diagnostic=${diagnosticId}`, { waitUntil: "networkidle" });
  const solutionsText = await page.locator("body").innerText();
  if (!solutionsText.includes("Dados e empresas 100% fictícios") || !solutionsText.includes("Qualification Network: desligada") || !solutionsText.includes("Contato real: desligado")) {
    throw new Error("Solution simulation boundaries were not rendered");
  }
  await page.screenshot({ path: solutionsScreenshot, fullPage: true });
  await page.goto(`${baseURL}/demonstracao/administracao`, { waitUntil: "networkidle" });
  const administrationText = await page.locator("body").innerText();
  if (!administrationText.includes("Central administrativa demonstrativa") || !administrationText.includes("Qualification Network") || !administrationText.includes("DESLIGADA")) {
    throw new Error("Administration boundaries were not rendered");
  }
  await page.screenshot({ path: administrationScreenshot, fullPage: true });
  await page.goto(`${baseURL}/conselho`, { waitUntil: "networkidle" });
  const councilText = await page.locator("body").innerText();
  if (!councilText.includes("Demonstração determinística") || !councilText.includes("Agentic: desligado")) {
    throw new Error("Council safety boundaries were not rendered");
  }
  await page.screenshot({ path: councilScreenshot, fullPage: true });

  const report = {
    wave: "DEMO-READINESS",
    executedAt: startedAt,
    baseURL,
    diagnosticId,
    profile,
    result: "PASS",
    answeredCount,
    evidenceCount: evidenceIds.length,
    answersWithEvidenceRefs: 0,
    evidenceVerification: "unverified_demo_declarations",
    artifacts: { resultScreenshot, documentsScreenshot, demoScreenshot, solutionsScreenshot, administrationScreenshot, councilScreenshot, reportPdf },
    boundaries: {
      fictionalData: true,
      realUserUploadEnabled: false,
      agenticEnabled: false,
      qualificationNetworkEnabled: false,
      realContactEnabled: false,
      credentialsPersisted: false,
    },
  };
  fs.writeFileSync(
    path.join(outputDir, `${runSlug}-run.json`),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await context.close();
  await browser.close();
}
