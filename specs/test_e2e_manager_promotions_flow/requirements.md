# Feature 29 — test_e2e_manager_promotions_flow: Requirements

## File

`tests/e2e/manager_promotions_flow.e2e.test.ts`

---

R1 (Ubiquitous) — The test file SHALL be named `manager_promotions_flow.e2e.test.ts` and reside under `tests/e2e/`.

R2 (Ubiquitous) — The test suite SHALL use Playwright's `test` and `expect` primitives imported from `@playwright/test`.

R3 (Ubiquitous) — The test suite SHALL group all tests inside a single `test.describe("Manager Promotions Campaign Flow", ...)` block.

---

R4 (Event-driven) — WHEN the page at `/admin/promotions` loads with segmented customer data, THEN the test SHALL assert that segment cards for `inactive_30d`, `high_spender`, and `frequent` are visible using `getByTestId` selectors.

R5 (Event-driven) — WHEN the user clicks the "Generate Campaign" trigger on the `inactive_30d` segment card, THEN the test SHALL assert that a skeleton/loading indicator (`getByTestId("campaigns-loading")`) becomes visible while the generation request is pending.

R6 (Event-driven) — WHEN the campaign generation API completes successfully, THEN the test SHALL assert that campaign draft cards render with visible `recoveryCopy` text and a `generatedAt` timestamp.

R7 (State-driven) — WHILE the campaign generation request is pending, the test SHALL assert that the skeleton loading state is visible and no results or error states are present.

R8 (Event-driven) — WHEN the campaign generation API returns a 500 error, THEN the test SHALL assert an error banner (`getByTestId("campaigns-error")`) is visible and the error message is displayed.

R9 (Event-driven) — WHEN the campaign generation API returns success for the `inactive_30d` segment, THEN the test SHALL assert that the generated campaign contains the `recoveryCopy` field with a non-empty string and the `generatedAt` field with a valid ISO timestamp.

R10 (Event-driven) — WHEN the segments API returns an empty segments list, THEN the test SHALL assert that an empty state (`getByTestId("segment-cards-empty")`) is rendered with an appropriate message.

R11 (Where) — WHERE the viewport is set to 375px width, the test SHALL assert that the segment cards and campaign results remain within the viewport without horizontal overflow.

R12 (Where) — WHERE the viewport is set to 1440px width, the test SHALL assert that the segment cards and campaign results render correctly without layout breakage.
