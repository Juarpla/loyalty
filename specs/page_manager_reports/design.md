# Design — Feature 15: Manager Sales Reports Page Route

## Overview

Enhance the bare `src/app/admin/dashboard/page.tsx` (created in F14 as a minimal host) into a full manager dashboard layout with navigation, responsive structure, server-side metadata, and correct integration of the `TrafficChartComponent` via `useTraffic`.

## Files Expected to Change

| File | Action | Reason |
|------|--------|--------|
| `src/app/admin/dashboard/page.tsx` | Rewrite | Convert to Server Component to export `metadata`; import and render a new client component wrapper. |
| `src/app/admin/dashboard/dashboard.client.tsx` | Create | Extract current dashboard UI logic (hook usage, header, chart mounting) into a dedicated Client Component so the page can remain a Server Component. |
| `tests/e2e/page_manager_reports.e2e.test.ts` | Create | Playwright E2E tests covering layout, responsiveness, navigation, loading, and error states. |

## Public Interfaces

### `src/app/admin/dashboard/page.tsx`

```tsx
import type { Metadata } from "next";
import { DashboardClient } from "./dashboard.client";

export const metadata: Metadata = {
  title: "Manager Dashboard | Loyalty",
  description: "View sales traffic and peak hours analytics",
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
```

No props; the page is a pure Server Component passthrough.

### `src/app/admin/dashboard/dashboard.client.tsx`

```tsx
"use client";

export function DashboardClient() { … }
```

No external props. Internally consumes `useTraffic()` and renders:
- Header with brand, title, subtitle
- Navigation links
- Main content area containing `TrafficChartComponent`

## Data Flow

```
DashboardClient (Client Component)
  └── useTraffic()  →  fetch /api/v1/sales/metrics
         ├── data  →  TrafficChartComponent
         ├── loading → TrafficChartComponent (skeleton)
         └── error → TrafficChartComponent (error banner)
```

The page itself does not fetch data; all network logic stays inside the existing `useTraffic` hook, preserving the Decoupled MVC boundary.

## Responsive Strategy

- Use Tailwind utility classes already present in the project (`max-w-2xl`, `mx-auto`, `px-4`, `sm:`, `md:`).
- Header content: flex row, gap-3, centred via `max-w-2xl mx-auto`.
- Chart container: `w-full` inside a centred column; the `TrafficChartComponent` already handles its own internal responsive scaling (tested in F14).
- No custom `@media` queries; rely on Tailwind breakpoints.

## Error Handling at Page Level

- Errors are surfaced exclusively by `TrafficChartComponent` (error banner via `data-testid="traffic-chart-error"`).
- The Client Component does not add a second error layer; it passes `error` straight through to the chart component.
- This keeps error handling DRY and consistent with F14.

## Navigation Structure

- A `<nav>` landmark inside the Client Component renders `next/link` anchors for:
  - `/admin/cash` — "Cashier"
  - `/admin/promotions` — "Promotions"
  - `/admin/social` — "Social"
- Navigation is placed below the header and above the main chart content.
- Each link uses the existing dark-theme colour tokens (`text-zinc-400`, hover `text-zinc-100`) to match the cashier dashboard aesthetic.

## Next.js Conventions Followed

- **App Router**: Route remains `src/app/admin/dashboard/page.tsx`.
- **Server vs Client Components**: Page is a Server Component (metadata export); all client interactivity (hooks, state) lives in `dashboard.client.tsx`. This mirrors the `cash/page.tsx` → `cashier-dashboard.client.tsx` pattern established in F8.
- **next/link**: Used for client-side navigation between admin routes.
- **Metadata API**: Static `metadata` object exported from the Server Component page file.

> Local Next.js docs (`node_modules/next/dist/docs/`) were not present in this workspace at the time of spec authoring; conventions were inferred from existing project patterns and standard Next.js 16 App Router behaviour.

## Rejected Alternatives

1. **Add a shared `src/app/admin/layout.tsx`**  
   Rejected because only the dashboard page needs navigation links at this stage. The cashier page (`/admin/cash`) does not share a common admin layout, and introducing a layout now would require retesting F8 and creates scope creep. Navigation can be promoted to a layout in a future feature if multiple admin pages require it.

2. **Keep `page.tsx` as a Client Component and use `generateMetadata` from a separate file**  
   Rejected because `generateMetadata` must live in a Server Component file adjacent to the page. Extracting a client component wrapper is simpler, follows the existing cashier pattern, and keeps metadata colocated with the route.

3. **Add a manual refresh button on the dashboard**  
   Rejected because `useTraffic` already exposes a `refresh` function, but F15 scope is layout and integration, not new UI controls. A refresh button can be added in a later feature if user feedback demands it.

## Dependencies

- Feature 14 (`component_traffic_charts`) — MUST be `done`. It is `done`.
- Feature 13 (`hook_manager_traffic`) — MUST be `done`. It is `done`.
- No other feature dependencies.
