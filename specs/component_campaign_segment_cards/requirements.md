# Requirements: Campaign Segment Cards UI Component

## Context

Feature 27 of Story 2.2 (Inactive 30 days prompt recovery draft using Gemini). The `useCampaigns` hook (feature 26) provides `CustomerSegmentationResult` data from `GET /api/v1/promotions/segments`. This component renders visual cards for each customer segment (inactive_30d, high_spender, frequent), with counts and action trigger buttons, in a touch-friendly responsive layout.

## Requirements

### R1: Segment Card Rendering
WHEN the component receives a `CustomerSegmentationResult` with non-zero segment counts, THEN it SHALL render a card for each segment that has a count > 0, displaying the segment name, the customer count, and an action trigger button.

### R2: Segment Type Presentation
WHERE a segment is `inactive_30d`, the card SHALL display the label "Inactive 30 Days". WHERE a segment is `high_spender`, the card SHALL display the label "High Spender". WHERE a segment is `frequent`, the card SHALL display the label "Frequent". Each card SHALL include a visual indicator distinct to its segment type.

### R3: Loading State
WHILE `segmentsLoading` is `true`, the component SHALL render skeleton placeholder cards (pulse animation) matching the card count and layout of the populated state, without rendering actual segment data.

### R4: Error State
WHEN `segmentsError` is a non-null string, the component SHALL render an error banner with the error message and a "Retry" button that re-triggers data fetch.

### R5: Empty State
WHEN the segments data has loaded successfully but all segment counts are zero (`summary` values are all 0), the component SHALL render a neutral empty-state message indicating no customer segments are available.

### R6: Action Trigger Button
WHEN a user clicks or taps the action trigger button on a segment card, the component SHALL invoke the `onSegmentSelect` callback with the segment type string as argument.

### R7: Touch-Friendly Responsive Layout
WHEN the component is rendered on a mobile viewport (≤640px), THEN segment cards SHALL stack vertically, fill the viewport width without horizontal scrolling, and have tappable areas at least 44x44px. WHEN rendered on larger viewports (>640px), cards SHALL display in a multi-column grid.

### R8: E2E Verification
Playwright E2E tests in `tests/e2e/component_campaign_segment_cards.spec.ts` SHALL verify:
- The component renders segment cards with correct labels and counts
- The loading state renders skeleton placeholders
- The error state renders the error message and retry button
- The empty state renders the empty message
- Card layout adapts correctly on mobile viewport (375px width)
- Action trigger button invokes the callback with correct segment type
