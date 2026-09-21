import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const baseURL = (process.env.DEMO_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const email = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;
const tenantName = process.env.DEMO_TENANT_NAME;
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

function demoAnswer(questionId, evidenceIds, position) {
  const metadata = metadataById.get(questionId);
  if (!metadata) throw new Error(`Missing metadata for ${questionId}`);

  const informationSlots = Object.fromEntries(
    (metadata.informationSlots ?? []).map((slot) => [
      slot.key,
      /date|data|period|período/i.test(`${slot.key} ${slot.label}`)
        ? "2026-09-21"
        : "Informação fictícia do cenário controlado de demonstração",
    ]),
  );
  const evidenceRefs = evidenceIds.length
    ? [evidenceIds[position % evidenceIds.length]]
    : [];

  if (questionId === "TEC-002") {
    const option = metadata.ui?.options?.find(
      (candidate) => typeof candidate === "object" && candidate.maturity === 2,
    ) ?? metadata.ui?.options?.find((candidate) => typeof candidate === "object");
    if (!option || typeof option === "string") throw new Error("TEC-002 option missing");
    return {
      answerState: "ANSWERED",
      response: { choice: option.value },
      maturity: option.maturity ?? null,
      informationSlots,
      evidenceRefs,
    };
  }

  if (metadata.scoreRole === "CORE_ANCHOR") {
    const maturity = position % 5 === 0 ? 3 : 2;
    return {
      answerState: "ANSWERED",
      response: { maturity },
      maturity,
      informationSlots,
      evidenceRefs,
    };
  }

  const firstOption = metadata.ui?.options?.[0];
  const choice = typeof firstOption === "string" ? firstOption : firstOption?.value;
  return {
    answerState: "ANSWERED",
    response: {
      value: "Resposta fictícia do cenário controlado de demonstração",
      choice: choice ?? null,
    },
    maturity: null,
    informationSlots,
    evidenceRefs,
  };
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
  if (await tenantButtons.count() === 0) throw new Error("No active tenant is available for the demo user");
  const tenantButton = tenantName
    ? page.getByRole("button", { name: new RegExp(tenantName, "i") }).first()
    : tenantButtons.first();
  await Promise.all([
    page.waitForURL(`${baseURL}/`),
    tenantButton.click(),
  ]);

  await page.goto(`${baseURL}/diagnostico-v1`, { waitUntil: "networkidle" });
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

  const evidenceTemplates = [
    {
      evidenceType: "user_declaration",
      summary: "Prioridades estratégicas declaradas pela liderança no cenário de demonstração",
      payload: { demo: true, source: "leadership_interview", disclaimer: "Fictional demonstration data" },
      sourceRef: "DEMO:entrevista-lideranca",
    },
    {
      evidenceType: "metric",
      summary: "Indicadores operacionais fictícios usados no cenário de demonstração",
      payload: { demo: true, period: "2026-Q3", disclaimer: "Fictional demonstration data" },
      sourceRef: "DEMO:indicadores-operacionais",
    },
    {
      evidenceType: "observation",
      summary: "Observação de processo fictícia para demonstrar rastreabilidade",
      payload: { demo: true, source: "process_review", disclaimer: "Fictional demonstration data" },
      sourceRef: "DEMO:revisao-processos",
    },
  ];

  const evidenceIds = [];
  for (const item of evidenceTemplates) {
    const created = await apiJson(page, "POST", "/api/evidence", {
      companyId,
      ...item,
      sensitivity: "internal",
      purposeCodes: ["DEMO_CONTROLLED"],
      link: { subjectType: "diagnostic", subjectId: diagnosticId, relation: "supports" },
    });
    evidenceIds.push(created.evidence.id);
  }

  let answeredCount = 0;
  for (; answeredCount < 80; answeredCount += 1) {
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
      ...demoAnswer(state.nextQuestionId, evidenceIds, answeredCount),
    });
  }
  if (answeredCount >= 80) throw new Error("Diagnostic safety limit exceeded");

  await apiJson(page, "POST", `/api/diagnostics/${diagnosticId}/submit`);
  await page.goto(`${baseURL}/resultado-v1?diagnostic=${diagnosticId}`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Como esta leitura foi sustentada" }).waitFor();
  const resultText = await page.locator("body").innerText();
  if (!resultText.includes("Fontes vinculadas") || !resultText.includes("Regra de score")) {
    throw new Error("Traceable result content was not rendered");
  }

  const runSlug = safeName(new Date().toISOString());
  const resultScreenshot = path.join(outputDir, `${runSlug}-resultado.png`);
  const documentsScreenshot = path.join(outputDir, `${runSlug}-evidencias.png`);
  const reportPdf = path.join(outputDir, `${runSlug}-relatorio.pdf`);
  await page.screenshot({ path: resultScreenshot, fullPage: true });
  await page.pdf({ path: reportPdf, format: "A4", printBackground: true });
  await page.goto(`${baseURL}/documentos`, { waitUntil: "networkidle" });
  await page.screenshot({ path: documentsScreenshot, fullPage: true });

  const report = {
    wave: "DEMO-READINESS",
    executedAt: startedAt,
    baseURL,
    diagnosticId,
    profile: "ESSENTIAL",
    result: "PASS",
    answeredCount,
    evidenceCount: evidenceIds.length,
    evidenceVerification: "unverified_demo_declarations",
    artifacts: { resultScreenshot, documentsScreenshot, reportPdf },
    boundaries: {
      fictionalData: true,
      realUserUploadEnabled: false,
      agenticEnabled: false,
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
