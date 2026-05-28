# Tasks - component_cashier_milestone_modal (Feature ID: 62)

- [x] **T1**: Create `src/components/cashier/milestone-modal.component.tsx` with `"use client"`, `CashierMilestoneModalProps` interface, and layout driven by props. Returns `null` if `visible` is `false`. Covers: R1, R2, R8.
- [x] **T2**: Implement the full-screen overlay backdrop structure and modal dialog card displaying `customerName`, `customerPhone`, `rewardDescription`, and `visitCount` with exact data-testid attributes. Covers: R3, R4.
- [x] **T3**: Add the "Claim Reward" and "Dismiss" buttons with their corresponding `onClick` event handlers, custom styles, and loading disabled states including spinner rendering. Covers: R5, R6, R7.
- [x] **T4**: Create a temporary test page at `src/app/test/milestone-modal/page.tsx` that hosts `CashierMilestoneModal` under a controlled state to allow Playwright E2E tests to run. Covers: R9.
- [x] **T5**: Create Playwright E2E test at `tests/e2e/component_cashier_milestone_modal.spec.ts` asserting modal visibility transitions, correct prop values rendering, button interaction callbacks, and disabled/loading states. Covers: R9.
- [x] **T6**: Run `./init.sh --quick` and `./init.sh` to confirm Playwright E2E tests pass, type-checking is complete, and linter is fully green. Covers: R9.
