# Design: Campaign Segment Cards UI Component

## File Location

`src/components/promotions/segment-cards.component.tsx`

## Architecture

### Component Type

Client Component (`"use client"`). The component is a presentational UI unit that receives data from its parent (or via the `useCampaigns` hook) and renders segment cards with action callbacks. It does not perform any data fetching or side effects directly.

### Props Interface

```typescript
import type { CustomerSegmentationResult } from "@/backend/types/models.type";

export type CustomerSegmentType = 'inactive_30d' | 'high_spender' | 'frequent';

export interface SegmentCardsProps {
  segments: CustomerSegmentationResult | null;
  segmentsLoading: boolean;
  segmentsError: string | null;
  onSegmentSelect: (segment: CustomerSegmentType) => void;
  onRetry?: () => void;
}
```

The component accepts four props — three reflecting the hook's segments state and a callback for user interaction. This keeps the component testable without requiring the hook.

### States

The component handles four visual states:

1. **Loading** (`segmentsLoading === true`): Three skeleton placeholder cards with pulse animation, matching the card layout proportions. Uses `bg-zinc-800/50 rounded-2xl p-6 animate-pulse`.

2. **Error** (`segmentsError !== null`): Error banner with a red-tinted card containing:
   - Error icon (AlertCircle from lucide-react)
   - Error message text
   - "Retry" button that calls `onRetry`

3. **Empty** (`segments !== null && all summary values === 0`): Neutral card with:
   - Info icon
   - "No customer segments available" text
   - Secondary text suggesting segments populate after customer activity

4. **Populated** (`segments !== null && at least one segment count > 0`): Grid of segment cards, one per segment with count > 0.

### Visual Design

#### Card Container

Standard card container consistent with `predictive-card.component.tsx`:
```tsx
rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg
```

#### Grid Layout

- **Mobile** (≤640px): Single column, `flex flex-col gap-4`
- **Tablet** (641px–1024px): Two columns, `grid grid-cols-2 gap-4`
- **Desktop** (>1024px): Three columns, `grid grid-cols-3 gap-4`

#### Segment Card Content

Each populated card renders:
- Segment icon (different per type — e.g., Clock for inactive_30d, TrendingUp for high_spender, Users for frequent)
- Segment label (localized/human-readable name)
- Customer count displayed prominently
- "Generate Campaign" action button
- Color-coded accent bar at the top matching segment type

#### Segment Visual Indicators

| Segment | Label | Color | Icon |
|---------|-------|-------|------|
| `inactive_30d` | "Inactive 30 Days" | Amber (`bg-amber-500/20`, `text-amber-400`, `border-amber-500/30`) | Clock |
| `high_spender` | "High Spender" | Emerald (`bg-emerald-500/20`, `text-emerald-400`, `border-emerald-500/30`) | TrendingUp |
| `frequent` | "Frequent" | Blue (`bg-blue-500/20`, `text-blue-400`, `border-blue-500/30`) | Users |

#### Action Trigger Button

Styled as a primary action button per segment:
```tsx
<button
  onClick={() => onSegmentSelect(segmentType)}
  className="w-full mt-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors ..."
>
  Generate Campaign
</button>
```

- `py-3` ensures ≥44px touch target (R7)
- `w-full` fills card width on all viewports

### Data Flow

```mermaid
graph TD
    Parent["Parent page/component"] -->|renders| Hook["useCampaigns() hook (F26)"]
    Hook -->|segments, segmentsLoading, segmentsError| SC["SegmentCards component"]
    SC -->|onSegmentSelect(segment)| Parent["Parent handles selection"]
    Parent -->|onRetry| Hook["triggers re-fetch"]
```

The parent (e.g. a manager promotions page or a wrapping container) calls `useCampaigns()` and passes the relevant slice of its return value to `SegmentCards`. This follows the same pattern as the existing `predictive-card.component.tsx` which receives data from `useTraffic`.

### Error Handling

- **segmentsError**: Displayed as an inline banner within the component (not a toast or alert). The retry button gives the user a way to recover without navigating away.
- **Missing segments data**: Handled via the loading state (null data while loading) and empty state (loaded but zero counts). No error state for empty data.
- **Missing onRetry**: If `onRetry` is not provided, the retry button is hidden in error state.

### Responsive Behavior

- Base (mobile-first): `flex flex-col gap-4` — vertical stack
- `md:` breakpoint (≥768px): `grid grid-cols-2 gap-4`
- `lg:` breakpoint (≥1024px): `grid grid-cols-3 gap-4`
- Cards use `min-w-0` to prevent grid overflow
- Touch targets: buttons use `py-3` (≥44px height) with `min-w-[44px]`
- Text uses responsive sizing: `text-base` on mobile, `text-lg` on larger screens
- No horizontal scroll at any breakpoint

### Next.js Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — Client component directive usage.

### Rejected Alternatives

- **Server Component**: Rejected. The component needs `"use client"` because it handles click/tap events (`onSegmentSelect`, retry button) and renders conditional interactive UI states. These are inherently client-side behaviors.
- **Combine segment cards with campaign cards into one component**: Rejected. Segment selection triggers campaign generation, but the segment card display and the generated campaign results display are distinct UI concerns. Keeping them separate follows the Single Responsibility principle (conventions.md).
- **Inline data fetching inside the component**: Rejected. The component accepts data as props, following the same pattern as `predictive-card.component.tsx`. This keeps it testable and decoupled from the data layer.
- **Use icon per customer count**: Rejected. Using lucide-react icons for segment type identification is more visually scannable than rendering per-customer avatars or count badges.
