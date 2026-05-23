# Design - test_integration_predictive_alerts_flow (Feature ID: 19)

## Affected Files

- [NEW] `tests/integration/predictive_alerts_flow.test.ts`: Integration tests validating alert rendering states across both service metrics and component models.

## Architecture & Data Flow

This is a pure integration test that validates the contract between the `PredictionService` (F17) and `PredictiveCardComponent` (F18). The test exercises the full flow from data input to rendered output without mocking the service or component.

```mermaid
graph TD
    TestData[Mock Transaction Records<br/>spanning < 30 days] --> PredictService[PredictionService.predict]
    PredictService --> PredictionResult[PredictionResult<br/>status: "inactive"]
    PredictionResult --> RenderComponent[PredictiveCardComponent render]
    RenderComponent --> InactiveCard[Inactive Card Rendered<br/>No active alert elements]
```

## Public Interfaces Under Test

### PredictionService
```typescript
// From src/backend/types/models.type.ts
interface TransactionRecord {
  id: string;
  phone_number: string;
  amount: number;
  created_at: string;
}

interface PredictionResult {
  status: "active" | "inactive";
  dataSpanDays: number;
  weekVisits: WeekVisitCount[];
  weekendRatios: WeekendRatio[];
  projectedWeekendShift: "increasing" | "decreasing" | "stable";
}

// From src/backend/services/prediction.service.ts
export class PredictionService {
  static predict(transactions: TransactionRecord[]): PredictionResult;
}
```

### PredictiveCardComponent
```typescript
// From src/components/dashboard/predictive-card.component.tsx
export interface PredictiveCardProps {
  prediction: PredictionResult | null;
}

export function PredictiveCardComponent({ prediction }: PredictiveCardProps): JSX.Element;
```

## Component Render States

The `PredictiveCardComponent` has three render states:

1. **Skeleton** (`prediction === null || prediction === undefined`):
   - Renders with `data-testid="predictive-card-skeleton"`
   - No predictive content shown

2. **Inactive** (`prediction.status === "inactive"`):
   - Renders with `data-testid="predictive-card-inactive"`
   - Shows "Insufficient historical data" message
   - Does NOT render `data-testid="predictive-card-active"`

3. **Active** (`prediction.status === "active"`):
   - Renders with `data-testid="predictive-card-active"`
   - Shows shift direction badge
   - Contains `data-testid="shift-badge"` and `data-testid="latest-trend"`

## Test Scenarios

### Scenario 1: Short Data Span (< 30 days) → No Active Alert
- Input: Transaction records spanning 19 days
- Expected `PredictionService.predict()`: `{ status: "inactive", dataSpanDays: 19, ... }`
- Expected component render: Inactive card with NO active card elements

### Scenario 2: Exact Boundary (30 days) → Active Alert
- Input: Transaction records spanning exactly 30 days
- Expected `PredictionService.predict()`: `{ status: "active", dataSpanDays: 30, ... }`
- Expected component render: Active card with shift badge

### Scenario 3: Null Prediction → Skeleton
- Input: `null` prediction prop
- Expected component render: Skeleton with `data-testid="predictive-card-skeleton"`

## Next.js Docs Consulted

- No Next.js-specific documentation was needed since this is a pure integration test file with no routing, server component, or rendering concerns. The test validates the contract between existing backend service and frontend component following the patterns established in `tests/integration/service_predictive_alerts.integration.test.ts` and `tests/e2e/component_predictive_card.spec.ts` (E2E).

## Decisions & Alternatives

- **Integration vs Unit Testing**: This test validates the integration between two already-tested units (F17 service tests and F18 E2E tests). It ensures the contract is maintained and no regression occurs when the service output format changes.

- **No Mocking**: The test uses actual implementations of `PredictionService` and `PredictiveCardComponent` to catch integration issues that mocks would hide. This follows the pattern established by other integration tests in the project.

- **Rejected Alternative - E2E Test**: An E2E Playwright test could also verify this flow, but F18 E2E already covers component rendering with mocked service. F19 integration test complements by verifying the actual service-to-component contract with real data.

- **Data-Testids for Verification**: The component uses `data-testid` attributes specifically for test verification (e.g., `predictive-card-active`, `predictive-card-inactive`, `predictive-card-skeleton`). This is a standard practice established in the project.