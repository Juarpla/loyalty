# Requirements: hook_cashier_rewards

Feature ID: 61
Feature name: hook_cashier_rewards
Title: Cashier Rewards State React Hook
History: F4 - Story 4.3: 10th visit reward visual alert

## Context

The `MilestoneService` and `MilestoneController` are already implemented (Feature 58, 59, 60). The `/api/v1/rewards/claim` POST endpoint is live. This hook provides the frontend state layer that the cashier dashboard page will use to:

1. Check whether the current client has reached the 10-visit milestone via the existing API.
2. Expose a modal-visible flag so the milestone modal component can be conditionally rendered.
3. Allow the cashier to trigger reward claim and reset the milestone state.

---

## Requirements

**R1** — WHEN the hook is initialized with a non-empty `clientId`, the system MUST call `/api/v1/rewards/claim` with a GET-equivalent check by calling `MilestoneService` indirectly through the dedicated milestone check endpoint (or a separate dedicated milestone check endpoint if one exists); however, since no dedicated GET milestone endpoint exists, the hook MUST expose a `checkMilestone(clientId: string)` callback that the consumer calls explicitly rather than auto-fetching on mount.

> **Design note on R1**: There is no dedicated read-only GET endpoint for milestone evaluation — only the POST claim endpoint. Therefore, the hook must not auto-fetch on mount. Instead it exposes an explicit `checkMilestone` callback to avoid side-effect ambiguity.

**R2** — WHEN `checkMilestone(clientId)` is called with a valid non-empty string `clientId`, the system MUST set `loading` to `true` while the request is in flight and set it back to `false` when the request settles (success or error).

**R3** — WHEN the `/api/v1/rewards/claim` endpoint responds with `success: true`, the system MUST set `isMilestoneReached` to `true` and set `modalVisible` to `true`.

**R4** — WHEN the `/api/v1/rewards/claim` endpoint responds with `success: false` and a 400 status (milestone not reached), the system MUST set `isMilestoneReached` to `false` and leave `modalVisible` as `false`.

**R5** — IF a network or unexpected error occurs during `checkMilestone`, THEN the system MUST capture the error message in the `error` state field, set `loading` to `false`, and leave `modalVisible` unchanged.

**R6** — WHEN `claimReward(clientId: string)` is called, the system MUST POST to `/api/v1/rewards/claim` with `{ clientId }` in the request body, set `loading` to `true` while the request is in flight, and set it back to `false` when the request settles.

**R7** — WHEN `claimReward` completes with `success: true`, the system MUST set `modalVisible` to `false`, set `isMilestoneReached` to `false`, and set `successMessage` to a non-empty confirmation string.

**R8** — IF `claimReward` receives a non-2xx response or a network failure, THEN the system MUST set an `error` message and leave `modalVisible` unchanged.

**R9** — WHEN `dismissModal()` is called, the system MUST set `modalVisible` to `false` without making any network requests.

**R10** — The system MUST export a stable `UseRewardsResult` TypeScript interface that declares all state fields (`isMilestoneReached`, `modalVisible`, `loading`, `error`, `successMessage`) and all callbacks (`checkMilestone`, `claimReward`, `dismissModal`) with their precise types.

**R11** — Integration tests in `tests/integration/hook_cashier_rewards.test.ts` MUST assert:
- R2: loading toggles true → false on `checkMilestone` resolution.
- R3: `isMilestoneReached` and `modalVisible` become `true` on milestone-reached response.
- R4: `isMilestoneReached` stays `false` and `modalVisible` stays `false` on milestone-not-reached response.
- R5: `error` is populated on network failure in `checkMilestone`.
- R7: `modalVisible` and `isMilestoneReached` reset, `successMessage` is set after successful `claimReward`.
- R8: `error` is populated on claim failure.
- R9: `modalVisible` becomes `false` after `dismissModal()`.
