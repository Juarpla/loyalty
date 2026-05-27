# Requirements - hook_manager_arrivals (Feature ID: 55)

Feature 55 adds the manager-facing arrivals state hook for F4 Story 4.2: scanned QR generates a `wa.me` greeting alert. Features 52-54 already provide the arrival notification service, controller, and `GET /api/v1/arrivals/notifications` route. This feature keeps arrival feed network orchestration out of UI components.

## Requirements

- **R1 (Ubiquitous):** The system MUST expose a `useArrivals()` custom hook from `src/hooks/use-arrivals.hook.ts` with reactive `notifications`, `summary`, `loading`, `error`, and `refresh` values.

- **R2 (Event-driven):** WHEN the hook is mounted, the system MUST automatically issue a `GET` request to `/api/v1/arrivals/notifications`.

- **R3 (State-driven):** WHILE an arrival notification request is in flight, the system MUST keep `loading` set to `true` until the request settles.

- **R4 (Event-driven):** WHEN the API responds with HTTP 200 and `{ success: true, data: { notifications, summary } }`, the system MUST store the returned `notifications` and `summary`, clear `error`, and set `loading` to `false`.

- **R5 (Unwanted behavior):** IF the API responds with a non-200 status or `{ success: false, error: string }`, THEN the system MUST store a descriptive `error`, clear `notifications` to an empty array, clear `summary` to `null`, and set `loading` to `false`.

- **R6 (Unwanted behavior):** IF the fetch operation throws, THEN the system MUST store a generic arrival-feed error message, clear `notifications` to an empty array, clear `summary` to `null`, and set `loading` to `false`.

- **R7 (Event-driven):** WHEN `refresh()` is invoked, the system MUST re-fetch `/api/v1/arrivals/notifications` using the same loading, success, and error lifecycle as the automatic fetch.

- **R8 (Ubiquitous):** Integration tests in `tests/integration/hook-manager-arrivals.integration.test.ts` MUST verify initial state, automatic fetch behavior, success state updates, controlled API error handling, network error handling, and manual refresh behavior.

## Verification Mapping

- **R1:** Assert the hook return shape before the auto-fetch settles.
- **R2:** Mock `fetch`, render the hook, and assert `/api/v1/arrivals/notifications` is requested.
- **R3:** Assert `loading` starts as `true` and becomes `false` after success or failure.
- **R4:** Mock a successful arrival payload and assert notifications, summary, cleared error, and settled loading.
- **R5:** Mock non-200 and success-false responses and assert error state with cleared data.
- **R6:** Mock a rejected fetch and assert the generic error state with cleared data.
- **R7:** Invoke `refresh()` and assert a second fetch updates the hook state.
- **R8:** Confirm all above cases are covered in the integration test file.
