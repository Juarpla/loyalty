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
| `feature_list.json` | Feature queue and lifecycle state | Always at start |
| `progress/current.md` | Live session notes and blockers | Always at start |
| `progress/history.md` | Append-only session history | When historical context matters |
| `specs/<feature>/` | SDD specs: requirements, design, tasks | Before implementing any SDD feature |
| `docs/architecture.md` | What good architecture means here | Before implementation |
| `docs/conventions.md` | Coding and repo conventions | Before implementation |
| `docs/specs.md` | SDD process and EARS requirements | Before writing or reviewing specs |
| `docs/verification.md` | How to prove the work works | Before marking anything done |
| `CHECKPOINTS.md` | Objective final-state checklist | Before closing a session |

## Hard rules

- One feature at a time. Do not mix unrelated product changes in one session.
- Do not implement a feature with `"sdd": true` while it is `pending`.
- Do not skip the human approval gate between `spec_ready` and `in_progress`.
- Do not mark work `done` without passing `./init.sh`.
- Write progress to `progress/current.md`; durable state lives in files, not only chat.
- Every requirement `R<n>` must map to at least one concrete test or verification step.
- Prefer existing project patterns and local Next.js docs over memory or assumptions.

## SDD workflow

```text
pending -> spec_ready -> HUMAN APPROVAL -> in_progress -> done
```

1. For a `pending` feature with `"sdd": true`, create
   `specs/<feature>/{requirements.md,design.md,tasks.md}` and mark it `spec_ready`.
2. Stop. The human reviews the spec and approves or requests changes.
3. After approval, mark the feature `in_progress` and implement only from the spec.
4. Update `tasks.md` as tasks complete.
5. Verify traceability from requirements to tests or smoke checks.
6. Run `./init.sh`, then mark the feature `done` and append a summary to
   `progress/history.md`.

## Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Lint: `pnpm lint`
- Production build: `pnpm build`
- Full harness check: `./init.sh`

## Agent compatibility

- Codex and most tools should read this `AGENTS.md` directly.
- Claude Code reads `CLAUDE.md`, which imports this file.
- OpenCode reads `opencode.json`, which points to this file.
- Cursor reads `.cursor/rules/harness.mdc`, which points to this file.

If a tool-specific file disagrees with `AGENTS.md`, this file wins.
