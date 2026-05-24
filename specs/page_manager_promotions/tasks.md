# Tasks — Feature 28: Manager Promotions Page Route

> Every task references the requirements it covers.

- [x] T1 — Create `src/app/admin/promotions/promotions.client.tsx` as a Client Component consuming `useCampaigns()` hook and rendering:
  - Header with brand mark, title "Promotions Manager", subtitle "Customer segments and campaign generation"
  - `<nav>` landmark with `next/link` navigation to `/admin/cash`, `/admin/dashboard`, `/admin/social`
  - Main content area containing `SegmentCards` component wired to hook state (`segments`, `segmentsLoading`, `segmentsError`, `onSegmentSelect` -> `generateCampaigns`)
  - Campaign results section displaying campaign cards when `campaigns` data is available
  - Skeleton loading indicators when `generating` is true
  - Error banner with retry when `generateError` is non-null
  - Semantic HTML landmarks and focus-visible styles on interactive elements
  Covers: R2, R3, R4, R5, R6, R7, R9.

- [x] T2 — Create `src/app/admin/promotions/page.tsx` as a Server Component exporting:
  - `metadata` with title "Promotions Manager | Loyalty" and description "Manage customer segments and AI-powered promotions"
  - Default export rendering `<PromotionsClient />`
  Covers: R1.

- [x] T3 — Verify responsive Tailwind classes on header, navigation, and main content area (`max-w-2xl`, `mx-auto`, `px-4`, fluid widths) so layout adapts across phone, tablet, and desktop without overflow or clipping. Covers: R8.

- [x] T4 — Create `tests/e2e/page_manager_promotions.e2e.test.ts` with Playwright tests verifying:
  - Page title and metadata (R1)
  - Header visibility and text (R2)
  - Navigation link presence and correct hrefs (R3)
  - Navigation click routing (R3)
  - SegmentCards component inclusion (R4)
  - Campaign generation trigger on segment card click (R5)
  - Skeleton state during campaign generation (R6)
  - Error banner on failed campaign generation (R7)
  - Responsive rendering at 375 px, 768 px, and 1440 px (R8)
  - Semantic landmarks and focus indicators (R9)
  Covers: R1–R10.

- [x] T5 — Run `./init.sh` and ensure no lint, type, or test errors are introduced by the new files. Covers: R1–R10.
