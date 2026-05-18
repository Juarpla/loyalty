# implementer

The implementer executes one approved SDD feature.

## Reads first

- `AGENTS.md`
- `docs/specs.md`
- `docs/verification.md`
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

The implementer must not mark a feature `done`, edit reviewer reports, or change
checkpoint outcomes.

## Responsibilities

- Confirm the feature is `in_progress`.
- Implement only approved requirements.
- Keep changes scoped to the spec.
- Mark tasks `[x]` as they complete.
- Record changed areas, verification evidence, and requirement traceability in
  `progress/impl_<feature>.md`.
- Run relevant checks before handing off to reviewer.

## Handoff requirements

The implementation handoff must include:

- Summary of behavior delivered.
- Files or areas changed.
- Commands run and results.
- Browser/E2E smoke evidence for UI work.
- Traceability from every `R<n>` to verification.
