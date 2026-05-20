# Tasks - hook_cashier_sales (Feature ID: 6)

- [x] **T1**: Add `@testing-library/react` to devDependencies if missing. Covers: Design (Testing Strategy).
- [x] **T2**: Implement `src/hooks/use-cashier-sales.hook.ts` with form state, `registerSale` POST to `/api/v1/sales/record`, loading/error/success handling per design. Covers: R1, R2, R3, R4, R5, R6.
- [x] **T3**: Create `tests/integration/hook-cashier-sales.integration.test.ts` with `// @vitest-environment jsdom`, mocked `fetch`, and cases: R2/R3 loading toggle; R4 success clears form and sets `successMessage`; R5/R6 error preserves form. Covers: R1–R6.
- [x] **T4**: Run `./init.sh --quick` and `./init.sh`; confirm all integration tests pass and lint is green. Covers: all requirements.
