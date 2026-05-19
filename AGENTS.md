# AGENTS.md - Harness SDD for AI agents

This file is the canonical contract for Codex, Claude Code, OpenCode, Cursor, and any
other coding agent that works in this repository. Tool-specific files must only point
back here; do not duplicate or fork the rules.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ
from your training data. Read the relevant guide in `node_modules/next/dist/docs/`
before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Start protocol

1. Read this file first.
2. Read `progress/current.md` to understand the active session.
3. Read `feature_list.json` to find the current feature state.
4. Run `./init.sh`. If it fails, stop and fix or document the blocker before coding.
5. Before editing Next.js code, read the relevant local guide under
   `node_modules/next/dist/docs/`.

Useful local guides:

- Project structure: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- Layouts and pages: `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- Server and Client Components: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- Testing: `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`
- Playwright: `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`

## Repository map

| Path | Purpose | When to read |
| --- | --- | --- |
| `.agents/subagents/` | Canonical role contracts for leader, spec author, implementer, and reviewer | Before doing role-specific work |
| `feature_list.json` | Feature queue and lifecycle state | Always at start |
| `progress/current.md` | Live session notes and blockers | Always at start |
| `progress/history.md` | Append-only session history | When historical context matters |
| `specs/<feature>/` | SDD specs: requirements, design, tasks | Before implementing any SDD feature |
| `docs/architecture.md` | What good architecture means here | Before implementation |
| `docs/conventions.md` | Coding and repo conventions | Before implementation |
| `docs/specs.md` | SDD process and EARS requirements | Before writing or reviewing specs |
| `docs/verification.md` | How to prove the work works | Before marking anything done |
| `CHECKPOINTS.md` | Objective final-state checklist | Before closing a session |
| `tests/integration/` | Vitest integration tests — logic, data flow, API helpers | After implementing any feature task |
| `tests/e2e/` | Playwright E2E tests — user flows in a real browser | Only when human approves E2E gate |

## Hard rules

- One feature at a time. Do not mix unrelated product changes in one session.
- Use the role contract in `.agents/subagents/` that matches the work you are doing.
- The leader orchestrates; the spec author writes specs; the implementer writes product
  changes; the reviewer verifies and rejects or accepts.
- Do not implement a feature with `"sdd": true` while it is `pending`.
- Do not skip the human approval gate between `spec_ready` and `in_progress`.
- Do not mark work `done` without passing `./init.sh`.
- Do not mark work `done` with any failing test (`pnpm test` must be fully green).
- Write progress to `progress/current.md`; durable state lives in files, not only chat.
- Every requirement `R<n>` must map to at least one concrete test or verification step.
- Prefer existing project patterns and local Next.js docs over memory or assumptions.

## SDD workflow

```text
pending -> spec_author -> spec_ready -> HUMAN APPROVAL -> leader marks in_progress -> implementer -> reviewer -> done
```

1. The leader selects exactly one feature and delegates based on `feature_list.json`.
2. For a `pending` feature with `"sdd": true`, the spec author creates
   `specs/<feature>/{requirements.md,design.md,tasks.md}` and mark it `spec_ready`.
3. Stop. The human reviews the spec and approves or requests changes.
4. After approval, the leader marks the feature `in_progress`.
5. The implementer changes only what the approved spec requires, updates `tasks.md`,
   and writes `progress/impl_<feature>.md`.
6. The reviewer runs verification, checks `CHECKPOINTS.md` C1-C6, writes
   `progress/review_<feature>.md`, and rejects if any required box remains `[ ]`.
7. Only after reviewer acceptance may the leader mark the feature `done` and append
   the final summary to `progress/history.md`.

## Subagent roles

- `leader`: reads all handoffs, controls feature state, and delegates. It must not
  write product code.
- `spec_author`: writes requirements, design, and tasks. It must not edit product
  code.
- `implementer`: implements one approved feature. It must not mark features `done`.
- `reviewer`: verifies work, marks checkpoint results, and rejects incomplete work.
  It must not edit implementation code.

Canonical role definitions live in `.agents/subagents/`. Claude-compatible shims live
in `.claude/agents/` and must point back to the canonical definitions.

## Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Lint: `pnpm lint`
- Run integration tests: `pnpm test`
- Run integration tests in watch mode: `pnpm test:watch`
- Run E2E tests (requires human approval gate): `pnpm test:e2e`
- Production build: `pnpm build`
- Quick harness check: `./init.sh --quick`
- Full harness check: `./init.sh`

## Harness hooks & Manual Quality Control

Automated project hooks are configured in `.claude/settings.json`, `.cursor/hooks.json`, and `.codex/hooks.json`. They call the initialization scripts directly:

- `./init.sh --quick` runs after edit/write tools.
- `./init.sh` runs before the turn closes.

Agents must not weaken, bypass, or replace these hook commands. 

**For agents without automated hook support (e.g., OpenCode, Antigravity, unconfigured apps):**
If the agent cannot run automated hooks in the background, it MUST explicitly pause after implementing any task and ask the human to manually run a quality control check. The human must execute either `./init.sh --quick` (minimum mandatory) or the full `./init.sh`. The agent must wait for the human to confirm the command passed (`[OK]`) before proceeding or marking the task as `done`.

## Agent compatibility

- Codex and most tools should read this `AGENTS.md` directly.
- Claude Code reads `CLAUDE.md`, which imports this file.
- OpenCode reads `opencode.json`, which points to this file.
- Cursor reads `.cursor/rules/harness.mdc`, which points to this file.

If a tool-specific file disagrees with `AGENTS.md`, this file wins.
