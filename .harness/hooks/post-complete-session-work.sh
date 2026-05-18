#!/usr/bin/env bash

set -u

ROOT="${CLAUDE_PROJECT_DIR:-}"
if [ -z "$ROOT" ]; then
  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
fi

cd "$ROOT" || exit 2

echo "[harness] post-complete-session-work full verification"

if ./init.sh; then
  exit 0
fi

echo "[harness] full verification failed; turn closure rejected" >&2
exit 2
