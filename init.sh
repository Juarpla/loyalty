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

const data = JSON.parse(fs.readFileSync("feature_list.json", "utf8"));
const progressCurrent = fs.existsSync("progress/current.md")
  ? fs.readFileSync("progress/current.md", "utf8")
  : "";
const configuredStatuses = data.rules && Array.isArray(data.rules.valid_status)
  ? data.rules.valid_status
  : ["pending", "spec_author", "spec_ready", "in_progress", "in_review", "done", "blocked"];
const valid = new Set(configuredStatuses);
const blockedRequiresReason = data.rules?.blocked_features_require_reason !== false;

if (!Array.isArray(data.features)) {
  throw new Error("feature_list.json must contain a features array");
}

const seenIds = new Set();
const seenNames = new Set();
const requiringSpecs = new Set(["spec_ready", "in_progress", "in_review", "done"]);
const missing = [];

for (const feature of data.features) {
  if (seenIds.has(feature.id)) {
    throw new Error(`duplicate feature id: ${feature.id}`);
  }
  seenIds.add(feature.id);

  if (typeof feature.name !== "string" || feature.name.length === 0) {
    throw new Error("each feature must have a non-empty name");
  }
  if (seenNames.has(feature.name)) {
    throw new Error(`duplicate feature name: ${feature.name}`);
  }
  seenNames.add(feature.name);

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
  if (blockedRequiresReason && feature.status === "blocked") {
    if (!progressCurrent.includes(feature.name)) {
      throw new Error(`blocked feature ${feature.name} must be documented in progress/current.md`);
    }
  }
}

if (missing.length > 0) {
  throw new Error(`missing spec files: ${missing.join(", ")}`);
}

console.log(`[OK] feature_list.json valid (${data.features.length} features)`);
' || EXIT_CODE=1

echo ""
echo "== 4.5. Validating feature_list.json Integrity Against Snapshot ==="

node -e '
const fs = require("fs");

const snapshotPath = ".feature_snapshot.json";
const featureListPath = "feature_list.json";

const data = JSON.parse(fs.readFileSync(featureListPath, "utf8"));
const features = data.features;

// Strip status from a feature object for comparison
const stripStatus = (f) => {
  const { status, ...rest } = f;
  return rest;
};

if (!fs.existsSync(snapshotPath)) {
  // First run or fresh clone: create baseline snapshot from current state
  const snapshot = features.map(stripStatus);
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`[OK] Created feature snapshot baseline (${snapshot.length} features)`);
} else {
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));

  // Check: no features were deleted
  const snapshotIds = new Set(snapshot.map(f => f.id));
  const currentIds = new Set(features.map(f => f.id));

  const missing = snapshot.filter(f => !currentIds.has(f.id));
  if (missing.length > 0) {
    throw new Error(
      "FEATURES DELETED from feature_list.json: [" +
      missing.map(f => "#" + f.id + " " + f.name).join(", ") +
      "]. Only the \"status\" field may ever change. Restore deleted features before continuing."
    );
  }

  // Check: no non-status fields were modified on existing features
  for (const snapFeature of snapshot) {
    const currentFeature = features.find(f => f.id === snapFeature.id);
    if (!currentFeature) continue; // already caught above

    const currentStripped = stripStatus(currentFeature);
    if (JSON.stringify(currentStripped) !== JSON.stringify(snapFeature)) {
      const changedFields = Object.keys(currentStripped).filter(
        k => JSON.stringify(currentStripped[k]) !== JSON.stringify(snapFeature[k])
      );
      throw new Error(
        "NON-STATUS FIELD MODIFIED on feature #" + snapFeature.id + " \"" + snapFeature.name +
        "\": changed fields: [" + changedFields.join(", ") +
        "]. Only \"status\" may change. Revert unauthorized modifications."
      );
    }
  }

  // Update snapshot to include any legitimately added features
  const updatedSnapshot = features.map(stripStatus);
  fs.writeFileSync(snapshotPath, JSON.stringify(updatedSnapshot, null, 2) + "\n");
  console.log("[OK] Feature list integrity verified against snapshot (" + features.length + " features)");
}
' || EXIT_CODE=1

echo ""
echo "== 4.6. Auditing Supabase & Vercel Configuration ==="

# Check if supabase config folder is initialized
if [ -d "supabase" ]; then
  ok "Supabase directory detected"
  if pnpm exec supabase db lint >/dev/null 2>&1; then
    ok "Supabase migrations lint passed"
  else
    warn "Supabase migrations lint skipped or offline (start local database first)"
  fi
else
  warn "Supabase is not yet initialized. Run 'pnpm db:init' to configure."
fi

# Check if vercel project config exists
if [ -d ".vercel" ]; then
  ok "Vercel directory configuration detected"
else
  warn "Vercel project is not yet linked. Run 'pnpm exec vercel link' when ready."
fi

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
