"""Local isolated audit runner. Never prints or persists generated database credentials."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
COPY = ROOT / ".audit-work/rc1/genesis360empresarial"
OUT = Path(__file__).resolve().parent
NODE = ROOT / ".audit-work/tools/node-v24.21.0-win-x64/node.exe"
PNPM = ROOT / ".audit-work/tools/pnpm/package/bin/pnpm.cjs"
CLI = ROOT / ".audit-work/tools/supabase/supabase.exe"
ENV = os.environ.copy()
ENV["PATH"] = str(NODE.parent) + os.pathsep + ENV.get("PATH", "")
ENV["NEXT_TELEMETRY_DISABLED"] = "1"
ENV["NO_COLOR"] = "1"

def safe(text):
    lines=[]
    for line in text.splitlines():
        if re.search(r"(?i)(secret|password|service.role|anon.key|publishable|api.key|jwt|database.url|postgres(?:ql)?://|eyJ[A-Za-z0-9_-]{15,}|sb_secret|sb_publishable)", line):
            lines.append("[credential-bearing output omitted]")
        else:
            lines.append(line)
    return "\n".join(lines)

def run(name, command, timeout=300, show=2200):
    start=time.monotonic()
    try:
        result=subprocess.run([str(x) for x in command], cwd=COPY, env=ENV,
                              stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                              text=True, encoding="utf-8", errors="replace", timeout=timeout)
        code=result.returncode
        log=safe(result.stdout)
    except subprocess.TimeoutExpired as error:
        code=124
        raw=error.stdout or b""
        log=safe(raw.decode("utf-8",errors="replace") if isinstance(raw,bytes) else raw)+"\nAUDIT_TIMEOUT"
    (OUT / (name+".log")).write_text(log,encoding="utf-8")
    record={"id":name,"exitCode":code,"seconds":round(time.monotonic()-start,2),"log":name+".log"}
    (OUT / (name+".json")).write_text(json.dumps(record,indent=2),encoding="utf-8")
    print(json.dumps(record),flush=True)
    print(log[-show:],flush=True)
    return code

mode=sys.argv[1]
if mode == "checks":
    tasks=[("lock",[NODE,"scripts/check-lockfile.mjs"]),
           ("public-copy",[NODE,"scripts/check-public-package.mjs"]),
           ("work",[NODE,"scripts/verify-work-package.mjs"]),
           ("openapi",[NODE,"scripts/check-openapi.mjs"]),
           ("design",[NODE,"scripts/check-design-system.mjs"]),
           ("security",[NODE,"scripts/check-security-contracts.mjs"]),
           ("trust",[NODE,"scripts/check-trust-boundaries.mjs"]),
           ("integrity",[NODE,"scripts/check-hardening-integrity.mjs"]),
           ("migrations-static",[NODE,"scripts/check-migrations.mjs"]),
           ("native",[NODE,"--test","tests/hardening-native/core.test.cjs"]),
           ("lint",[NODE,"node_modules/eslint/bin/eslint.js","."]),
           ("typecheck",[NODE,"node_modules/typescript/bin/tsc","--noEmit"]),
           ("vitest",[NODE,"node_modules/vitest/vitest.mjs","run"])]
    for name, command in tasks: run(name,command)
elif mode == "build":
    run("build",[NODE,"node_modules/next/dist/bin/next","build"],timeout=300,show=4500)
elif mode == "adversarial":
    run("adversarial",[NODE,"--test",OUT / "adversarial.test.cjs"],timeout=180,show=6500)
elif mode == "database-start":
    config=COPY / "supabase/config.toml"
    text=config.read_text(encoding="utf-8").replace('project_id = "genesis360-local"','project_id = "genesis360-audit-20260918"')
    for old,new in [(54321,55321),(54322,55322),(54320,55320),(3000,55400)]:
        text=text.replace(str(old),str(new))
    config.write_text(text,encoding="utf-8")
    for suffix in [".log",".json"]:
        prior=OUT / ("database-start"+suffix)
        if prior.exists(): prior.replace(OUT / ("database-start-attempt1"+suffix))
    run("database-start",[CLI,"start","-x","studio,imgproxy,mailpit,storage-api,realtime,edge-runtime,logflare,vector,supavisor,postgres-meta"],timeout=360,show=3000)
elif mode == "database-test":
    run("database-tests",[CLI,"test","db"],timeout=240,show=6500)
elif mode == "database-stop":
    run("database-stop",[CLI,"stop","--no-backup"],timeout=90)
else:
    raise SystemExit("Unknown audit mode")
