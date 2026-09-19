import fs from "node:fs";
if (!fs.existsSync("pnpm-lock.yaml")) {
  console.error("BLOCKED: pnpm-lock.yaml atualizado ainda não foi gerado. Execute pnpm deps:bootstrap em ambiente com acesso ao registro; revise e version e o lock. Não reutilize o arquivo histórico.");
  process.exit(1);
}
const lock = fs.readFileSync("pnpm-lock.yaml","utf8");
for (const [name, version] of [["next","16.3.3"],["react","19.2.8"],["react-dom","19.2.8"]]) {
  if (!lock.includes(`${name}@${version}`)) {
    console.error(`BLOCKED: resolução de ${name}@${version} ausente.`);
    process.exit(1);
  }
}
console.log("PASS - lock presente com alvos críticos; pnpm install --frozen-lockfile é a validação autoritativa.");
