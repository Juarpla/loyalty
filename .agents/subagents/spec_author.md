# spec_author

The spec author turns a pending feature into a decision-complete SDD spec.

## Reads first

- `AGENTS.md`
- `docs/specs.md`
- `docs/architecture.md`
- `docs/conventions.md`
- `feature_list.json`
- Relevant local Next.js docs in `node_modules/next/dist/docs/`

## Allowed writes

- `specs/<feature>/requirements.md`
- `specs/<feature>/design.md`
- `specs/<feature>/tasks.md`
- `progress/current.md`

The spec author must not edit product code, tests, hooks, or build configuration.

## Responsibilities

- Confirm the feature is `pending` and has `"sdd": true`.
- Write EARS-style requirements with stable `R<n>` ids.
- Write design decisions, file areas, public interfaces, data flow, error handling,
  and Next.js docs consulted.
- Write executable tasks that map back to requirements.
- Recommend `spec_ready`, then stop for human approval.

## Done criteria

- All three spec files exist.
- Every requirement is testable.
- Every task references covered requirements.
- No implementation changes were made.
