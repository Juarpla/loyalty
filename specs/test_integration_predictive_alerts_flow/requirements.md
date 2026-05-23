# Requirements - test_integration_predictive_alerts_flow (Feature ID: 19)

## Context

Feature 18 (`component_predictive_card`) renders a visual alert card based on the `PredictionResult` from Feature 17 (`service_predictive_alerts`). This integration test validates the end-to-end flow from service metrics to component rendering, specifically ensuring **no active alerts are rendered when the dataset spans fewer than 30 days**.

## Dependencies

- **F17** `service_predictive_alerts`: Already implemented. Provides `PredictionService.predict()` which returns `PredictionResult` with `status: "active" | "inactive"`.
- **F18** `component_predictive_card`: Already implemented. Renders `PredictiveCardComponent` based on prediction prop.

## Requirements

### R1: Service Returns Inactive for Data Spans Under 30 Days
WHEN `PredictionService.predict()` is called with transaction data spanning fewer than 30 days, THEN it SHALL return a `PredictionResult` where `status` equals `"inactive"` and `dataSpanDays` reflects the actual span.

### R2: Component Renders Inactive Card for Inactive Prediction
WHEN `PredictiveCardComponent` receives a `PredictionResult` with `status: "inactive"`, THEN it SHALL render the inactive card variant (not the active alert card), displaying the data span days and an "insufficient data" message.

### R3: No Active Alert Rendered for Short Data Spans
WHEN the prediction status is `"inactive"` due to data spanning fewer than 30 days, THEN no active prediction card elements SHALL be present in the rendered output, specifically:
- No `data-testid="predictive-card-active"` element SHALL exist
- No shift direction badge (`increasing`/`decreasing`/`stable`) SHALL be displayed

### R4: Skeleton State for Null Prediction
WHEN the component receives `null` or `undefined` as the prediction prop, THEN it SHALL render a skeleton loading state with `data-testid="predictive-card-skeleton"`.

### R5: Exact 30-Day Boundary Behavior
WHEN transaction data spans exactly 30 days, THEN the service SHALL return `status: "active"` (not inactive), meaning the predictive alert SHALL be rendered.

### R6: Integration Test File Location
Integration tests verifying these behaviors SHALL be located at `tests/integration/predictive_alerts_flow.test.ts` and SHALL import the actual `PredictionService` and `PredictiveCardComponent` implementations.

### R7: Test Verification of Alert Non-Rendering
The integration test suite SHALL explicitly assert that for data spans under 30 days:
- The prediction status is `"inactive"`
- The rendered component does NOT contain active alert elements