# Tasks: hook_cashier_rewards

Feature ID: 61
Feature name: hook_cashier_rewards
Title: Cashier Rewards State React Hook

## Checklist

- [x] T1 — Create `src/hooks/use-rewards.hook.ts` with `"use client"` directive, `UseRewardsResult` interface, and `useRewards()` function exporting all state fields and callbacks. Covers: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10.

- [x] T2 — Implement `checkMilestone(clientId: string)` inside `useRewards`: validate clientId, set loading, POST to `/api/v1/rewards/claim`, map `success: true` → `isMilestoneReached = true` + `modalVisible = true`, map 400 → `isMilestoneReached = false`, catch network errors → `error` field. Covers: R1, R2, R3, R4, R5.

- [x] T3 — Implement `claimReward(clientId: string)` inside `useRewards`: set loading, POST to `/api/v1/rewards/claim`, on success reset `modalVisible` and `isMilestoneReached` and set `successMessage`, on failure set `error`. Covers: R6, R7, R8.

- [x] T4 — Implement `dismissModal()` inside `useRewards`: set `modalVisible = false` without network calls. Covers: R9.

- [x] T5 — Export stable `UseRewardsResult` TypeScript interface at module level with all declared types. Covers: R10.

- [x] T6 — Create `tests/integration/hook_cashier_rewards.integration.test.ts` with `renderHook` and mocked `fetch`, covering: loading toggle (R2), milestone-reached state (R3), milestone-not-reached state (R4), check network error (R5), claim success (R7), claim failure (R8), dismiss modal (R9). Covers: R11.
