# Tasks - test_e2e_cashier_sales_flow (Feature ID: 9)

- [x] **T1**: Create `tests/e2e/cashier_sales_flow.e2e.test.ts` with `test.describe("Cashier Sales Registration Flow")` block. Covers: R5, R6.

- [x] **T2**: Add mobile success test (375 px): navigate to `/admin/cash`, fill phone `+51987654321`, fill amount `50`, click submit, assert success banner (role="status") visible with "Sale registered successfully", assert phone and amount inputs are empty. Covers: R1, R2.

- [x] **T3**: Add mobile error test (375 px): navigate to `/admin/cash`, fill phone `123`, fill amount `50`, click submit, assert error banner (role="alert") visible with "Invalid phone number format". Covers: R3.

- [x] **T4**: Add desktop success test (1440 px): navigate to `/admin/cash`, fill phone `+51987654321`, fill amount `75`, click submit, assert success banner visible and both inputs cleared. Covers: R4.

- [x] **T5**: Run `pnpm test:e2e` (or `pnpm test:e2e:agent`) and confirm all Playwright tests pass. Run `./init.sh --quick` and confirm harness green. Covers: all requirements.
