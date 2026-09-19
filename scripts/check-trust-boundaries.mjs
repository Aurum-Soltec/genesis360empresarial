import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const sourceFiles = ["app", "lib", "components"]
  .filter(fs.existsSync)
  .flatMap(walk)
  .filter((file) => /\.(ts|tsx|js|mjs)$/.test(file))
  .filter((file) => !/\.test\.(ts|tsx|js|mjs)$/.test(file));

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");

  if (
    source.includes("SUPABASE_SERVICE_ROLE_KEY") &&
    file.replaceAll("\\", "/") !== "lib/supabase/admin.ts"
  ) {
    console.error(`SERVICE ROLE KEY referenced outside admin boundary: ${file}`);
    process.exit(1);
  }

  if (
    source.includes("createSupabaseAdminClient") &&
    file.replaceAll("\\", "/") !== "lib/server/trusted-data-access.ts" &&
    file.replaceAll("\\", "/") !== "lib/supabase/admin.ts"
  ) {
    console.error(`Admin client used outside the trusted data boundary: ${file}`);
    process.exit(1);
  }

  if (
    source.includes("trustedPlatformReadClient") &&
    file.replaceAll("\\", "/").startsWith("app/api/")
  ) {
    console.error(`Platform read client exposed to API route: ${file}`);
    process.exit(1);
  }
}

const intelligenceFiles = fs.existsSync("intelligence")
  ? walk("intelligence").filter((file) => file.endsWith(".py"))
  : [];

for (const file of intelligenceFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const forbidden of [
    "DATABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "psycopg",
    "asyncpg",
  ]) {
    if (source.includes(forbidden) && !file.endsWith("test_no_database_credentials.py")) {
      console.error(`Forbidden agent DB boundary token ${forbidden}: ${file}`);
      process.exit(1);
    }
  }
}

console.log("PASS - trusted server and agent data boundaries are statically enforced.");
