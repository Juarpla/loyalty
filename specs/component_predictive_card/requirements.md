# Requirements: Dashboard Predictive Alert UI Card Component

## Context

Feature 1 of Story 1.3: Predictive week alert (if history > 30 days). The `PredictionService` (feature 17, already implemented) computes week-over-week visit ratios and returns a `PredictionResult` with status `active` or `inactive`, along with a `projectedWeekendShift` value of `increasing`, `decreasing`, or `stable`. This component renders the visual alert card on the manager's dashboard.

## Requirements

### R1: Active Prediction Card Rendering
WHEN the component receives a `PredictionResult` with `status: "active"`, THEN it SHALL render a card displaying:
- The data span in days
- The projected weekend shift direction (`increasing`, `decreasing`, or `stable`)
- A human-readable prediction summary text derived from the shift direction

### R2: Inactive Prediction State
WHEN the component receives a `PredictionResult` with `status: "inactive"`, THEN it SHALL render a muted card indicating that insufficient historical data is available for predictions, showing the current data span in days.

### R3: No Data State
WHEN the component receives `null` or `undefined` as the prediction prop, THEN it SHALL render a skeleton loading state.

### R4: Mobile-First Responsiveness
WHEN the component is rendered on a mobile viewport (≤640px), THEN all card elements SHALL fit within the viewport width without horizontal scrolling and text SHALL remain legible at the minimum font size defined by the project conventions.

### R5: Visual Shift Indicators
WHEN the `projectedWeekendShift` is `increasing`, THEN the card SHALL display a green/positive visual indicator. WHEN the shift is `decreasing`, THEN the card SHALL display a red/negative visual indicator. WHEN the shift is `stable`, THEN the card SHALL display a neutral/amber visual indicator.

### R6: E2E Verification
Playwright E2E tests in `tests/e2e/component_predictive_card.spec.ts` SHALL verify that:
- The card renders correctly with an active prediction
- The card renders correctly with an inactive prediction
- Card elements fit properly on mobile screen viewports
