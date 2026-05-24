# Design - api_promotions_segments_route (Feature ID: 22)

## Affected Files

- [NEW] `src/app/api/v1/promotions/segments/route.ts`: Exposes the HTTP GET App Router endpoint.
- [NEW] `tests/integration/api_promotions_segments_route.test.ts`: Integration tests to verify controller delegation, HTTP status mapping, and unexpected error fallback.

## Architecture & Data Flow

Following Next.js App Router conventions and the established pasamanos pattern from F12 (`api_traffic_metrics_route`):

```mermaid
graph TD
    Client[Client GET /api/v1/promotions/segments] --> RouteHandler[App Router GET Handler]
    RouteHandler -->|logger.info| Log[Logs invocation]
    RouteHandler --> PromotionsController[PromotionsController.getSegments]
    PromotionsController -->|success: true| Success200[NextResponse.json HTTP 200]
    PromotionsController -->|success: false| ErrorStatus[NextResponse.json result.status || 500]
    RouteHandler -->|unexpected throw| Catch[logger.error + HTTP 500 fallback]
```

- Incoming `GET` requests to `/api/v1/promotions/segments` are processed by the handler.
- No request body or query parameter parsing is required (GET method with zero-parameter controller).
- The handler delegates directly to `PromotionsController.getSegments()`.
- The controller's `result.success` flag determines success (200) vs error (controller's `result.status` or 500).

## Pasamanos Pattern

The route file follows the exact pasamanos pattern established in existing routes:

```typescript
import { NextResponse } from "next/server";
import { PromotionsController } from "../../../../../backend/controllers/promotions.controller";
import { logger } from "../../../../../backend/utils/logger.utils";

export async function GET() {
  logger.info("GET /api/v1/promotions/segments API route invoked");
  try {
    const result = await PromotionsController.getSegments();
    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 500 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Unexpected error in GET /api/v1/promotions/segments", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
```

### Key Differences from F12 (api_traffic_metrics_route)

While following the same thin pasamanos pattern, this feature adds a defensive `try/catch` wrapper (R6). This handles the rare case where `PromotionsController.getSegments()` throws an unexpected exception not caught by the controller's own error handling — for example, a module-level initialization failure or runtime error during async resolution. The existing F12 route chose not to include this because `TrafficController.getMetrics()` did not require it; this spec adds it for defense-in-depth given the fresh controller code.

## Error Handling

| Scenario | HTTP Status | Response Shape |
|---|---|---|
| Controller returns `{ success: true, data: ... }` | 200 | Full controller payload |
| Controller returns `{ success: false, status: N, error: "..." }` | `result.status` (or 500) | Full controller payload |
| Route-level unexpected exception | 500 | `{ success: false, error: "INTERNAL_SERVER_ERROR" }` |

## Next.js Guides Consulted

- Route Handlers: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` — confirms GET handler export convention and `NextResponse.json` usage.
- Project Structure: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` — confirms `route.ts` file placement under nested route segments.

## Rejected Alternatives

- **Alternative 1: Import from `promotions.controller.ts` directly without try/catch**: Rejected because following F12's no-try-catch pattern would leave a gap: if `PromotionsController.getSegments()` fails synchronously or throws an unexpected error, the Next.js route handler would crash with an unhandled promise rejection instead of returning a structured JSON error. The try/catch adds minimal overhead for significant reliability gain.
- **Alternative 2: Inline the controller logic directly in the route**: Rejected because it violates the Decoupled MVC architecture documented in `docs/architecture.md`. The route must remain a thin pasamanos that delegates to the controller layer.
