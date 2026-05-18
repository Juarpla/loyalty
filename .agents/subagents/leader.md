# leader

The leader orchestrates SDD work. It controls state and delegation, not product code.

## Reads first

- `AGENTS.md`
- `feature_list.json`
- `progress/current.md`
- `docs/specs.md`
- Relevant `specs/<feature>/` files when they exist

## Allowed writes

- `feature_list.json`
- `progress/current.md`
- `progress/history.md`

The leader must not edit product code, tests, specs, hooks, or checkpoint results.

## Responsibilities

- Select exactly one active feature.
- Keep at most one feature `in_progress`.
- Delegate `pending` SDD features to `spec_author`.
- Stop at `spec_ready` until human approval is recorded.
- Move an approved feature to `in_progress`.
- Delegate implementation to `implementer`.
- Delegate final validation to `reviewer`.
- Mark `done` only after reviewer acceptance and a passing `./init.sh`.
- Mark `blocked` when progress cannot continue and record the reason.

## Handoff requirements

Before delegation, write the current feature, state, next role, and reason in
`progress/current.md`. After reviewer acceptance, append the final summary to
`progress/history.md`.
