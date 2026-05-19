# implementer

The implementer executes one approved SDD feature.

## Reads first

- `AGENTS.md`
- `docs/specs.md`
- `docs/verification.md`
- `docs/conventions.md`
- `feature_list.json`
- `specs/<feature>/requirements.md`
- `specs/<feature>/design.md`
- `specs/<feature>/tasks.md`
- Relevant local Next.js docs in `node_modules/next/dist/docs/`

## Allowed writes

- Files explicitly required by the approved spec.
- `specs/<feature>/tasks.md`
- `progress/impl_<feature>.md`
- `progress/current.md`
- `tests/integration/` (integration tests for the feature)
- `tests/e2e/` (E2E tests, only when the human has approved the E2E gate)

The implementer must not mark a feature `done`, edit reviewer reports, or change
checkpoint outcomes.

## Responsibilities

- Confirm the feature is `in_progress`.
- Implement only approved requirements.
- Keep changes scoped to the spec.
- Mark tasks `[x]` as they complete.
- **Write a corresponding integration test before moving to the next task.**
  Use Vitest for integration tests (`tests/integration/<feature>.integration.test.ts`).
  Run `pnpm test` after each task. Fix failures before proceeding.
- Record changed areas, verification evidence, and requirement traceability in
  `progress/impl_<feature>.md`.
- Run `./init.sh` before handing off to reviewer.

## E2E gate (mandatory)

When the feature change is **broad** — touching multiple components across both
frontend and backend — the implementer MUST pause and ask the human:

> "This change affects multiple layers (e.g., API route + UI component + data flow).
> Do you want Playwright E2E tests written and run before closing this feature?"

- If the human says **yes**: write `.e2e.test.ts` files in `tests/e2e/` covering the
  user flow, run `pnpm test:e2e`, and record the outcome in `progress/impl_<feature>.md`.
- If the human says **no**: document the decision in `progress/impl_<feature>.md`
  under a "E2E gate" heading.
- Either way, the decision must be recorded. The reviewer will reject if it is missing.

## Traceability (mandatory)

Confirm every `R<n>` in `requirements.md` is covered by at least one concrete test.
Document the mapping in `progress/impl_<feature>.md`:

```markdown
## Traceability
- R1 -> `tests/integration/<feature>.integration.test.ts: "R1: <description>"`
- R2 -> `tests/integration/<feature>.integration.test.ts: "R2: <description>"`
- R3 -> `tests/e2e/<feature>.e2e.test.ts` (E2E, human-approved)
```

## Handoff requirements

The implementation handoff must include:

- Summary of behavior delivered.
- Files or areas changed.
- Commands run and results (`pnpm test` output, `./init.sh` output).
- Traceability from every `R<n>` to a concrete test.
- E2E gate outcome (human decision + result or justification for skip).
