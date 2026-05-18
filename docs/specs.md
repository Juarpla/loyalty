# Spec Driven Development

This repository uses SDD for feature work that has `"sdd": true` in
`feature_list.json`. Code is not written until a human approves the spec.

## Feature states

| State | Meaning |
| --- | --- |
| `pending` | No approved spec exists yet. |
| `spec_ready` | The three spec files exist and await human approval. No code edits. |
| `in_progress` | Human approved the spec and implementation may proceed. |
| `done` | Implementation, verification, and review are complete. |
| `blocked` | Work is stopped; reason must be documented in `progress/current.md`. |

## Required spec files

Each SDD feature uses this directory:

```text
specs/<feature-name>/
  requirements.md
  design.md
  tasks.md
```

The `<feature-name>` must match the `name` field in `feature_list.json`.

## requirements.md

Use EARS-style requirements. Each requirement has a stable id: `R1`, `R2`, and so
on. Each requirement must be concrete and verifiable.

Allowed patterns:

- Ubiquitous: `The system MUST <behavior>.`
- Event-driven: `WHEN <event>, the system MUST <behavior>.`
- State-driven: `WHILE <state>, the system MUST <behavior>.`
- Optional: `WHERE <condition>, the system MUST <behavior>.`
- Unwanted behavior: `IF <problem>, THEN the system MUST <response>.`

Rules:

- Use one `MUST` per requirement.
- Avoid soft verbs such as "could", "may", or "should".
- Map every requirement to at least one test or verification step.

## design.md

Capture implementation decisions before code changes:

- Files or areas expected to change.
- Public interfaces, routes, components, props, schemas, or commands.
- Data flow and error handling.
- Next.js docs consulted under `node_modules/next/dist/docs/`.
- At least one rejected alternative when there is a meaningful tradeoff.

## tasks.md

Use an executable checklist. Every task references covered requirements.

```markdown
- [ ] T1 - Add route-local UI for the loyalty dashboard. Covers: R1, R2.
- [ ] T2 - Add smoke verification for the dashboard. Covers: R1.
```

The implementer marks tasks `[x]` as they complete. The reviewer rejects the work if
unchecked tasks remain without a documented reason.
