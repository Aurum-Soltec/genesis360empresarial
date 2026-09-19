#!/usr/bin/env bash
set -euo pipefail

REMOTE="https://github.com/Aurum-Soltec/genesis360empresarial.git"

if [ ! -d .git ]; then
  git init
fi

git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

echo "Remote configured:"
git remote -v

echo
echo "Next:"
echo "  git add ."
echo '  git commit -m "chore: bootstrap Genesis 360 Empresarial production foundation v1.2"'
echo "  git push -u origin main"
