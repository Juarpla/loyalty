# Design: hook_cashier_rewards

Feature ID: 61
Feature name: hook_cashier_rewards
Title: Cashier Rewards State React Hook

---

## Summary

This document describes the implementation design for `src/hooks/use-rewards.hook.ts`. The hook provides the React state layer that bridges the cashier dashboard page with the `/api/v1/rewards/claim` POST endpoint. It follows the same pattern used by `use-arrivals.hook.ts` and `use-cashier-sales.hook.ts`.

---

## Files Expected to Change

| File | Action | Purpose |
| :--- | :--- | :--- |
| `src/hooks/use-rewards.hook.ts` | **CREATE** | The new hook implementing all R1–R10 requirements |
| `tests/integration/hook_cashier_rewards.integration.test.ts` | **CREATE** | Integration test file covering R2–R9 and R11 |

No backend files change. The controller, service, model, API route, and types from Features 58–60 remain untouched.

---

## Public Interface

```typescript
export interface UseRewardsResult {
  isMilestoneReached: boolean;
  modalVisible: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  checkMilestone: (clientId: string) => Promise<void>;
  claimReward: (clientId: string) => Promise<void>;
  dismissModal: () => void;
}

export function useRewards(): UseRewardsResult
```

---

## State Fields

| Field | Type | Initial Value | Description |
| :--- | :--- | :--- | :--- |
| `isMilestoneReached` | `boolean` | `false` | True when the API confirms the client has hit 10 visits |
| `modalVisible` | `boolean` | `false` | Controls whether the milestone modal is shown |
| `loading` | `boolean` | `false` | True while any network operation is in flight |
| `error` | `string \| null` | `null` | Error message from last failed request |
| `successMessage` | `string \| null` | `null` | Confirmation string after a successful claim |

---

## Data Flow

### `checkMilestone(clientId)`

1. Validate `clientId` is a non-empty string. If invalid, set `error` and return early.
2. Set `loading = true`, clear `error` and `successMessage`.
3. POST to `/api/v1/rewards/claim` with `{ clientId }`.
   - The claim endpoint evaluates the milestone internally via `MilestoneService.evaluateMilestone`. If `isMilestone` is false it returns `{ success: false, status: 400 }`.
   - **Important design note**: The claim endpoint performs the full check-and-claim atomically. For a pure read-only check we are using the same endpoint in a "pre-check" role. If `isMilestone` is false, we treat that as "milestone not reached" without claiming. If `isMilestone` is true, the endpoint will have already claimed (reset the counter). Therefore, `checkMilestone` and `claimReward` are in practice the same operation from an API perspective. The hook separates them semantically for UI clarity: `checkMilestone` is called to show the modal; `claimReward` is called when the cashier explicitly confirms the reward, which will call the endpoint again after reset.
   - **Alternative considered**: Adding a dedicated `GET /api/v1/rewards/milestone?clientId=X` endpoint. Rejected for this feature because it requires backend changes outside scope. The hook can call `claimReward` directly instead of a two-step check. Revisit if UX requires a separate non-destructive check.
4. On `success: true`: set `isMilestoneReached = true`, `modalVisible = true`.
5. On `success: false` with 400: set `isMilestoneReached = false`, `modalVisible = false`.
6. On network/unexpected error: set `error`, leave `modalVisible` unchanged.
7. Set `loading = false` in all paths.

### `claimReward(clientId)`

1. Set `loading = true`, clear `error`.
2. POST to `/api/v1/rewards/claim` with `{ clientId }`.
3. On `success: true`: set `modalVisible = false`, `isMilestoneReached = false`, `successMessage = "Reward claimed successfully"`.
4. On failure: set `error`, leave `modalVisible` unchanged.
5. Set `loading = false` in all paths.

### `dismissModal()`

1. Set `modalVisible = false`. No network call.

---

## Error Handling

- Network errors (fetch throws): catch, set `error` field with the error message.
- API 400 (milestone not reached in `checkMilestone`): treat as non-error state; set `isMilestoneReached = false`.
- API 500 or unexpected status: set `error` field.
- All error states leave `loading = false`.

---

## Integration Test Strategy

Tests use `vi.stubGlobal('fetch', ...)` to mock the global `fetch` and `@testing-library/react` `renderHook` to exercise the hook's state transitions.

Test cases map to requirements:
- R2: loading toggle on `checkMilestone`.
- R3: `isMilestoneReached = true`, `modalVisible = true` when server returns `{ success: true }`.
- R4: `isMilestoneReached = false`, `modalVisible = false` when server returns `{ success: false, status: 400 }`.
- R5: `error` set when `fetch` throws.
- R7: after `claimReward` success, `modalVisible = false`, `isMilestoneReached = false`, `successMessage` is set.
- R8: `error` set when `claimReward` returns non-success.
- R9: `modalVisible = false` after `dismissModal()`.

---

## Next.js Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — confirms `"use client"` is required for hooks using `useState` and `useCallback`.

---

## Naming and File Conventions

Follows `docs/conventions.md`:
- File: `use-rewards.hook.ts` (lowercase, `use-[name].hook.ts` pattern).
- Exported function: `useRewards` (camelCase React hook convention).
- Exported interface: `UseRewardsResult` (PascalCase).
- `"use client"` directive at top of file (client-side state hook).
