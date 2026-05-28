# Requirements: page_cashier_dashboard_milestones

Feature ID: 63
Feature name: page_cashier_dashboard_milestones
Title: Cashier Dashboard Page Layout Extensions
History: F4 - Story 4.3: 10th visit reward visual alert

## Context

Feature 63 connects the Cashier Dashboard (`src/app/admin/cash/page.tsx` and `cashier-dashboard.client.tsx`) to the milestone rewards system. By integrating the arrivals feed (`useArrivals` hook, Feature 55) and the rewards state (`useRewards` hook, Feature 61), the cashier dashboard will dynamically monitor when a customer logs in via the captive portal and automatically trigger a high-visibility modal overlay (`CashierMilestoneModal` component, Feature 62) if that customer reaches their 10th visit milestone.

---

## Requirements

- **R1 (Ubiquitous):** The Cashier Dashboard page component (`src/app/admin/cash/cashier-dashboard.client.tsx`) MUST integrate the `useArrivals` hook to monitor active portal logins.
- **R2 (Ubiquitous):** The Cashier Dashboard page component MUST integrate the `useRewards` hook to manage milestone checks and claim operations.
- **R3 (Event-driven):** WHEN a new portal arrival is received in the arrivals list (`notifications` from `useArrivals`), the system MUST automatically trigger a milestone check using `checkMilestone` with the new arrival's `clientId`.
- **R4 (State-driven):** The system MUST track already checked arrival client IDs to prevent redundant API calls or duplicate checks for the same portal login event.
- **R5 (State-driven):** The Cashier Dashboard MUST conditionally render the `CashierMilestoneModal` component when `modalVisible` from `useRewards` is `true`.
- **R6 (Ubiquitous):** The CashierMilestoneModal MUST be passed:
  - `visible`: `modalVisible` from `useRewards`
  - `customerName`: The name of the latest arrival (`notifications[0]?.name` or `"Customer"` / `"Anonymous Customer"` if unnamed)
  - `customerPhone`: The phone number of the latest arrival (`notifications[0]?.phone_number`)
  - `rewardDescription`: A configured standard string `"Free Coffee & Donut"` representing the 10th visit reward
  - `visitCount`: `10`
  - `loading`: `loading` from `useRewards`
  - `onClaim`: A callback executing `claimReward(clientId)` using the latest arrival's `clientId`
  - `onDismiss`: `dismissModal` from `useRewards`
- **R7 (Ubiquitous):** Playwright E2E tests in `tests/e2e/page_cashier_dashboard_milestones.spec.ts` MUST verify that:
  - When the page loads, the milestone modal is not visible initially.
  - When a new portal arrival is simulated and matches the 10th visit milestone, the dashboard automatically renders the `CashierMilestoneModal`.
  - Clicking the "Claim Reward" button inside the modal successfully calls the claim API, dismisses the modal, and renders a success message banner on the dashboard.
  - Clicking the "Dismiss" button inside the modal successfully closes the modal.
