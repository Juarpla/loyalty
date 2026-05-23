# Design: Dashboard Predictive Alert UI Card Component

## File Location

`src/components/dashboard/predictive-card.component.tsx`

## Architecture

### Component Type

Client Component (`"use client"`). This is a pure presentation component that receives prediction data as props and renders the appropriate UI state. No data fetching or side effects.

### Props Interface

```typescript
export interface PredictiveCardProps {
  prediction: PredictionResult | null;
}
```

The component accepts a single `prediction` prop typed as `PredictionResult | null`. The `PredictionResult` type is already defined in `src/backend/types/models.type.ts` (feature 17).

### States

The component handles three visual states:

1. **Loading** (`prediction === null`): Skeleton pulse animation matching the existing `TrafficChartComponent` skeleton pattern.
2. **Inactive** (`prediction.status === "inactive"`): Muted card with informational text showing data span days.
3. **Active** (`prediction.status === "active"`): Prominent card with shift direction indicator, data span, and prediction summary.

### Visual Design

- Card container: `rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg` (consistent with `TrafficChartComponent`)
- Header: Title with colored dot indicator matching shift direction
- Body: Prediction summary text, data span info, and shift direction badge
- Shift indicators:
  - `increasing`: Green (`bg-emerald-500`, `text-emerald-300`)
  - `decreasing`: Red (`bg-red-500`, `text-red-300`)
  - `stable`: Amber (`bg-amber-500`, `text-amber-300`)

### Prediction Summary Text

Derived from `projectedWeekendShift`:
- `increasing`: "Weekend traffic is trending upward. Expect higher visitor counts."
- `decreasing`: "Weekend traffic is trending downward. Consider promotional actions."
- `stable`: "Weekend traffic remains stable. No significant changes expected."

### Responsiveness

- Mobile-first: Base styles target ≤640px viewport
- No horizontal overflow: All text wraps naturally, badges use inline-flex with wrap
- Touch-friendly: Adequate padding and spacing for mobile interaction

### Test Strategy

Playwright E2E tests in `tests/e2e/component_predictive_card.spec.ts`:
1. Mount component with active prediction (all three shift directions)
2. Mount component with inactive prediction
3. Mount component with null prediction (skeleton)
4. Verify mobile viewport rendering (≤640px)

Tests will use a minimal test page that renders the component with mock data, as per existing E2E patterns in the project.
