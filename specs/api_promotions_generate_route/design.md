# Design - api_promotions_generate_route (Feature ID: 25)

## Affected Files

- [NEW] `src/app/api/v1/promotions/generate/route.ts`: Exposes the HTTP GET App Router endpoint.
- [NEW] `tests/integration/api_promotions_generate_route.test.ts`: Integration tests to verify controller delegation, HTTP status mapping, and unexpected error fallback.

## Architecture & Data Flow

Following Next.js App Router conventions and the established pasamanos pattern from F22 (`api_promotions_segments_route`):

```mermaid
graph TD
    Client[Client GET /api/v1/promotions/generate] --> RouteHandler[App Router GET Handler]
    RouteHandler -->|logger.info| Log[Logs invocation]
    RouteHandler --> PromotionsController[PromotionsController.generate]
    PromotionsController -->|success: true data.campaigns| Success200[NextResponse.json HTTP 200]
    PromotionsController -->|success: false status error| ErrorStatus[NextResponse.json result.status || 500]
    RouteHandler -->|unexpected throw| Catch[logger.error + HTTP 500 fallback]
```

- Incoming `GET` requests to `/api/v1/promotions/generate` are processed by the handler.
- No request body or query parameter parsing is required (GET method with zero-parameter controller).
- The handler delegates directly to `PromotionsController.generate()`.
- The controller's `result.success` flag determines success (200) vs error (controller's `result.status` or 500).
- On success, the response body contains `{ success: true, data: { campaigns: GeminiRecoveryPromptResult[] } }`.
- On controller error, possible error strings include `"DB_CONNECTION_FAILURE"` or generic error messages.

## HTTP Method Choice: GET vs POST

The `generate()` controller performs a read/compute operation (it fetches segments, invokes AI, and returns generated copy) without creating persistent records or mutating server state. GET is semantically correct and aligns with the established F22 pattern for promotions API routes.

## Pasamanos Pattern

The route file follows the exact pasamanos pattern established in F22:

```typescript
import { NextResponse } from "next/server";
import { PromotionsController } from "../../../../../backend/controllers/promotions.controller";
import { logger } from "../../../../../backend/utils/logger.utils";

export async function GET() {
  logger.info("GET /api/v1/promotions/generate API route invoked");
  try {
    const result = await PromotionsController.generate();
    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 500 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Unexpected error in GET /api/v1/promotions/generate", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
```

### Import Path

The relative import path `../../../../../backend/controllers/promotions.controller.ts` is calculated from the route file depth at `src/app/api/v1/promotions/generate/route.ts` — four directory levels up to reach `src/`, then into `backend/`.

## Error Handling

| Scenario | HTTP Status | Response Shape |
|---|---|---|
| Controller returns `{ success: true, data: { campaigns: [...] } }` | 200 | Full controller payload |
| Controller returns `{ success: false, status: N, error: "..." }` | `result.status` (or 500) | Full controller payload |
| Route-level unexpected exception | 500 | `{ success: false, error: "INTERNAL_SERVER_ERROR" }` |

## Next.js Guides Consulted

- Route Handlers: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` — confirms GET handler export convention and `NextResponse.json` usage.
- Project Structure: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` — confirms `route.ts` file placement under nested route segments.

## Rejected Alternatives

- **Alternative 1: Use POST instead of GET**: Rejected because `PromotionsController.generate()` is a read/compute operation that does not mutate server state. GET better reflects idempotent, safe semantics and maintains consistency with the F22 pattern. If future requirements demand persistence (e.g., saving generated campaigns to DB), a POST route could be added alongside this GET pasamanos.
- **Alternative 2: Inline the controller logic directly in the route**: Rejected because it violates the Decoupled MVC architecture documented in `docs/architecture.md`. The route must remain a thin pasamanos that delegates to the controller layer.
