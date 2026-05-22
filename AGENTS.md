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
| `ENHANCEMENTS.md` | Durable harness improvement notes | When asked what can improve or when a recurring harness issue is found |
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

- One feature per agent session. Multiple agents may work in parallel only when each
  session has claimed a different feature in `feature_list.json`.
- Use the role contract in `.agents/subagents/` that matches the work you are doing.
- The leader orchestrates; the spec author writes specs; the implementer writes product
  changes; the reviewer verifies and rejects or accepts.
- Only the leader may edit `feature_list.json`. Other roles recommend status
  transitions in handoffs; they do not change feature status directly.
- Next-feature selection is the leader's responsibility. Selection is a
  status-only scan: choose the first `blocked` feature, otherwise the first
  `pending` feature. Any feature in `spec_author`, `spec_ready`, `in_progress`,
  `in_review`, or `done` is already owned by another workflow step/session and
  must be skipped immediately without reading its specs, handoffs, blockers,
  acceptance criteria, or implementation details.
- Do not work on a `pending` feature until the leader claims it by setting its status
  to `spec_author`.
- If a feature depends on unfinished work, mark only that feature `blocked`, record
  the reason in `progress/current.md`, and select the next `blocked` or `pending`
  feature.
- Do not implement a feature with `"sdd": true` while it is `pending`, `spec_author`,
  or `spec_ready`.
- Do not skip the human approval gate between `spec_ready` and `in_progress`.
- Do not mark work `done` without passing `./init.sh`.
- Do not mark work `done` with any failing test (`pnpm test` must be fully green).
- Write progress to `progress/current.md`; durable state lives in files, not only chat.
- Save recurring harness learnings in `ENHANCEMENTS.md`, not
  in `progress/current.md`.
- Every requirement `R<n>` must map to at least one concrete test or verification step.
- Prefer existing project patterns and local Next.js docs over memory or assumptions.
- `feature_list.json` is **status-mutable only**. You may change only the `status` field of an
  existing feature. You must never add, delete, reorder features, or modify any field other
  than `status` on any feature entry. The `init.sh` snapshot validator will detect and block
  violations.

## SDD workflow

```text
pending/blocked -> leader marks spec_author -> spec_author handoff -> leader marks spec_ready -> HUMAN APPROVAL -> leader marks in_progress -> implementer handoff -> leader marks in_review -> reviewer handoff -> leader marks done
```

1. The leader selects exactly one unclaimed feature for the current session and
   immediately reserves it in `feature_list.json`.
2. When the human asks for the next feature, the leader scans `feature_list.json` in
   order and selects the first `blocked` feature. If none exists, it selects the first
   `pending` feature. It skips every other status immediately, without reasoning
   about that feature's specs, implementation, blockers, or progress.
   `progress/current.md` is context only; it does not override this scan and must
   not cause the leader to resume, summarize, approve, implement, or inspect a
   skipped feature unless the human explicitly names that feature.
3. For a selected `blocked` or `pending` SDD feature, the leader changes only that
   feature's `status` to `spec_author`, then delegates to the spec author.
4. The spec author creates
   `specs/<feature>/{requirements.md,design.md,tasks.md}` and recommends
   `spec_ready`.
5. The leader reads the spec author handoff and marks the feature `spec_ready`.
6. Stop. The human reviews the spec and approves or requests changes.
7. If the human requests changes, the leader marks the feature `spec_author` again
   and delegates back to the spec author.
8. After approval, the leader marks the feature `in_progress`.
9. The implementer changes only what the approved spec requires, updates `tasks.md`,
   and writes `progress/impl_<feature>.md`.
10. When implementation is ready for review, the implementer recommends `in_review`.
11. The leader reads the implementation handoff and marks the feature `in_review`.
12. The reviewer runs verification, checks `CHECKPOINTS.md` C1-C6, writes
   `progress/review_<feature>.md`, and reports ACCEPT or REJECT.
13. If reviewer reports REJECT, the leader marks the feature `in_progress` again and
   delegates back to the implementer with the reviewer findings.
14. Only after reviewer acceptance may the leader mark the feature `done` and append
   the final summary to `progress/history.md`.

Blocked rule: only the spec author decides that a selected feature cannot proceed
because another feature must be completed first. In that case, the spec author sets
no status directly; it reports the blocker and reason to the leader. The leader marks
the selected feature `blocked`. The next leader scan will try the first `blocked`
feature again before any `pending` feature.

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
