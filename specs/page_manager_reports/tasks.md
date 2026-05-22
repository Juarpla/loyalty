# Tasks — Feature 15: Manager Sales Reports Page Route

> Every task references the requirements it covers.

- [x] T1 — Create `src/app/admin/dashboard/dashboard.client.tsx` extracting the existing dashboard UI (header, `useTraffic` hook, `TrafficChartComponent` mount) from `page.tsx`. Covers: R1, R2, R4, R5.
- [x] T2 — Rewrite `src/app/admin/dashboard/page.tsx` as a Server Component exporting `metadata` with title "Manager Dashboard | Loyalty" and rendering `<DashboardClient />`. Covers: R7.
- [x] T3 — Add semantic `<nav>` landmark to `dashboard.client.tsx` with `next/link` navigation to `/admin/cash`, `/admin/promotions`, and `/admin/social`. Covers: R6, R8.
- [x] T4 — Verify responsive Tailwind classes on header, navigation, and main content area (`max-w-2xl`, `mx-auto`, `px-4`, fluid widths) so layout adapts across phone, tablet, and desktop. Covers: R3.
- [x] T5 — Create `tests/e2e/page_manager_reports.e2e.test.ts` with Playwright tests verifying:
  - Page title and metadata (R7)
  - Header visibility and text (R1)
  - Navigation link presence and correct hrefs (R6)
  - Navigation click routing (R6)
  - TrafficChartComponent inclusion (R2)
  - Skeleton state during loading (R4)
  - Error banner on failed fetch (R5)
  - Responsive rendering at 375 px, 768 px, and 1440 px (R3)
  - Semantic landmarks and focus indicators (R8)
  Covers: R1–R9.
- [x] T6 — Run `./init.sh` and ensure no lint or type errors are introduced by the new files. Covers: R1–R9.
