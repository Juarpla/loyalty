# Tasks: page_cashier_dashboard_milestones

Feature ID: 63
Feature name: page_cashier_dashboard_milestones
Title: Cashier Dashboard Page Layout Extensions

- [x] T1 - Integrate `useArrivals` and `useRewards` state hooks into `src/app/admin/cash/cashier-dashboard.client.tsx`. Covers: R1, R2.
- [x] T2 - Implement the checked arrivals `useEffect` mechanism using `useRef` to track checked keys and trigger `checkMilestone` on new arrivals. Covers: R3, R4.
- [x] T3 - Add message banners for `rewardsSuccess` and `rewardsError` to display rewards claim responses to the cashier. Covers: R5, R6.
- [x] T4 - Render `CashierMilestoneModal` dynamically in the JSX, passing required props and callbacks. Covers: R5, R6.
- [x] T5 - Implement Playwright E2E tests in `tests/e2e/page_cashier_dashboard_milestones.e2e.test.ts` covering initial state, automatic milestone modal trigger on new arrival connection, claiming reward, and dismissing the modal. Covers: R7.
- [x] T6 - Run `./init.sh` to verify all lints and integration tests are passing. Covers: R1-R7.
