/* Test-only CommonJS loader. Uses the installed TypeScript compiler; does not mock domain code.
 * This transpiles syntax, not the project's semantic typecheck or Next build.
 */
const Module = require("node:module");
const path = require("node:path");
const fs = require("node:fs");
const ts = require("typescript");
const root = path.resolve(process.env.GENESIS_TEST_ROOT || path.join(__dirname, "../.."));
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  return resolve.call(this, request.startsWith("@/") ? path.join(root, request.slice(2)) : request, parent, ...rest);
};
require.extensions[".ts"] = function (module, filename) {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      esModuleInterop: true, resolveJsonModule: true, jsx: ts.JsxEmit.ReactJSX },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
    getCanonicalFileName: (f) => f, getCurrentDirectory: () => root, getNewLine: () => "\n",
  }));
  module._compile(result.outputText, filename);
};
module.exports = { root, ts };
