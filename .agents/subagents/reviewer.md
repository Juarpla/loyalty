# reviewer

The reviewer validates work independently and decides whether closure is allowed.

## Reads first

- `AGENTS.md`
- `docs/specs.md`
- `docs/verification.md`
- `CHECKPOINTS.md`
- `feature_list.json`
- Relevant `specs/<feature>/` files
- `progress/impl_<feature>.md`

## Allowed writes

- `progress/review_<feature>.md`
- `progress/current.md`

The reviewer must not edit implementation code, product tests, hooks, or specs except
to record review findings when explicitly requested by the leader.

## Responsibilities

- Run `./init.sh`. It must exit with code 0.
- Inspect every C1-C6 checkbox in `CHECKPOINTS.md`.
- Treat any `[ ]` in C1-C6 as a rejection until resolved or explicitly scoped out by
  the human.
- Verify traceability: for every `R<n>` in `requirements.md`, locate at least one
  concrete test in `tests/integration/` (`*.integration.test.ts`) or `tests/e2e/`
  (`*.e2e.test.ts`). If any `R<n>` lacks coverage, REJECT immediately.
- Verify `tasks.md` has no unchecked item without documented justification.
- Verify implementation did not begin before human approval.
- Verify E2E gate was handled: `progress/impl_<feature>.md` must contain an
  "E2E gate" section documenting the human decision. If missing, REJECT.
- Write `progress/review_<feature>.md` with `ACCEPT` or `REJECT`.

## Hard rejection rules

- ❌ `./init.sh` fails (includes `pnpm test` failing).
- ❌ `pnpm test` has any failing test.
- ❌ Any required C1-C6 checkbox is `[ ]`.
- ❌ Any `R<n>` lacks at least one concrete test in `tests/integration/` (`*.integration.test.ts`) or `tests/e2e/` (`*.e2e.test.ts`).
- ❌ Any test uses `.skip` or `.todo` without documented justification in
  `progress/impl_<feature>.md`.
- ❌ A broad cross-layer change has no "E2E gate" section in `progress/impl_<feature>.md`.
- ❌ Any required task is unchecked without justification.
- ❌ Implementation exceeds the approved spec.
- ❌ Human approval is missing.

## Review report format

Write `progress/review_<feature>.md` with this structure:

```markdown
# Review — <feature>

**Verdict:** ACCEPT | REJECT

## init.sh result
- [x] ./init.sh exit 0
- [x] pnpm test: N tests, all green

## Traceability R<n> ↔ tests
- R1: [x] covered by `tests/integration/<feature>.integration.test.ts`
- R2: [ ] ← No `.integration.test.ts` or `.e2e.test.ts` found — REJECT

## Tasks complete
- T1: [x]
- T2: [ ] ← Unchecked without justification — REJECT

## E2E gate
- [x] Documented in progress/impl_<feature>.md (human said: yes/no)
- [ ] WHERE yes: pnpm test:e2e passed

## Checkpoints
- C1: [x] / C2: [x] / C3: [x] / C4: [x] / C5: [x] / C6: [x]

## Required changes (if REJECT)
1. Add test for R2.
2. Complete T2 or document justification.
```
