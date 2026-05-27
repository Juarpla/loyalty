# Tasks - api_arrival_notifications_route (Feature ID: 54)

- [ ] **T1:** Create `src/app/api/v1/arrivals/notifications/route.ts` with a named `GET` handler that logs invocation, delegates to `ArrivalController.getNotifications()` with no arguments, returns success payloads as HTTP 200 JSON, maps controlled error payloads to `result.status || 500`, and catches unexpected exceptions with the stable internal error response. Covers: R1, R2, R3, R4, R5, R6.

- [ ] **T2:** Add `tests/integration/api_arrival_notifications_route.integration.test.ts` to verify the `GET` export, route logging, controller delegation without request arguments, HTTP 200 success mapping, controlled error status propagation, missing-status fallback to 500, and unexpected exception fallback. Covers: R1, R2, R3, R4, R5, R6, R7.

- [ ] **T3:** Run `pnpm test` and full `./init.sh`, documenting verification evidence in the implementation handoff. Covers: R7.
