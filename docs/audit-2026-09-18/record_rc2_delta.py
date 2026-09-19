from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LEGACY_PATH = ROOT / "docs/canonical/v1/quality/WAVE8_BACKEND_BASELINE.json"
DELTA_PATH = ROOT / "docs/hardening-v1.2.1/REVIEWABLE-CODE-DELTA.json"

RC2_FILES = [
    "AGENTS.md",
    "PROJECT-STATE.md",
    "START_HERE_V1_2_1.md",
    ".env.example",
    ".gitignore",
    ".github/workflows/ci.yml",
    "GATES.json",
    "app/globals.css",
    "app/entrar/page.tsx",
    "app/recuperar-acesso/page.tsx",
    "app/nova-senha/page.tsx",
    "app/auth/callback/route.ts",
    "app/selecionar-empresa/page.tsx",
    "app/selecionar-empresa/tenant-chooser.tsx",
    "app/api/auth/signout/route.ts",
    "app/api/tenant/active/route.ts",
    "app/api/tenant/members/route.ts",
    "app/api/upload-sessions/[id]/target/route.ts",
    "app/api/consents/route.ts",
    "app/api/attestations/route.ts",
    "app/api/decisions/[id]/missions/route.ts",
    "app/api/diagnostics/route.ts",
    "app/api/diagnostics/[id]/answers/route.ts",
    "app/api/diagnostics/[id]/submit/route.ts",
    "app/api/evidence/route.ts",
    "app/api/missions/[id]/evidence/route.ts",
    "app/api/missions/[id]/outcome/route.ts",
    "app/api/missions/[id]/transition/route.ts",
    "app/api/pains/[id]/gds/route.ts",
    "app/api/passport/facts/route.ts",
    "app/api/solutions/contact/route.ts",
    "app/api/upload-sessions/route.ts",
    "app/diagnostico-v1/journey.tsx",
    "app/indicadores/page.tsx",
    "app/privacidade/page.tsx",
    "components/app-navigation.tsx",
    "docs/canonical/v1/delivery/RC2_SCOPE_FREEZE_2026-09-19.md",
    "docs/canonical/v1/delivery/GENESIS_360_PRODUCTION_SCALE_BASELINE_RC2.md",
    "docs/canonical/v1/delivery/GENESIS_360_PRODUCTION_READINESS_REPORT.md",
    "docs/canonical/v1/delivery/EPICS_CATALOG.json",
    "docs/canonical/v1/delivery/EPICS_MASTER.md",
    "docs/canonical/v1/delivery/STORIES_CATALOG.csv",
    "docs/canonical/v1/delivery/STORIES_MASTER.md",
    "docs/canonical/v1/gates/GATES.json",
    "docs/canonical/v1/architecture/ENTERPRISE_MEMORY_CONTRACT.md",
    "docs/canonical/v1/operations/BACKUP_RESTORE_RUNBOOK.md",
    "docs/canonical/v1/operations/ENVIRONMENTS_AND_RELEASES.md",
    "docs/canonical/v1/operations/SRE_OBSERVABILITY.md",
    "docs/API/openapi.yaml",
    "docs/audit-2026-09-18/ps8-backup-restore.json",
    "docs/audit-2026-09-18/ps3-worker-runtime.json",
    "docs/audit-2026-09-18/ps9-dependency-audit.json",
    "docs/audit-2026-09-18/ps9-license-inventory.json",
    "docs/audit-2026-09-18/ps10-load-percentiles.json",
    "docs/audit-2026-09-18/ps13-browser-e2e.json",
    "docs/audit-2026-09-18/run_rc2_gates.ps1",
    "docs/canonical/v1/quality/LEGACY_CROSS_TENANT_TEST_SPEC.md",
    "docs/audit-2026-09-18/adversarial.test.cjs",
    "eslint.config.mjs",
    "lib/consent.ts",
    "lib/api-errors.ts",
    "lib/http-security.ts",
    "lib/observability.ts",
    "lib/observability.test.ts",
    "lib/tenant-context.ts",
    "lib/supabase/client.ts",
    "lib/supabase/server.ts",
    "lib/agent-runtime/tool-authorization.ts",
    "lib/agent-runtime/tool-authorization.test.ts",
    "lib/diagnostic-engine.ts",
    "lib/feature-flags.test.ts",
    "lib/feature-flags.ts",
    "lib/qualification-engine.test.ts",
    "lib/qualification-engine.ts",
    "lib/server/qualified-solutions.ts",
    "lib/server/trusted-data-access.ts",
    "lib/server/trusted-data-access.test.ts",
    "package.json",
    "pnpm-lock.yaml",
    "proxy.ts",
    "instrumentation.ts",
    "config/environments/development.json",
    "config/environments/staging.json",
    "config/environments/production.json",
    "config/observability/alerts.json",
    "scripts/check-public-package.mjs",
    "scripts/check-production-scale-baseline.mjs",
    "scripts/check-trust-boundaries.mjs",
    "scripts/check-delivery-config.mjs",
    "scripts/run-backup-restore-drill.ps1",
    "scripts/scale-seed.sql",
    "scripts/scale-workload.sql",
    "supabase/migrations/0016_rc2_p0_fail_closed_guards.sql",
    "supabase/migrations/0017_rc2_p0_runtime_contract_fixes.sql",
    "supabase/migrations/0018_production_async_runtime.sql",
    "supabase/migrations/0019_production_database_scale.sql",
    "supabase/migrations/0020_production_tenant_quotas.sql",
    "supabase/migrations/0021_production_storage_foundation.sql",
    "supabase/migrations/0022_agent_foundation_disabled.sql",
    "supabase/migrations/0023_operational_observability_views.sql",
    "supabase/config.toml",
    "supabase/tests/0002_cross_tenant_rls.sql",
    "supabase/tests/000_setup_test_helpers.sql",
    "supabase/tests/002_cross_tenant_rls.test.sql",
    "supabase/tests/005_end_to_end_core.test.sql",
    "supabase/tests/006_consent_privacy.test.sql",
    "supabase/tests/007_rc2_p0_guards.test.sql",
    "supabase/tests/011_production_scale_foundation.test.sql",
    "tests/e2e-production.mjs",
    "tests/hardening-native/core.test.cjs",
    "vitest.config.mts",
    "workers/outbox-runtime.mjs",
    "workers/outbox-runtime.d.mts",
    "workers/outbox-runtime.test.ts",
    "workers/outbox-worker.mjs",
]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


legacy = json.loads(LEGACY_PATH.read_text(encoding="utf-8"))
delta = json.loads(DELTA_PATH.read_text(encoding="utf-8"))
entries = {entry["path"]: entry for entry in delta["files"]}

for relative in RC2_FILES:
    current = ROOT / relative
    if not current.is_file():
        raise SystemExit(f"RC2 evidence file is missing: {relative}")
    entry = entries.get(relative)
    if entry is None:
        entry = {
            "path": relative,
            "beforeSha256": legacy.get(relative),
            "afterSha256": None,
            "reason": "RC2 P0 remediation, executable regression, or scope evidence",
        }
        delta["files"].append(entry)
        entries[relative] = entry
    entry["afterSha256"] = digest(current)
    entry["reason"] = "RC2 P0 remediation, executable regression, or scope evidence"

delta["version"] = "1.2.1-rc.2"
delta["status"] = "p0_remediated_runtime_verified_candidate_not_production_approval"
delta["files"].sort(key=lambda item: item["path"])
DELTA_PATH.write_text(
    json.dumps(delta, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(f"Recorded {len(RC2_FILES)} RC2 files; delta now has {len(delta['files'])} entries.")
