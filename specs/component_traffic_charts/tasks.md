# Tasks — component_traffic_charts

Each task maps directly to one or more requirements.

- [x] T1 — Refactor `src/components/traffic/chart.component.tsx` to accept `TrafficChartProps` (`data`, `loading`, `error`) and stay under 150 lines by delegating to sub-components. Covers: R1, R2, R5, R6.
- [x] T2 — Create `src/components/traffic/hourly-chart.component.tsx` rendering 24 vertical bars with percentage-based heights and highlighting the `peakHour` bar. Covers: R1, R3.
- [x] T3 — Create `src/components/traffic/weekday-chart.component.tsx` rendering 7 vertical bars with percentage-based heights and highlighting the `peakWeekday` bar. Covers: R2, R4.
- [x] T4 — Create `src/components/traffic/chart.utils.ts` with pure helper functions (`normalizeToPercentages`, `findPeakIndex`, `formatHourLabel`, `formatWeekdayLabel`). Covers: R1, R2, R3, R4, R10.
- [x] T5 — Implement loading skeleton state inside `TrafficChartComponent` that replaces both charts with animated placeholder bars when `loading` is true. Covers: R5.
- [x] T6 — Implement error banner state inside `TrafficChartComponent` that displays the `error` message and suppresses chart rendering when `error` is non-null. Covers: R6.
- [x] T7 — Apply responsive Tailwind utilities to ensure hourly and weekday charts do not clip or overflow on viewports narrower than 640px. Covers: R7.
- [x] T8 — Create `src/app/admin/dashboard/page.tsx` as a minimal client page that calls `useTraffic` and passes its result to `TrafficChartComponent`. Covers: R8.
- [x] T9 — Write `tests/integration/component_traffic_charts.integration.test.ts` verifying helper utilities with Vitest. Covers: R10.
- [x] T10 — Write `tests/e2e/component_traffic_charts.e2e.test.ts` using Playwright route interception on `/api/v1/sales/metrics` to assert chart visibility and bar counts on `/admin/dashboard`, plus loading and error state verification. Covers: R5, R6, R9.
