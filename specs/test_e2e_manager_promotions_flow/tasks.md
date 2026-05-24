# Feature 29 — test_e2e_manager_promotions_flow: Tasks

- [x] T1 — Create `tests/e2e/manager_promotions_flow.e2e.test.ts` with imports and `test.describe("Manager Promotions Campaign Flow", ...)` block. Covers: R1, R2, R3.
- [x] T2 — Define mock data constants (`mockSegments`, `mockCampaigns`, `mockEmptySegments`, `mockErrorResponse`) at the top of the test file. Covers: R4, R5, R6, R7, R8, R9, R10.
- [x] T3 — Write test asserting segment cards render for inactive_30d, high_spender, and frequent when the page loads. Covers: R4.
- [x] T4 — Write test asserting skeleton loading state appears while campaign generation is pending and resolves to campaign results. Covers: R5, R7.
- [x] T5 — Write test asserting campaign draft cards render with visible recoveryCopy text and generatedAt timestamp on successful generation. Covers: R6, R9.
- [x] T6 — Write test asserting error banner appears with the error message when generation API returns 500. Covers: R8.
- [x] T7 — Write test asserting empty state renders when segments API returns empty data. Covers: R10.
- [x] T8 — Write test asserting no horizontal overflow at 375px viewport width. Covers: R11.
- [x] T9 — Write test asserting correct rendering at 1440px viewport width. Covers: R12.
