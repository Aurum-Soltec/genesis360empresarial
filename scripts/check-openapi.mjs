import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const spec = fs.readFileSync("docs/API/openapi.yaml", "utf8");
const routeFiles = walk("app/api").filter((file) => file.endsWith("route.ts"));

const missing = [];
for (const file of routeFiles) {
  const normalized = file.replaceAll("\\", "/");
  const relative = normalized
    .replace(/^app\/api\//, "")
    .replace(/\/route\.ts$/, "")
    .replace(/\[([^\]]+)\]/g, "{$1}");
  const openapiPath = `/${relative}:`;
  if (!spec.includes(openapiPath)) {
    missing.push({ file: normalized, path: `/${relative}` });
  }
}

if (missing.length) {
  for (const item of missing) {
    console.error(`OPENAPI MISSING ${item.path} <- ${item.file}`);
  }
  process.exit(1);
}

if (!spec.includes("openapi: 3.1.0")) {
  console.error("OpenAPI version must be 3.1.0");
  process.exit(1);
}

console.log(`PASS - OpenAPI covers ${routeFiles.length} API route file(s).`);
