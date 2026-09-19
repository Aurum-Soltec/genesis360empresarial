import { readdir, readFile } from "node:fs/promises";

const dir = new URL("../supabase/migrations/", import.meta.url);
const files = (await readdir(dir)).filter((name) => name.endsWith(".sql")).sort();

if (!files.length) {
  throw new Error("No SQL migration found.");
}

for (const file of files) {
  const sql = await readFile(new URL(file, dir), "utf8");
  const createsTable = /create\s+table/i.test(sql);
  if (createsTable && !sql.includes("enable row level security")) {
    throw new Error(`${file}: creates table(s) without explicit RLS enablement.`);
  }
  if (/secret|password\s*=|api[_-]?key\s*=/i.test(sql)) {
    throw new Error(`${file}: possible secret embedded in migration.`);
  }
}

console.log(`Validated ${files.length} migration(s): ${files.join(", ")}`);
