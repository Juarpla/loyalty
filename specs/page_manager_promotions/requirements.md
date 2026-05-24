# Requirements — Feature 28: Manager Promotions Page Route

> Feature: `page_manager_promotions`  
> SDD: `true`  
> Status: `spec_author`

## R1 — Page Route and Metadata

WHEN the promotions page route `/admin/promotions` is accessed, the system MUST serve a page at `src/app/admin/promotions/page.tsx` that exports metadata with title "Promotions Manager | Loyalty" and description "Manage customer segments and AI-powered promotions".

*Verification:* Playwright E2E test asserts `document.title` matches the expected title string and the route returns a 200 status.

## R2 — Promotions Page Header

WHEN the promotions page loads, the system MUST render a persistent header containing the application brand mark, the page title "Promotions Manager", and the subtitle "Customer segments and campaign generation".

*Verification:* Playwright E2E test asserts header elements are visible and contain expected text.

## R3 — Navigation to Other Admin Pages

WHEN the page renders, the system MUST provide accessible navigation links to the other admin routes: Cashier (`/admin/cash`), Dashboard (`/admin/dashboard`), and Social (`/admin/social`).

*Verification:* Playwright E2E test asserts the navigation links are visible, have correct `href` attributes, and route successfully when clicked.

## R4 — Segment Cards Integration

WHEN the main content area mounts, the system MUST render the `SegmentCards` component wired to the `useCampaigns` hook states (`segments`, `segmentsLoading`, `segmentsError`, `onSegmentSelect`).

*Verification:* Playwright E2E test asserts `data-testid="segment-cards-loading"` (or `segment-cards-populated`, `segment-cards-error`, `segment-cards-empty`) is present in the DOM.

## R5 — Campaign Generation Trigger

WHEN a segment card "Generate Campaign" button is clicked, the system MUST invoke `useCampaigns`'s `generateCampaigns` callback and render the resulting `GeminiRecoveryPromptResult` campaign cards beneath the segment cards section.

*Verification:* Playwright E2E test intercepts the generate endpoint with a mock response and asserts campaign cards render after clicking a segment card button.

## R6 — Loading State for Campaigns

WHILE the campaign generation request is pending, the system MUST render skeleton loading indicators in the campaign results area to indicate active processing.

*Verification:* Playwright E2E test intercepts the generate endpoint with a delayed response and asserts skeleton elements appear while the generate request is in-flight.

## R7 — Error State for Campaigns

IF the campaign generation request returns an error response, THEN the system MUST render an error banner in the campaign results area with a retry option.

*Verification:* Playwright E2E test intercepts the generate endpoint with a 500 response and asserts the error banner is visible.

## R8 — Responsive Layout

WHEN the viewport width changes, the system MUST adapt the promotions page layout fluidly across phone (375 px), tablet (768 px), and desktop (1440 px) breakpoints without horizontal overflow or clipping.

*Verification:* Playwright E2E tests set each viewport size and assert the page container is visible and does not overflow its parent bounds.

## R9 — Semantic Structure and Accessibility

WHEN the page renders, the system MUST use semantic HTML landmarks (`<main>`, `<nav>`) and ensure all interactive elements (navigation links, buttons) have visible focus indicators.

*Verification:* Playwright E2E test inspects DOM landmarks and checks focus-visible styles on interactive elements.

## R10 — E2E Coverage

Playwright E2E tests in `tests/e2e/page_manager_promotions.e2e.test.ts` SHALL verify layout CSS, component inclusion, navigation routing, segment card rendering, campaign generation trigger, and responsive scaling.

*Verification:* The E2E test file exists, passes in CI, and covers R1–R9.
