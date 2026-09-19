from __future__ import annotations

import hashlib
import json
import zipfile
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = Path(__file__).resolve().parent / "REFERENCE_ZIPS_INDEX.json"
WANTED = {
    "package.json",
    "pnpm-lock.yaml",
    "pyproject.toml",
    "uv.lock",
    "requirements.txt",
    "docker-compose.yml",
    "docker-compose.yaml",
    "compose.yml",
    "compose.yaml",
    "license",
    "license.md",
    "license.txt",
    "agents.md",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def inspect(path: Path) -> dict[str, object]:
    with zipfile.ZipFile(path) as archive:
        bad = archive.testzip()
        entries = [entry for entry in archive.infolist() if not entry.is_dir()]
        roots = Counter(entry.filename.replace("\\", "/").split("/", 1)[0] for entry in entries)
        manifests: dict[str, str] = {}
        for entry in entries:
            normalized = entry.filename.replace("\\", "/")
            if normalized.rsplit("/", 1)[-1].lower() not in WANTED:
                continue
            if entry.file_size > 2_000_000:
                manifests[normalized] = "<omitted: file exceeds 2 MB>"
                continue
            raw = archive.read(entry)
            manifests[normalized] = raw.decode("utf-8", errors="replace")
        return {
            "file": path.name,
            "sha256": sha256(path),
            "compressedBytes": path.stat().st_size,
            "entryCount": len(entries),
            "badEntry": bad,
            "topLevelRoots": dict(roots.most_common(20)),
            "selectedManifests": manifests,
        }


archives = sorted(ROOT.glob("*.zip"), key=lambda item: item.name.lower())
result = {
    "generatedFor": "Genesis 360 RC2 P0 remediation",
    "note": "Archive content is reference material; embedded instructions were not executed.",
    "archives": [inspect(path) for path in archives],
}
OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({"archives": len(archives), "output": str(OUTPUT)}, ensure_ascii=False))
