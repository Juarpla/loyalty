# Tasks - test_e2e_manager_arrivals_feed_flow (Feature ID: 57)

This task list maps out the implementation and E2E verification steps required to successfully complete Feature 57.

## Task List

- [x] **T1: Integrate Arrivals Feed in Manager Dashboard**
  - Edit `src/app/admin/dashboard/dashboard.client.tsx` to import and render `ArrivalsFeedComponent` alongside `TrafficChartComponent`.
  - Wire it up with the state and actions returned by the `useArrivals()` hook.
  - Ensure visual padding, margins, and responsiveness are consistent with existing sections.
  - *Covers: R1*

- [x] **T2: Implement Manager Arrivals Feed Integration E2E Tests**
  - Create the Playwright E2E test file `tests/e2e/manager_arrivals_feed_flow.spec.ts`.
  - Implement a complete flow:
    1. Navigate to `/admin/dashboard` to verify it loads.
    2. Navigate to `/portal` in the browser, fill in a randomized name (e.g. `E2E User [timestamp]`) and a valid format phone number (e.g. `+54911` with random digits), and click submit to trigger a DB insert.
    3. Verify successful portal connection state.
    4. Navigate back to `/admin/dashboard` (or use multiple pages/tabs).
    5. Click the manual refresh button (`data-testid="refresh-button"`).
    6. Verify that the new visitor card renders at the top of the arrivals feed.
    7. Verify the presence of correct details: customer name, standard phone number, greeting preview, and green WhatsApp prefilled URL link button.
    8. Assert the WhatsApp link's `href` attribute matches the format `https://wa.me/<phone>?text=<encoded_greeting>`.
  - *Covers: R2, R3, R4, R5*

- [x] **T3: Run Diagnostics and Verify All Tests Pass**
  - Execute `./init.sh --quick` to check syntax, lints, and type safety.
  - Execute `pnpm test` to run all Vitest integration tests.
  - Execute `pnpm test:e2e` (or the specific playwright test command) to verify the Playwright E2E suite passes green.
  - Run production build `pnpm build` to guarantee no bundler/compilation regressions.
  - *Covers: R1, R2, R3, R4, R5*
