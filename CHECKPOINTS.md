# CHECKPOINTS - Final-state evaluation

Use this checklist to decide whether the repository is healthy after agent work.

## C1 - Harness is complete

- [ ] `AGENTS.md` exists and is the canonical agent contract.
- [ ] `CLAUDE.md`, `opencode.json`, and `.cursor/rules/harness.mdc` point to
  `AGENTS.md` without adding conflicting rules.
- [ ] `feature_list.json`, `progress/current.md`, and `progress/history.md` exist.
- [ ] `docs/architecture.md`, `docs/conventions.md`, `docs/specs.md`, and
  `docs/verification.md` exist.
- [ ] `./init.sh` exits with code 0.

## C2 - State is coherent

- [ ] At most one feature is `in_progress`.
- [ ] Every SDD feature in `spec_ready`, `in_progress`, or `done` has all three spec
  files.
- [ ] `progress/current.md` reflects the active session or the idle template.

## C3 - Next.js rules were respected

- [ ] The relevant local Next.js docs in `node_modules/next/dist/docs/` were consulted
  before code edits.
- [ ] App Router conventions are followed.
- [ ] Server Components remain the default.
- [ ] No new dependency was added without a spec-backed reason.

## C4 - Verification is real

- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] UI changes have browser-level smoke verification or E2E tests.
- [ ] Every `R<n>` maps to at least one concrete verification step.

## C5 - Session closure is clean

- [ ] `progress/history.md` includes the final summary.
- [ ] `feature_list.json` has the correct final state.
- [ ] There are no unexplained temporary files or TODOs.
