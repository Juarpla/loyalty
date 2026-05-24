# Design — Feature 28: Manager Promotions Page Route

## Overview

Create a new App Router page route at `src/app/admin/promotions/page.tsx` that integrates the existing `SegmentCards` component (F27) with the `useCampaigns` hook (F26), providing managers with a promotions management dashboard for viewing customer segments and generating AI-powered campaigns.

## Files Expected to Change

| File | Action | Reason |
|------|--------|--------|
| `src/app/admin/promotions/page.tsx` | Create | Server Component page exporting metadata and rendering the client component wrapper. |
| `src/app/admin/promotions/promotions.client.tsx` | Create | Client Component consuming `useCampaigns` hook and rendering `SegmentCards`, campaign results, loading/error states. |
| `tests/e2e/page_manager_promotions.e2e.test.ts` | Create | Playwright E2E tests covering layout, segment cards, campaign generation, loading/error states, and responsive scaling. |

## Public Interfaces

### `src/app/admin/promotions/page.tsx`

```tsx
import type { Metadata } from "next";
import { PromotionsClient } from "./promotions.client";

export const metadata: Metadata = {
  title: "Promotions Manager | Loyalty",
  description: "Manage customer segments and AI-powered promotions",
};

export default function PromotionsPage() {
  return <PromotionsClient />;
}
```

No props; pure Server Component passthrough (mirrors F8 cashier and F15 dashboard patterns).

### `src/app/admin/promotions/promotions.client.tsx`

```tsx
"use client";

export function PromotionsClient() { … }
```

No external props. Internally consumes `useCampaigns()` and renders:
- Header with brand, title, subtitle
- Navigation links (Cashier, Dashboard, Social)
- Main content area containing `SegmentCards` component and campaign results

## Data Flow

```
PromotionsClient (Client Component)
  └── useCampaigns()  →  fetch /api/v1/promotions/segments, /api/v1/promotions/generate
         ├── segments        →  SegmentCards component
         ├── segmentsLoading →  SegmentCards (skeleton state)
         ├── segmentsError   →  SegmentCards (error banner)
         ├── campaigns       →  Campaign results cards (displayed below segment cards)
         ├── generating      →  Skeleton loading indicators
         ├── generateError   →  Error banner with retry
         └── generateCampaigns →  Triggered on segment card button click
```

The page does not fetch data directly; all network logic stays inside the existing `useCampaigns` hook, preserving the Decoupled MVC boundary.

### Campaign Results Rendering

When `campaigns` data is populated, render each `GeminiRecoveryPromptResult` as a campaign card showing:
- Draft recovery message preview
- Visual prompt suggestion
- Status indicator (generated timestamp)

Each campaign card includes a `data-testid="campaign-card-{index}"` for test targeting.

## Responsive Strategy

- Use Tailwind utility classes already present in the project (`max-w-2xl`, `mx-auto`, `px-4`, `flex`, `flex-col`, `gap-4`, `sm:`, `md:`, `lg:`).
- Header content: flex row with gap, centred via `max-w-2xl mx-auto`.
- Segment cards grid: already responsive via `md:grid-cols-2 lg:grid-cols-3` from F27.
- Campaign results: stacked vertically in a single column, responsive padding.
- No custom `@media` queries; rely on Tailwind breakpoints.

## Error Handling at Page Level

- Segment errors are surfaced exclusively by the `SegmentCards` component (error banner via `data-testid="segment-cards-error"`).
- Campaign generation errors are surfaced by an inline error banner with retry button in the campaign results area.
- The Client Component passes error state straight through to the respective sub-components.
- This keeps error handling DRY and consistent with existing patterns.

## Navigation Structure

- A `<nav>` landmark inside the Client Component renders `next/link` anchors for:
  - `/admin/cash` — "Cashier"
  - `/admin/dashboard` — "Dashboard"
  - `/admin/social` — "Social"
- Navigation uses the existing dark-theme colour tokens (`text-zinc-400`, hover `text-zinc-100`) to match the existing admin dashboard aesthetic.
- The current page ("Promotions") is omitted from links (already implicit) — matching the pattern from `dashboard.client.tsx` which omits "Dashboard".

## Next.js Conventions Followed

- **App Router**: Route at `src/app/admin/promotions/page.tsx`.
- **Server vs Client Components**: Page is a Server Component (metadata export); all client interactivity (hooks, state, event handlers) lives in `promotions.client.tsx`. This mirrors the `cash/page.tsx` → `cashier-dashboard.client.tsx` and `dashboard/page.tsx` → `dashboard.client.tsx` patterns.
- **next/link**: Used for client-side navigation between admin routes.
- **Metadata API**: Static `metadata` object exported from the Server Component page file.

> Local Next.js docs consulted: `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — confirms page file convention, metadata export, and Server Component pattern.

## Dependencies

- Feature 27 (`component_campaign_segment_cards`) — MUST be `done`. It is `done`.
- Feature 26 (`hook_manager_campaigns`) — MUST be `done`. It is `done`.
- Feature 25 (`api_promotions_generate_route`) — MUST be `done`. It is `done`.
- Feature 24 (`controller_promotions_generate`) — MUST be `done`. It is `done`.
- Feature 22 (`api_promotions_segments_route`) — MUST be `done`. It is `done`.
- Feature 21 (`controller_promotions_segments`) — MUST be `done`. It is `done`.
- No other feature dependencies.

## Rejected Alternatives

1. **Add campaign generation as a modal within SegmentCards**  
   Rejected because it would modify an already-completed component (F27), violating the surgical changes principle. Campaign results are rendered separately in the page layout, keeping the segment cards component clean and reusable.

2. **Make the page a Client Component and use `generateMetadata`**  
   Rejected because `generateMetadata` must live in a Server Component. Extracting a client wrapper follows the established cashier/dashboard pattern and keeps metadata colocated with the route.

3. **Add a shared `src/app/admin/layout.tsx` for navigation**  
   Rejected because not all admin pages share a common layout pattern (cashier has no nav). Navigation can be promoted to a layout in a future feature if consolidation is needed.
