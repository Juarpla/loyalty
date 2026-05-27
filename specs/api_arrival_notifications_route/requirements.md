# Requirements - api_arrival_notifications_route (Feature ID: 54)

## Context

Feature 54 adds the App Router pasamanos endpoint for F4 Story 4.2: scanned QR generates a `wa.me` greeting alert. Feature 53 already provides `ArrivalController.getNotifications()` with the controller response envelope, enriched notification data, summary metrics, and controller-level database error mapping. This feature only exposes that controller through `GET /api/v1/arrivals/notifications`.

## Requirements

- **R1 (Ubiquitous):** The system MUST expose a named `GET` route handler from `src/app/api/v1/arrivals/notifications/route.ts` following Next.js App Router route conventions.

- **R2 (Event-driven):** WHEN `GET /api/v1/arrivals/notifications` is invoked, the system MUST log the route invocation through the shared backend logger.

- **R3 (Event-driven):** WHEN the GET handler runs, the system MUST delegate to `ArrivalController.getNotifications()` without parsing request body data.

- **R4 (Event-driven):** WHEN `ArrivalController.getNotifications()` returns a success payload, the system MUST return HTTP 200 with the full controller payload as JSON.

- **R5 (Unwanted behavior):** IF `ArrivalController.getNotifications()` returns an error payload, THEN the system MUST return the full controller payload as JSON using `result.status` or 500 when status is absent.

- **R6 (Unwanted behavior):** IF the controller invocation throws an unexpected exception, THEN the system MUST log the exception and return HTTP 500 with `{ success: false, error: "INTERNAL_SERVER_ERROR" }`.

- **R7 (Ubiquitous):** Integration tests in `tests/integration/api_arrival_notifications_route.integration.test.ts` MUST verify route delegation, success status mapping, controller error status mapping, and unexpected exception fallback behavior.

## Verification Map

- **R1:** Import the route module in the integration test and assert a callable named `GET` export exists.
- **R2:** Spy on `logger.info` and assert the GET route invocation is logged.
- **R3:** Spy on `ArrivalController.getNotifications` and assert it is called exactly once with no arguments.
- **R4:** Mock a successful controller response and assert HTTP 200 plus the unchanged JSON body.
- **R5:** Mock controller error responses with and without `status` and assert HTTP status mapping to `result.status` or 500.
- **R6:** Mock a thrown controller exception and assert `logger.error`, HTTP 500, and the stable fallback body.
- **R7:** Run `pnpm test` and the full `./init.sh` verification gate.
