# Requirements - test_e2e_cashier_sales_flow (Feature ID: 9)

- **R1**: WHEN a cashier fills valid phone and amount fields on a mobile viewport (375 px) and submits the form, the E2E test MUST assert the success banner with `role="status"` becomes visible containing the text "Sale registered successfully".

- **R2**: WHEN a successful sale registration completes, the E2E test MUST assert the phone input and amount input are both cleared to empty values.

- **R3**: WHEN a cashier submits the form with an invalid phone number (non-matching `+51\d{9}` or `\+(?!51)\d{7,15}` format), the E2E test MUST assert the error banner with `role="alert"` becomes visible.

- **R4**: WHEN a cashier fills valid phone and amount fields on a desktop viewport (1440 px) and submits the form, the E2E test MUST assert the success banner appears and both input fields are cleared.

- **R5**: The E2E test file MUST reside at `tests/e2e/cashier_sales_flow.e2e.test.ts` with the `.e2e.test.ts` suffix matching the Playwright configuration `testMatch` pattern.

- **R6**: E2E tests MUST use the `baseURL` configured in `playwright.config.ts` (http://localhost:3000) and navigate to `/admin/cash` via `page.goto("/admin/cash")`.

## Acceptance Criteria

1. Playwright tests fill mobile inputs, submit, and verify success banner with "Sale registered successfully" text.
2. Playwright tests assert form clear state — both phone and amount inputs become empty after a successful registration.
3. Playwright tests verify error banner appears on invalid phone submission.
4. Desktop viewport flow also verified: fill, submit, success banner, form cleared.

## Verification Evidence

- `tests/e2e/cashier_sales_flow.e2e.test.ts` exists with `.e2e.test.ts` suffix.
- Test file contains `test.describe` block for "Cashier Sales Registration Flow".
- Mobile viewport (375 px) test fills phone `+51987654321` and amount `50`, submits, asserts `role="status"` banner visible.
- Same test asserts phone and amount inputs are empty after success.
- Error test submits with invalid phone `123`, asserts `role="alert"` banner visible.
- Desktop viewport (1440 px) test fills phone and amount, submits, asserts success banner and form cleared.
