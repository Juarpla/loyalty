# Implementation Tasks for Manager Social Content Creation Page

- [x] T1 - Implement `src/app/admin/social/page.tsx` as a Client Component, importing and wiring `useSocialIdeas` with `ContextForm` and `SuggestionsCards`. Covers: R1, R2, R3, R4.
- [x] T2 - Apply responsive Tailwind CSS classes in `page.tsx` to handle layout shifts between mobile (stacked) and desktop (grid/side-by-side) viewports. Covers: R5.
- [x] T3 - Write Playwright E2E tests in `tests/e2e/page_manager_social.spec.ts` asserting that the form and suggestions container render and respond to viewport resizing. Covers: R6.
- [x] T4 - Implement a skeletal loading indicator in `src/app/admin/social/page.tsx` and render it conditionally when `loading` is true. Covers: R7.
