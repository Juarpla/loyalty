#!/usr/bin/env bash

set -u

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok() { printf "${GREEN}[OK]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
fail() { printf "${RED}[FAIL]${NC} %s\n" "$1"; }

EXIT_CODE=0

echo "== 1. Environment =="

if ! command -v node >/dev/null 2>&1; then
  fail "node is not installed"
  exit 1
fi
ok "node -> $(node --version)"

if ! command -v pnpm >/dev/null 2>&1; then
  fail "pnpm is not installed"
  exit 1
fi
ok "pnpm -> $(pnpm --version)"

echo ""
echo "== 2. Harness files =="

BASE_FILES=(
  "AGENTS.md"
  "CLAUDE.md"
  "opencode.json"
  ".cursor/rules/harness.mdc"
  "feature_list.json"
  "progress/current.md"
  "progress/history.md"
  "docs/architecture.md"
  "docs/conventions.md"
  "docs/specs.md"
  "docs/verification.md"
  "CHECKPOINTS.md"
)

for file in "${BASE_FILES[@]}"; do
  if [ -f "$file" ]; then
    ok "exists $file"
  else
    fail "missing $file"
    EXIT_CODE=1
  fi
done

echo ""
echo "== 3. Feature state and specs =="

node -e '
const fs = require("fs");
const path = require("path");

const valid = new Set(["pending", "spec_ready", "in_progress", "done", "blocked"]);
const data = JSON.parse(fs.readFileSync("feature_list.json", "utf8"));

if (!Array.isArray(data.features)) {
  throw new Error("feature_list.json must contain a features array");
}

const inProgress = data.features.filter((feature) => feature.status === "in_progress");
if (inProgress.length > 1) {
  throw new Error(`only one feature may be in_progress, found ${inProgress.length}`);
}

const requiringSpecs = new Set(["spec_ready", "in_progress", "done"]);
const missing = [];

for (const feature of data.features) {
  if (typeof feature.name !== "string" || feature.name.length === 0) {
    throw new Error("each feature must have a non-empty name");
  }
  if (!valid.has(feature.status)) {
    throw new Error(`invalid status for ${feature.name}: ${feature.status}`);
  }
  if (feature.sdd && requiringSpecs.has(feature.status)) {
    for (const file of ["requirements.md", "design.md", "tasks.md"]) {
      const specPath = path.join("specs", feature.name, file);
      if (!fs.existsSync(specPath)) {
        missing.push(specPath);
      }
    }
  }
}

if (missing.length > 0) {
  throw new Error(`missing spec files: ${missing.join(", ")}`);
}

console.log(`[OK] feature_list.json valid (${data.features.length} features)`);
' || EXIT_CODE=1

echo ""
echo "== 4. Next.js checks =="

if pnpm lint; then
  ok "pnpm lint passed"
else
  fail "pnpm lint failed"
  EXIT_CODE=1
fi

if pnpm build; then
  ok "pnpm build passed"
else
  fail "pnpm build failed"
  EXIT_CODE=1
fi

echo ""
echo "== 5. Summary =="

if [ "$EXIT_CODE" -eq 0 ]; then
  ok "harness ready"
else
  fail "harness is not ready"
fi

exit "$EXIT_CODE"
