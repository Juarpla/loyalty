# Requirements — Feature 15: Manager Sales Reports Page Route

> Feature: `page_manager_reports`  
> SDD: `true`  
> Status: `spec_author`

## R1 — Dashboard Header

WHEN the manager reports page route loads, the system MUST render a persistent header containing the application brand mark, the page title "Manager Dashboard", and the subtitle "Traffic and peak hours analytics".

*Verification:* Playwright E2E test asserts header elements are visible and contain expected text.

## R2 — Traffic Chart Integration

WHEN the dashboard main content area mounts, the system MUST render the `TrafficChartComponent` wired to the `useTraffic` hook states (`data`, `loading`, `error`).

*Verification:* Playwright E2E test asserts `data-testid="traffic-chart"` (or skeleton / error state) is present in the DOM.

## R3 — Responsive Layout

WHEN the viewport width changes, the system MUST adapt the dashboard layout fluidly across phone (375 px), tablet (768 px), and desktop (1440 px) breakpoints without horizontal overflow or clipping of chart bars.

*Verification:* Playwright E2E tests set each viewport size and assert the chart container is visible and does not overflow its parent bounds.

## R4 — Loading State

WHILE the traffic metrics request is pending, the system MUST render the `TrafficChartComponent` skeleton state (`data-testid="traffic-chart-skeleton"`) inside the main content area.

*Verification:* Playwright E2E test intercepts the metrics endpoint with a delayed response and asserts the skeleton is visible while charts are absent.

## R5 — Error State

IF the traffic metrics request returns an error response, THEN the system MUST render the `TrafficChartComponent` error banner (`data-testid="traffic-chart-error"`) inside the main content area and suppress chart data rendering.

*Verification:* Playwright E2E test intercepts the metrics endpoint with a 500 response and asserts the error banner is visible while the skeleton and chart containers are absent.

## R6 — Navigation to Other Admin Pages

WHEN the page renders, the system MUST provide accessible navigation links to the other admin routes: Cashier (`/admin/cash`), Promotions (`/admin/promotions`), and Social (`/admin/social`).

*Verification:* Playwright E2E test asserts the navigation links are visible, have correct `href` attributes, and route successfully when clicked.

## R7 — Page Metadata

WHEN the page is rendered server-side, the system MUST emit metadata with title "Manager Dashboard | Loyalty" and description "View sales traffic and peak hours analytics".

*Verification:* Playwright E2E test asserts `document.title` matches the expected title string.

## R8 — Semantic Structure and Accessibility

WHEN the page renders, the system MUST use semantic HTML landmarks (`<main>`, `<nav>`) and ensure all interactive navigation links have visible focus indicators.

*Verification:* Playwright E2E test inspects DOM landmarks and checks focus-visible styles on navigation links.

## R9 — E2E Coverage

Playwright E2E tests in `tests/e2e/page_manager_reports.e2e.test.ts` SHALL verify layout CSS, component inclusion, navigation routing, and responsive scaling.

*Verification:* The E2E test file exists, passes in CI, and covers R1–R8.
