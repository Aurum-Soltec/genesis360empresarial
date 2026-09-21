import fs from "node:fs";

const required = [
  "design-system/genesis-precision-light/manifest.json",
  "design-system/genesis-precision-light/DESIGN.md",
  "design-system/genesis-precision-light/tokens.css",
  "design-system/genesis-precision-light/COMPONENTS.md",
  "design-system/genesis-precision-light/PATTERNS.md",
  "design-system/genesis-precision-light/NAVIGATION.md",
  "design-system/genesis-precision-light/RESPONSIVE.md",
  "design-system/genesis-precision-light/ACCESSIBILITY.md",
  "components/app-navigation.tsx",
  "app/page.tsx",
  "app/diagnostico-v1/journey.tsx",
  "app/resultado-v1/page.tsx",
];

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING DESIGN CONTRACT: ${file}`);
    process.exit(1);
  }
}

const css = fs.readFileSync("app/globals.css", "utf8");
const nav = fs.readFileSync("components/app-navigation.tsx", "utf8");
const home = fs.readFileSync("app/page.tsx", "utf8");
const diagnostic = fs.readFileSync("app/diagnostico-v1/journey.tsx", "utf8");
const result = fs.readFileSync("app/resultado-v1/page.tsx", "utf8");

for (const token of [
  "--g-canvas: #f5f8f7",
  "--g-ink: #082b29",
  "--g-deep: #0b3d3a",
  "--g-green: #08783d",
  "--g-brand-green: #00c853",
  "--g-lime: #7ed321",
  "--g-topbar: 76px",
  "--g-sidebar: 236px",
]) {
  if (!css.includes(token)) {
    console.error(`TOKEN DRIFT: ${token}`);
    process.exit(1);
  }
}

if (/linear-gradient|radial-gradient/i.test(css)) {
  console.error("Genesis Precision Light forbids decorative gradients in the canonical app CSS.");
  process.exit(1);
}

for (const token of [
  "usePathname",
  "aria-current",
  "aria-expanded",
  "mobile-nav-drawer",
  "Hoje",
  "Diagnóstico",
  "Evolução",
  "Soluções",
  "Conselho",
]) {
  if (!nav.includes(token)) {
    console.error(`NAVIGATION CONTRACT MISSING: ${token}`);
    process.exit(1);
  }
}

for (const [name, source, tokens] of [
  ["Home", home, ["executive-hero", "Suas prioridades agora", "Growth Score", "Confiabilidade"]],
  ["Diagnostic", diagnostic, ["diagnostic-stage-rail", "Progresso", "Confiabilidade", "Não sei", "Responder depois"]],
  ["Result", result, ["result-hero", "Growth Score", "O que merece atenção agora", "Ver detalhes técnicos da leitura"]],
]) {
  for (const token of tokens) {
    if (!source.includes(token)) {
      console.error(`${name} CANONICAL SCREEN MISSING: ${token}`);
      process.exit(1);
    }
  }
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}
function luminance(hex) {
  const rgb = hexToRgb(hex).map((c) => c / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

const contrastPairs = [
  ["primary text / white", "#082B29", "#FFFFFF", 7],
  ["secondary text / white", "#4F625F", "#FFFFFF", 4.5],
  ["accessible Genesis green / white", "#08783D", "#FFFFFF", 4.5],
  ["white / Genesis deep", "#FFFFFF", "#0B3D3A", 7],
  ["ink / lime", "#082B29", "#7ED321", 7],
];

for (const [label, fg, bg, minimum] of contrastPairs) {
  const ratio = contrast(fg, bg);
  if (ratio < minimum) {
    console.error(`CONTRAST FAIL ${label}: ${ratio.toFixed(2)} < ${minimum}`);
    process.exit(1);
  }
}

console.log("PASS - Genesis Precision Light design contracts, navigation, canonical screens and contrast checks.");
