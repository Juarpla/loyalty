# Design — component_traffic_charts

## Files Expected to Change

| File | Change Type | Notes |
|------|-------------|-------|
| `src/components/traffic/chart.component.tsx` | Major refactor | Convert from hardcoded mock to props-driven. Keep under 150 lines. |
| `src/components/traffic/hourly-chart.component.tsx` | New | Extracted 24-hour bar chart sub-component. |
| `src/components/traffic/weekday-chart.component.tsx` | New | Extracted 7-day bar chart sub-component. |
| `src/components/traffic/chart.utils.ts` | New | Pure helper functions for height calc and peak detection. |
| `src/app/admin/dashboard/page.tsx` | New | Minimal host page wiring `useTraffic` to the component. |
| `tests/e2e/component_traffic_charts.e2e.test.ts` | New | Playwright E2E spec. |
| `tests/integration/component_traffic_charts.integration.test.ts` | New | Vitest integration spec for helpers. |

## Public Interfaces

### `TrafficChartComponent`

```typescript
// src/components/traffic/chart.component.tsx
import type { TrafficDistribution } from "@/backend/types/models.type";

export interface TrafficChartProps {
  data: TrafficDistribution | null;
  loading: boolean;
  error: string | null;
}

export function TrafficChartComponent(props: TrafficChartProps): JSX.Element;
```

### `HourlyChartComponent`

```typescript
// src/components/traffic/hourly-chart.component.tsx
export interface HourlyChartProps {
  hours: number[];
  peakHour: number;
}
export function HourlyChartComponent(props: HourlyChartProps): JSX.Element;
```

### `WeekdayChartComponent`

```typescript
// src/components/traffic/weekday-chart.component.tsx
export interface WeekdayChartProps {
  weekdays: number[];
  peakWeekday: number;
}
export function WeekdayChartComponent(props: WeekdayChartProps): JSX.Element;
```

### Pure Helpers

```typescript
// src/components/traffic/chart.utils.ts
export function normalizeToPercentages(values: number[]): number[];
export function findPeakIndex(values: number[]): number;
export function formatHourLabel(hour: number): string;
export function formatWeekdayLabel(index: number): string;
```

## Data Flow

1. `src/app/admin/dashboard/page.tsx` calls `useTraffic()` (completed in F13).
2. The hook fetches `/api/v1/sales/metrics` and returns `{ data, loading, error, refresh }`.
3. The host page passes `data`, `loading`, and `error` to `<TrafficChartComponent />`.
4. `TrafficChartComponent` branches:
   - `loading === true` → render loading skeleton.
   - `error !== null` → render error banner.
   - `data !== null` → render `<HourlyChartComponent hours={data.hours} peakHour={data.peakHour} />` and `<WeekdayChartComponent weekdays={data.weekdays} peakWeekday={data.peakWeekday} />`.
5. Sub-components compute bar heights by dividing each value by the array maximum and scaling to percentage.
6. Peak bars receive a Tailwind accent class (e.g., `bg-indigo-400` vs `bg-zinc-700` for non-peak).

## Error Handling

- Network and backend errors are captured by `useTraffic` and surfaced through the `error` prop.
- The component renders a non-blocking inline error banner (e.g., a red-tinted text block inside the card) rather than throwing, ensuring the surrounding dashboard UI remains stable.
- No `try/catch` is required inside the component because the hook normalizes exceptions into the `error` string.

## Next.js Docs Consulted

- Searched `node_modules/next/dist/docs/` for local guides on Server and Client Components, App Router conventions, and Playwright testing.
- **Result**: The local docs directory is not present in this environment. The spec relies on the global conventions in `docs/architecture.md` and `docs/conventions.md` instead.

## Design Decisions & Rejected Alternatives

### Decision 1: Props-based (dumb) component
`TrafficChartComponent` accepts `data`, `loading`, and `error` as props rather than calling `useTraffic` internally.

- **Rejected alternative**: Self-contained hook-embedded component. The component would import `useTraffic` directly and manage its own fetch lifecycle.
- **Reason for rejection**: A props-based component is pure, reusable, and easier to test in isolation. It aligns with the architecture doc's note that the dashboard page "Uses chart.component.tsx via hooks". The host page owns data orchestration; the component owns presentation.

### Decision 2: Extract sub-components and helpers
The hourly and weekday charts are extracted into separate files, and height-normalization logic is extracted into `chart.utils.ts`.

- **Rejected alternative**: Monolithic single-file component containing both charts, all logic, and all markup.
- **Reason for rejection**: `docs/conventions.md` enforces a 150-line maximum per component file. Adding a second chart, loading skeleton, error banner, and peak highlights would exceed this limit. Extraction keeps each file small and focused.

### Decision 3: Single-series bars
The new charts render a single data series (transaction counts) per time bucket.

- **Rejected alternative**: Retain the dual-series "walk-ins + wifi" bars from the hardcoded mock.
- **Reason for rejection**: The `TrafficDistribution` API model (F10–F13) provides only one numeric array per dimension (`hours` and `weekdays`). There is no separate Wi-Fi connection count in the live schema. Rendering a second inner series would require inventing data, which violates the "consume real data" mandate.

### Decision 4: Inline loading skeleton and error banner
Loading and error states are rendered inside the component card rather than as page-level overlays.

- **Rejected alternative**: Full-page spinner or modal error dialog triggered by the component.
- **Reason for rejection**: The component is designed to be embedded in a larger dashboard (F15). A localized skeleton preserves dashboard context and avoids jarring full-screen transitions on partial data refreshes.

### Decision 5: Minimal host page created in F14
A minimal `src/app/admin/dashboard/page.tsx` is created as part of this feature to provide a route for E2E testing.

- **Rejected alternative**: Defer the host page entirely to F15.
- **Reason for rejection**: Playwright E2E tests require a real browser route. Without a page that mounts the component, there is no URL to visit and no way to verify the acceptance criteria. Creating a minimal host page now avoids an untestable gap. F15 will enhance the page with additional layout and navigation.

## Naming Notes

- `feature_list.json` references `tests/e2e/component_traffic_charts.spec.ts`, but the Playwright configuration (`playwright.config.ts`) uses `testMatch: '**/*.e2e.test.ts'`. The spec instructs the implementer to use the `.e2e.test.ts` suffix so that Playwright discovers the file, and documents this discrepancy for the reviewer.
