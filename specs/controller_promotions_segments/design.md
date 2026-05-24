# Design - controller_promotions_segments (Feature ID: 21)

## Affected Files

| Action | File | Reason |
|--------|------|--------|
| NEW | `src/backend/controllers/promotions.controller.ts` | Create `PromotionsController` with static `getSegments` method |
| NEW | `tests/integration/controller_promotions_segments.test.ts` | Integration tests for requirement verification |

## Public Interface

### `PromotionsController.getSegments()`

```typescript
import { ClientModel } from "../models/client.model";
import { logger } from "../utils/logger.utils";
import { CustomerSegmentationResult } from "../types/models.type";

interface ControllerSuccessResponse {
  success: true;
  data: CustomerSegmentationResult;
}

interface ControllerErrorResponse {
  success: false;
  status: number;
  error: string;
}

type ControllerResponse = ControllerSuccessResponse | ControllerErrorResponse;

export class PromotionsController {
  static async getSegments(): Promise<ControllerResponse>;
}
```

The method follows the established static-controller pattern from `SalesController.recordTransaction` and `TrafficController.getMetrics`:
- Static method on a class, no framework coupling
- Logs invocation at the start
- Calls the model layer (`ClientModel.getCustomerSegments()`)
- Returns a uniform response envelope

## Data Flow

```mermaid
graph TD
    A[Caller: API route or page] -->|calls| B[PromotionsController.getSegments]
    B -->|logger.info| C[Log invocation]
    B -->|calls| D[ClientModel.getCustomerSegments]
    D -->|queries| E[Supabase: sales_transactions + clients]
    E --> F[CustomerSegmentationResult]
    F --> B
    B --> G{Success?}
    G -->|Yes| H[{ success: true, data }]
    G -->|No| I{Error type}
    I -->|DB_CONNECTION_FAILURE| J[{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }]
    I -->|Other| K[{ success: false, status: 500, error: <message> }]
```

## Error Handling

- **DB connection failure**: Caught and mapped to `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }`, consistent with `SalesController` and `TrafficController`.
- **Generic exception**: Caught and mapped to `{ success: false, status: 500, error: <message> }`.
- **All errors**: Logged via `logger.error` before returning.
- **Empty result**: Not an error case — the controller passes through the model's result directly, which already handles empty database scenarios (see R9 in feature 20 spec).

## Rejected Alternative: Accepting query parameters

**Alternative**: Have `getSegments` accept optional filter parameters (e.g. `{ segment?: CustomerSegment }`) to allow callers to request only a subset of segments.

**Rejected because**: The acceptance criteria describe this as a simple HTTP coordinator that "aggregates customer profiles by tags." Adding filters at the controller level would require either (a) filtering the already-computed result in-memory (wasted work) or (b) passing filters down to the model (scope creep into model logic). Callers that need filtered views should do so on the client side, or a follow-up feature can add query parameter support. The current spec keeps the controller as a zero-parameter pass-through, matching the existing `TrafficController.getMetrics()` pattern.

## Next.js Docs Consulted

No Next.js framework-specific docs were consulted. This feature is entirely inside the isolated backend layer (`src/backend/controllers/`).
