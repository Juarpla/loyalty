# Spec Driven Development

This repository uses SDD for feature work that has `"sdd": true` in
`feature_list.json`. Code is not written until a human approves the spec.

## Feature states

| State | Meaning |
| --- | --- |
| `pending` | No approved spec exists yet. |
| `spec_author` | A leader has claimed the feature for spec drafting. Other agents must skip it. |
| `spec_ready` | The three spec files exist and await human approval. No code edits. |
| `in_progress` | Human approved the spec and implementation may proceed. |
| `in_review` | Implementation handoff is complete and a reviewer owns verification. |
| `done` | Implementation, verification, and review are complete. |
| `blocked` | Work is stopped; reason must be documented in `progress/current.md`. |

Blocked dependency rule: if a feature cannot safely be specified because another
feature must be completed first, the spec author reports the blocker and reason to
the leader. Only the leader marks the feature `blocked`.

## Subagent flow

The SDD process uses four roles. A single human or AI tool may perform multiple roles
only when it explicitly follows the active role contract from `.agents/subagents/`.

```text
leader claims -> spec_author -> human approval -> leader -> implementer -> reviewer -> leader
```

| Role | Allowed write scope | Required handoff |
| --- | --- | --- |
| `leader` | `feature_list.json`, `progress/current.md`, `progress/history.md` | Current state, chosen feature, delegation reason |
| `spec_author` | `specs/<feature>/requirements.md`, `design.md`, `tasks.md`, plus progress notes | Complete spec and recommended transition |
| `implementer` | Files named by the approved spec, `tasks.md`, `progress/impl_<feature>.md` | Implementation summary, task status, verification evidence |
| `reviewer` | `progress/review_<feature>.md`, checkpoint marks or review notes | Accept/reject decision with concrete reasons |

Role rules:

- The leader does not write product code.
- Only the leader edits `feature_list.json`.
- The spec author does not implement product code.
- The implementer does not mark a feature `done`.
- The reviewer does not edit implementation code.
- If a role needs to exceed its write scope, it must stop and document why.

## Required spec files

Each SDD feature uses this directory:

```text
specs/<feature-name>/
  requirements.md
  design.md
  tasks.md
```

The `<feature-name>` must match the `name` field in `feature_list.json`.

## leader

The leader is responsible for flow control:

- Read `feature_list.json`, `progress/current.md`, and relevant specs.
- Select exactly one feature for the current session and claim it before delegation.
- Enforce a single active feature globally; do not allow more than one active feature at any given time.
- When the human asks for the next feature, choose the first `blocked` feature; if
  none exists, choose the first `pending` feature; skip every other status
  immediately without further analysis.
- Claim selected `blocked` or `pending` SDD features as `spec_author`, then delegate
  them to the spec author.
- Move spec-author-complete handoffs to `spec_ready`.
- Move human-requested spec changes back to `spec_author`.
- Wait for human approval before moving `spec_ready` to `in_progress`.
- Delegate approved `in_progress` features to `implementer`.
- Move completed implementation handoffs to `in_review`, then delegate to `reviewer`.
- Move rejected review handoffs back to `in_progress`, then delegate to `implementer`.
- Mark `done` only after reviewer acceptance and `./init.sh` success.

## spec_author

The spec author creates decision-complete SDD artifacts:

- Write EARS requirements in `requirements.md`.
- Write implementation design, public interfaces, data flow, error handling, and
  Next.js local docs consulted in `design.md`.
- Write executable tasks in `tasks.md`, with every task mapped to requirements.
- Recommend `spec_ready`, then stop for leader transition and human approval.

The spec author must not edit application code, tests, configuration, or hooks.

## implementer

The implementer executes only an approved spec:

- Confirm the feature is `in_progress`.
- Read all three spec files before editing.
- Implement only the files and behavior required by the spec.
- Mark completed tasks `[x]` in `tasks.md`.
- Write `progress/impl_<feature>.md` with summary, changed areas, verification, and
  requirement traceability.
- Recommend `in_review` when the implementation handoff is ready.
- Run relevant checks, but leave final acceptance to the reviewer.

The implementer must not edit `feature_list.json`.

## reviewer

The reviewer validates the work independently:

- Read the approved spec, implementation handoff, changed files, and `CHECKPOINTS.md`.
- Confirm the feature is `in_review`, then run `./init.sh`.
- Inspect C1-C6 in `CHECKPOINTS.md`; every checkbox must be explicitly `[x]` or `[ ]`.
- Reject if any required C1-C6 checkbox is `[ ]`.
- Reject if any `R<n>` lacks concrete verification.
- Reject if any `tasks.md` item remains `[ ]` without documented justification.
- Reject if implementation started before human approval.
- Write `progress/review_<feature>.md` with the accept/reject decision.

The reviewer must not edit implementation code. If a fix is required, reject and hand
back to the leader.

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
