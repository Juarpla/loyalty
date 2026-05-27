# Tasks - hook_manager_arrivals (Feature ID: 55)

- [x] **T1:** Create `src/hooks/use-arrivals.hook.ts` with `"use client"`, type-only arrival imports, the `UseArrivalsResult` interface, initial state, and exported `useArrivals()` hook. Covers: R1.

- [x] **T2:** Implement automatic `GET /api/v1/arrivals/notifications` fetching on mount with loading lifecycle management. Covers: R2, R3.

- [x] **T3:** Implement successful response handling that stores `notifications` and `summary`, clears `error`, and settles loading. Covers: R4.

- [x] **T4:** Implement controlled API error and fetch exception handling that sets an error message, clears arrival data, and settles loading. Covers: R5, R6.

- [x] **T5:** Expose `refresh()` as a stable callback that reuses the same fetch lifecycle and endpoint. Covers: R7.

- [x] **T6:** Add `tests/integration/hook-manager-arrivals.integration.test.ts` covering initial state, automatic fetch, loading lifecycle, success updates, API error responses, network failure, and manual refresh. Covers: R1, R2, R3, R4, R5, R6, R7, R8.
