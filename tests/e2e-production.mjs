import { chromium } from "playwright-core";
import fs from "node:fs";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const executablePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const password = "GenesisTest!2026";
const tenantA = "a1000000-0000-4000-8000-000000000001";
const tenantB = "b2000000-0000-4000-8000-000000000002";
const evidence = "docs/audit-2026-09-18";
fs.mkdirSync(evidence, { recursive: true });
const results = [];
const browser = await chromium.launch({ executablePath, headless: true });

async function signIn(page, email) {
  await page.goto(`${baseURL}/entrar`);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await Promise.all([page.waitForURL("**/selecionar-empresa"), page.getByRole("button", { name: "Entrar" }).click()]);
}
function record(name, pass, detail) { results.push({ name, pass, detail }); if (!pass) throw new Error(`${name}: ${detail}`); }

try {
  const anonymous = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const anonPage = await anonymous.newPage();
  await anonPage.goto(`${baseURL}/`);
  record("unauthenticated redirect", anonPage.url().includes("/entrar"), anonPage.url());
  await anonPage.screenshot({ path: `${evidence}/ps13-login-desktop.png`, fullPage: true });
  await anonymous.close();

  const multi = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const multiPage = await multi.newPage();
  await signIn(multiPage, "multi@genesis.test");
  const chooserText = await multiPage.locator("body").innerText();
  record("multi-tenant chooser", chooserText.includes("Tenant A") && chooserText.includes("Tenant B"), chooserText.slice(0, 300));
  await Promise.all([multiPage.waitForURL(`${baseURL}/`), multiPage.getByRole("button", { name: /Tenant A/ }).click()]);
  record("tenant A selected", multiPage.url() === `${baseURL}/`, multiPage.url());
  await multiPage.goto(`${baseURL}/selecionar-empresa`);
  await Promise.all([multiPage.waitForURL(`${baseURL}/`), multiPage.getByRole("button", { name: /Tenant B/ }).click()]);
  record("tenant switch A to B", multiPage.url() === `${baseURL}/`, multiPage.url());
  await multiPage.screenshot({ path: `${evidence}/ps13-home-desktop.png`, fullPage: true });
  await multi.close();

  const userA = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const userAPage = await userA.newPage();
  await signIn(userAPage, "user-a@genesis.test");
  const denied = await userAPage.request.post(`${baseURL}/api/tenant/active`, {
    headers: { origin: baseURL, "sec-fetch-site": "same-origin", "content-type": "application/json" },
    data: { tenantId: tenantB },
  });
  record("cross-tenant switch denied", denied.status() === 403, `status=${denied.status()}`);
  const allowed = await userAPage.request.post(`${baseURL}/api/tenant/active`, {
    headers: { origin: baseURL, "sec-fetch-site": "same-origin", "content-type": "application/json" },
    data: { tenantId: tenantA },
  });
  record("own tenant switch allowed", allowed.status() === 200, `status=${allowed.status()}`);
  await userA.close();

  const noTenant = await browser.newContext({ viewport: { width: 320, height: 720 } });
  const noTenantPage = await noTenant.newPage();
  await signIn(noTenantPage, "no-tenant@genesis.test");
  const emptyText = await noTenantPage.locator("body").innerText();
  record("user without tenant", emptyText.includes("não possui uma empresa ativa"), emptyText.slice(0, 300));
  await noTenantPage.screenshot({ path: `${evidence}/ps13-no-tenant-320.png`, fullPage: true });
  await noTenant.close();

  const accessibility = await browser.newContext({ viewport: { width: 320, height: 720 } });
  const a11yPage = await accessibility.newPage();
  await a11yPage.goto(`${baseURL}/entrar`);
  await a11yPage.keyboard.press("Tab");
  const focused = await a11yPage.evaluate(() => ({ tag: document.activeElement?.tagName, name: document.activeElement?.getAttribute("name") }));
  record("keyboard focus available", Boolean(focused.tag), JSON.stringify(focused));
  await a11yPage.evaluate(() => { document.documentElement.style.zoom = "2"; });
  const overflow = await a11yPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  record("320px at 200% no horizontal overflow", !overflow, `overflow=${overflow}`);
  await a11yPage.screenshot({ path: `${evidence}/ps13-login-320-zoom200.png`, fullPage: true });
  await accessibility.close();

  const expired = await browser.newContext();
  const expiredPage = await expired.newPage();
  await signIn(expiredPage, "user-b@genesis.test");
  await expiredPage.request.post(`${baseURL}/api/auth/signout`, { headers: { origin: baseURL, "sec-fetch-site": "same-origin" } });
  await expiredPage.goto(`${baseURL}/missoes`);
  record("expired session redirects", expiredPage.url().includes("/entrar"), expiredPage.url());
  await expired.close();
} finally {
  await browser.close();
}

const report = { wave: "PS-2/PS-13", executedAt: new Date().toISOString(), browser: "installed Chrome via playwright-core", results,
  passed: results.filter((r) => r.pass).length, failed: results.filter((r) => !r.pass).length };
fs.writeFileSync(`${evidence}/ps13-browser-e2e.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
