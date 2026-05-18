#!/usr/bin/env bash

set -u

ROOT="${CLAUDE_PROJECT_DIR:-}"
if [ -z "$ROOT" ]; then
  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
fi

cd "$ROOT" || exit 2

echo "[harness] post-each-edit quick verification"

if ./init.sh --quick; then
  exit 0
fi

echo "[harness] quick verification failed; fix before continuing" >&2
exit 2
