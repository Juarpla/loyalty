# Requirements - api_promotions_generate_route (Feature ID: 25)

- **R1**: The API route SHALL expose a named `GET` export at `src/app/api/v1/promotions/generate/route.ts` following Next.js App Router conventions.
- **R2**: WHEN the GET handler is invoked, the route SHALL log the invocation via `logger.info`.
- **R3**: The route SHALL delegate to `PromotionsController.generate()` with no request arguments.
- **R4**: IF the controller returns a success payload (`result.success === true`), THEN the route SHALL return a 200 HTTP response containing the full controller payload via `NextResponse.json`.
- **R5**: IF the controller returns an error payload (`result.success === false`), THEN the route SHALL return the controller's JSON payload with the status code from `result.status` (falling back to 500).
- **R6**: IF an unexpected exception is thrown during controller invocation, THEN the route SHALL catch the error, log it via `logger.error`, and return a 500 HTTP response with `{ success: false, error: "INTERNAL_SERVER_ERROR" }`.
- **R7**: Integration tests in `tests/integration/api_promotions_generate_route.test.ts` SHALL assert GET endpoint routing, 200 success response, controller error status mapping, and 500 fallback for unexpected exceptions.
