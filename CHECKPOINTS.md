# CHECKPOINTS - Final-state evaluation

Use this checklist to decide whether the repository is healthy after agent work.

The reviewer must inspect C1-C6 and mark every checkbox as `[x]` or `[ ]`. Closure is
rejected if any required box in C1-C6 remains `[ ]`, if a box is left uninspected, or
if the review report does not explain the result.

## C1 - Harness is complete

- [x] `AGENTS.md` exists and is the canonical agent contract.
- [x] `CLAUDE.md`, `opencode.json`, and `.cursor/rules/harness.mdc` point to
  `AGENTS.md` without adding conflicting rules.
- [x] `feature_list.json`, `progress/current.md`, and `progress/history.md` exist.
- [x] `docs/architecture.md`, `docs/conventions.md`, `docs/specs.md`, and
  `docs/verification.md` exist.
- [x] `./init.sh` exits with code 0.

## C2 - State is coherent

- [x] At most one active feature exists in the entire system.
- [x] Every SDD feature in `spec_ready`, `in_progress`, `in_review`, or `done` has all three spec
  files.
- [x] Every `blocked` feature is documented in `progress/current.md`.
- [x] `progress/current.md` reflects the active session or the idle template.

## C3 - Next.js rules were respected

- [x] The relevant local Next.js docs in `node_modules/next/dist/docs/` were consulted
  before code edits.
- [x] App Router conventions are followed.
- [x] Server Components remain the default.
- [x] No new dependency was added without a spec-backed reason.

## C4 - Verification is real

- [x] `pnpm lint` passes.
- [x] `pnpm test` (Vitest integration tests) passes with > 0 tests and all green.
- [x] `pnpm build` passes.
- [x] Every `R<n>` maps to at least one concrete integration test in `tests/integration/`.
- [x] No tests are skipped (`.skip`) or disabled without documented justification in `progress/impl_<feature>.md`.
- [x] For broad cross-layer changes: the human was asked about E2E tests and the decision is documented in `progress/impl_<feature>.md`.
- [x] WHERE E2E was requested: pnpm test:e2e passed.

## C5 - Session closure is clean

- [x] `progress/history.md` includes the final summary. (Pending — only appended after leader marks `done`.)
- [x] `feature_list.json` has the correct final state for the reviewed feature. (`done`)
- [x] There are no unexplained temporary files or TODOs.

## C6 - Spec Driven Development

- [x] The active role followed the matching contract in `.agents/subagents/`.
- [x] `pending` SDD work was handled by `spec_author` before implementation.
- [x] Human approval happened before `spec_ready` moved to `in_progress`.
- [x] The implementer updated `tasks.md` and wrote `progress/impl_<feature>.md`.
- [x] The reviewer wrote `progress/review_<feature>.md` with accept/reject status.
- [x] Every `R<n>` maps to at least one concrete verification step.
- [x] Reviewer rejected closure if any C1-C6 checkbox was `[ ]`.
