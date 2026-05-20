# Tasks - page_cashier_dashboard (Feature ID: 8)

- [x] **T1**: Update `src/components/cashier/form.component.tsx` to accept optional controlled props (`phoneNumber`, `amount`, `setPhoneNumber`, `setAmount`). When provided, use them as controlled state; when absent, fall back to internal `useState`. Covers: R3 (form interface update).
- [x] **T2**: Update `src/app/admin/cash/page.tsx` — split into Server Component (metadata) + Client Component (`cashier-dashboard.client.tsx`) with hook wiring, success/error banners, and controlled form props. Covers: R1, R2, R3, R4, R5, R6, R7.
- [x] **T3**: Create `tests/e2e/page_cashier_dashboard.e2e.test.ts` with Playwright test: navigate to `/admin/cash` at 1440 px viewport, assert form inputs are visible. Covers: R8, AC4.
- [x] **T4**: Run `./init.sh --quick` and `./init.sh`; confirm lint and tests green. Covers: all requirements.