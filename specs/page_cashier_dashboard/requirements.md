# Requirements - page_cashier_dashboard (Feature ID: 8)

- **R1**: WHEN the cashier dashboard URL (`/admin/cash`) is accessed, the page SHALL export a default function component that renders inside the root layout with the global theme applied.
- **R2**: The page component SHALL call `useCashierSales()` from `@/hooks/use-cashier-sales.hook` and pass the resulting `loading` value to the `CashierForm` component's `loading` prop.
- **R3**: The page component SHALL pass the hook's `phoneNumber`, `amount`, `setPhoneNumber`, `setAmount` values and setters to the `CashierForm` as controlled props (`phoneNumber`, `amount`, `setPhoneNumber`, `setAmount`) so the hook state and form state remain synchronized.
- **R4**: The `CashierForm`'s `onSubmit` callback SHALL be wired to the hook's `registerSale` method so that submitting the form triggers the API POST to `/api/v1/sales/record`.
- **R5**: WHEN the hook's `successMessage` is non-null, the page SHALL render a success banner div with accessible `role="status"` containing the message text.
- **R6**: WHEN the hook's `error` is non-null, the page SHALL render an error banner div with accessible `role="alert"` containing the error text.
- **R7**: The page SHALL have a Next.js `metadata` export with `title: "Cashier Dashboard | Loyalty"` and `description: "Register customer sales transactions"`.
- **R8**: Playwright E2E tests in `tests/e2e/page_cashier_dashboard.e2e.test.ts` SHALL verify that navigating to `/admin/cash` renders the form successfully at desktop viewport (1440 px).

## Acceptance Criteria

1. Page at `/admin/cash` renders `CashierForm` component with hook integration.
2. Success banner appears after a successful sale registration (requires API to be reachable).
3. Error banner appears when the API returns an error.
4. Playwright E2E tests in `tests/e2e/page_cashier_dashboard.e2e.test.ts` verify page renders at 1440 px viewport.

## Verification Evidence

- `src/app/admin/cash/page.tsx` exports default function and `metadata`.
- Page imports and calls `useCashierSales()` hook.
- `CashierForm` receives `phoneNumber`, `amount`, `setPhoneNumber`, `setAmount`, `loading` props.
- `CashierForm`'s `onSubmit` is wired to `registerSale`.
- Success banner (role="status") rendered when `successMessage` is non-null.
- Error banner (role="alert") rendered when `error` is non-null.
- E2E test file `tests/e2e/page_cashier_dashboard.e2e.test.ts` exists with viewport test.