$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$node = Join-Path $repoRoot ".audit-work\tools\node-v24.21.0-win-x64\node.exe"
$env:Path = "$(Split-Path $node);$env:Path"
$steps = @(
  @{ Name = "lock"; Arguments = @("scripts/check-lockfile.mjs") },
  @{ Name = "work"; Arguments = @("scripts/verify-work-package.mjs", "scripts/check-openapi.mjs", "scripts/check-design-system.mjs", "scripts/check-hardening-integrity.mjs") },
  @{ Name = "security"; Arguments = @("scripts/check-security-contracts.mjs", "scripts/check-trust-boundaries.mjs") },
  @{ Name = "db-static"; Arguments = @("scripts/check-migrations.mjs") },
  @{ Name = "lint"; Arguments = @("node_modules/eslint/bin/eslint.js", ".") },
  @{ Name = "typecheck"; Arguments = @("node_modules/typescript/bin/tsc", "--noEmit") },
  @{ Name = "native"; Arguments = @("--test", "tests/hardening-native/core.test.cjs") },
  @{ Name = "vitest"; Arguments = @("node_modules/vitest/vitest.mjs", "run") },
  @{ Name = "build"; Arguments = @("node_modules/next/dist/bin/next", "build") }
)

Push-Location $repoRoot
try {
  foreach ($step in $steps) {
    if ($step.Name -eq "build") {
      $nextPath = Join-Path $repoRoot ".next"
      if (Test-Path $nextPath) {
        $resolvedNext = (Resolve-Path $nextPath).Path
        if (-not $resolvedNext.StartsWith($repoRoot.Path, [StringComparison]::OrdinalIgnoreCase)) {
          throw "Unsafe .next path"
        }
        Remove-Item -LiteralPath $resolvedNext -Recurse -Force
      }
    }
    $logPath = Join-Path $PSScriptRoot ("rc2-{0}.log" -f $step.Name)
    if (Test-Path $logPath) { Remove-Item -LiteralPath $logPath -Force }
    $exitCode = 0
    foreach ($commandArguments in $step.Arguments) {
      if ($step.Name -eq "work" -or $step.Name -eq "security") {
        $ErrorActionPreference = "Continue"
        & $node $commandArguments *>> $logPath
        $ErrorActionPreference = "Stop"
      }
      else {
        $ErrorActionPreference = "Continue"
        & $node @($step.Arguments) *> $logPath
        $ErrorActionPreference = "Stop"
        break
      }
      $exitCode = $LASTEXITCODE
      if ($exitCode -ne 0) { break }
    }
    $exitCode = $LASTEXITCODE
    Write-Output ("{0}={1}" -f $step.Name.ToUpperInvariant(), $exitCode)
    if ($exitCode -ne 0) {
      exit $exitCode
    }
  }
}
finally {
  Pop-Location
}
