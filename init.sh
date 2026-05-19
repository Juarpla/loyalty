#!/usr/bin/env bash

set -u

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok() { printf "${GREEN}[OK]${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
fail() { printf "${RED}[FAIL]${NC} %s\n" "$1"; }

MODE="full"
if [ "${1:-}" = "--quick" ]; then
  MODE="quick"
elif [ "${1:-}" != "" ]; then
  fail "unknown argument: $1"
  echo "usage: ./init.sh [--quick]"
  exit 1
fi

EXIT_CODE=0

echo "== 1. Checking System Environment & Dependencies ==="

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
echo "== 2. Auditing Agent Harness & Spec Files ==="

BASE_FILES=(
  "AGENTS.md"
  "CLAUDE.md"
  "opencode.json"
  ".cursor/rules/harness.mdc"
  ".agents/subagents/leader.md"
  ".agents/subagents/spec_author.md"
  ".agents/subagents/implementer.md"
  ".agents/subagents/reviewer.md"
  ".claude/agents/leader.md"
  ".claude/agents/spec_author.md"
  ".claude/agents/implementer.md"
  ".claude/agents/reviewer.md"
  ".claude/settings.json"
  ".cursor/hooks.json"
  ".codex/hooks.json"
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

for file in "init.sh"; do
  if [ -x "$file" ]; then
    ok "executable $file"
  else
    fail "not executable $file"
    EXIT_CODE=1
  fi
done

echo ""
echo "== 3. Validating Git Hooks & Agent Automation Settings ==="

node -e '
const fs = require("fs");
const files = [".claude/settings.json", ".cursor/hooks.json", ".codex/hooks.json"];

for (const file of files) {
  const settings = JSON.parse(fs.readFileSync(file, "utf8"));
  const hooks = settings.hooks || {};

  const postToolUse = hooks.PostToolUse || [];
  const stop = hooks.Stop || [];
  const postCommands = JSON.stringify(postToolUse);
  const stopCommands = JSON.stringify(stop);

  if (!postCommands.includes("init.sh --quick")) {
    throw new Error(`PostToolUse in ${file} must call init.sh --quick directly`);
  }
  if (!postCommands.includes("Edit|Write|MultiEdit")) {
    throw new Error(`PostToolUse matcher in ${file} must include Edit|Write|MultiEdit`);
  }
  if (!stopCommands.includes("init.sh")) {
    throw new Error(`Stop in ${file} must call init.sh directly`);
  }
}

console.log("[OK] Agent hook settings valid (.claude, .cursor, .codex)");
' || EXIT_CODE=1

echo ""
echo "== 4. Analyzing Feature Lifecycle State & SDD Spec Completeness ==="

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
echo "== 5. Running Integration Tests (Vitest) ==="

# Vitest runs in both --quick and full mode.
# Integration tests are fast (no server, no browser) — keeping them in quick mode
# catches regressions immediately after every edit.
if pnpm test; then
  ok "pnpm test passed"
else
  fail "pnpm test failed — fix before continuing"
  EXIT_CODE=1
fi

echo ""
echo "== 6. Executing Next.js Linter & Production Build Compilations ==="

if pnpm lint; then
  ok "pnpm lint passed"
else
  fail "pnpm lint failed"
  EXIT_CODE=1
fi

if [ "$MODE" = "full" ]; then
  if pnpm build; then
    ok "pnpm build passed"
  else
    fail "pnpm build failed"
    EXIT_CODE=1
  fi
else
  warn "quick mode: skipped pnpm build"
fi

echo ""
echo "== 7. Final Harness Health Verification Summary ==="

if [ "$EXIT_CODE" -eq 0 ]; then
  ok "harness ready ($MODE)"
else
  fail "harness is not ready ($MODE)"
fi

exit "$EXIT_CODE"
