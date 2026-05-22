# Requirements — component_traffic_charts

## Overview

Transform `src/components/traffic/chart.component.tsx` from a hardcoded mock-data view into a live-data presentation component that renders `TrafficDistribution` from the `useTraffic` hook. The component SHALL display hourly (0–23) and weekday (Sun–Sat) distribution as fluid bar charts, highlight peak periods, and handle loading and error states gracefully.

## Functional Requirements

### R1 — Hourly Chart Rendering
WHEN `TrafficChartComponent` receives a `TrafficDistribution` object via the `data` prop, the component MUST render a fluid vertical bar chart representing the 24-hour transaction distribution (`hours` array, indices 0–23).

### R2 — Weekday Chart Rendering
WHEN `TrafficChartComponent` receives a `TrafficDistribution` object via the `data` prop, the component MUST render a fluid vertical bar chart representing the 7-day weekday transaction distribution (`weekdays` array, indices 0–6 mapped to Sun–Sat).

### R3 — Peak Hour Highlight
WHEN `TrafficChartComponent` renders the hourly chart, the bar corresponding to the `peakHour` index MUST receive a distinct visual highlight (e.g., accent color, glow, or border) that differentiates it from non-peak bars.

### R4 — Peak Weekday Highlight
WHEN `TrafficChartComponent` renders the weekday chart, the bar corresponding to the `peakWeekday` index MUST receive a distinct visual highlight that differentiates it from non-peak bars.

### R5 — Loading State
WHILE the `loading` prop is `true`, `TrafficChartComponent` MUST display an animated loading skeleton in place of both chart areas and MUST NOT render data bars, labels, or peak highlights.

### R6 — Error State
IF the `error` prop is a non-null, non-empty string, THEN `TrafficChartComponent` MUST display a human-readable error message banner and MUST NOT render chart bars, loading skeletons, or peak highlights.

### R7 — Mobile Responsiveness
WHERE the viewport width is less than 640px, the charts in `TrafficChartComponent` MUST remain fully visible without horizontal overflow, and bar labels MUST remain legible.

### R8 — Host Page Wiring
The `src/app/admin/dashboard/page.tsx` route MUST invoke `useTraffic` and pass its `data`, `loading`, and `error` fields as props to `TrafficChartComponent` so that live metrics are rendered.

### R9 — E2E Verification
Playwright E2E tests in `tests/e2e/component_traffic_charts.e2e.test.ts` MUST intercept `/api/v1/sales/metrics` and return a mocked `TrafficDistribution` payload, then verify that both hourly and weekday charts are visible with correct bar counts on the dashboard route.

### R10 — Integration Verification
Integration tests in `tests/integration/component_traffic_charts.integration.test.ts` MUST verify the correctness of extracted chart helper utilities (bar height normalization and peak index detection).
