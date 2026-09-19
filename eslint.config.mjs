import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "scripts/**/*.cjs",
      "tests/hardening-native/**/*.cjs",
      "docs/audit-2026-09-18/**/*.cjs"
    ],
    rules: { "@typescript-eslint/no-require-imports": "off" }
  },
  {
    ignores: [".audit-work/**", ".next/**", "coverage/**", "dist/**", "docs/history/**"]
  }
];

export default eslintConfig;
