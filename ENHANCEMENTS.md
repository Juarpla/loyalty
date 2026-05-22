# Harness Enhancement Notes

Use this file to preserve lessons that can improve the agent harness over time.
Keep operational session state in `progress/current.md`; keep durable harness
improvement ideas here.

Statuses:

- `URGENT`: High-risk issue causing collisions, repeated failures, lost work, or long-lived blockers.
- `MEDIO`: Meaningful improvement for reliability, performance, clarity, or agent coordination.
- `LOW`: Nice-to-have cleanup or future refinement.

Outcomes:

- `IMPLEMENTED`: The improvement has already been applied to the harness.
- `DISMISS`: The idea was considered and intentionally rejected.
- `OPEN`: The idea has not been implemented or dismissed yet.

When asked what can be improved, agents should surface `URGENT` `OPEN` notes first,
then summarize remaining `OPEN` notes by priority. `IMPLEMENTED` and `DISMISS`
notes are historical context unless directly relevant.

## Parallel Feature Selection (22-MAY-2026 20:35:00) [URGENT] - IMPLEMENTED
- When the human asks for the next feature, the leader selects the first `blocked` feature; otherwise the first `pending` feature.
- `blocked` features are claimed directly as `spec_author` to avoid race conditions with another session.
- Features in `spec_author`, `spec_ready`, `in_progress`, `in_review`, or `done` are skipped by next-feature selection.

## Dependency Blocking Scope (22-MAY-2026 20:35:00) [URGENT] - IMPLEMENTED
- Dependency blocking should happen only during `spec_author`, while writing `requirements.md`, `design.md`, and `tasks.md`.
- Once a spec is human-approved and the feature is `in_progress`, the implementer should execute the approved spec rather than rediscover feature ordering.
- If implementation exposes a missing prerequisite, that indicates the spec was insufficient and should be handled through rejection or spec revision, not ad hoc blocking.

## Enhancement Notes Location (22-MAY-2026 20:35:00) [MEDIO] - IMPLEMENTED
- Harness improvement notes should not live in `progress/current.md` because that file represents active operational state.
- Long-lived lessons, performance ideas, repeated failures, role duplication concerns, and unresolved blocker patterns belong in root-level `ENHANCEMENTS.md`.

## Leader-Owned Status Transitions (22-MAY-2026 08:45:00) [URGENT] - IMPLEMENTED
- Only the leader edits `feature_list.json` and performs feature status transitions.
- Spec author, implementer, and reviewer report recommended transitions through handoffs instead of changing status directly.
- Human-requested spec changes return through the leader to `spec_author`; reviewer rejection returns through the leader to `in_progress` and then `implementer`.

## Strict Next-Feature Skipping (22-MAY-2026 09:10:00) [URGENT] - IMPLEMENTED
- The leader is the role responsible for next-feature selection.
- During next-feature selection, only `blocked` and `pending` are selectable.
- Features in any other status are skipped immediately without extra reasoning, because provider/session drift can otherwise cause agents to re-enter work owned by another session.
- `progress/current.md` is context only and must not pull the leader into summarizing, approving, implementing, reviewing, or inspecting a skipped feature during next-feature selection.
