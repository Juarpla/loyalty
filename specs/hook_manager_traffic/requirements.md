# Requirements - hook_manager_traffic (Feature ID: 13)

- **R1**: The hook SHALL expose reactive state for `data` (TrafficDistribution | null), `loading` (boolean), and `error` (string | null), plus a `refresh` callback so UI components can trigger re-fetches without performing network requests directly.
- **R2**: WHEN the hook is mounted, it SHALL automatically issue a GET request to `/api/v1/sales/metrics` and set `loading` to `true` until the fetch settles.
- **R3**: WHILE `loading` is `true`, the hook SHALL keep `loading` at `true` until the fetch settles (success or failure).
- **R4**: IF the API responds with HTTP 200 and `{ success: true, data: <TrafficDistribution> }`, THEN the hook SHALL set `data` to the distribution payload, clear `error`, and set `loading` to `false`.
- **R5**: IF the API responds with a non-200 status or `{ success: false, error: string }`, THEN the hook SHALL set a descriptive `error` string, set `data` to `null`, and set `loading` to `false`.
- **R6**: IF the fetch throws (network failure), THEN the hook SHALL set a generic `error` message, set `data` to `null`, and set `loading` to `false`.
- **R7**: WHEN the `refresh` callback is invoked, the hook SHALL re-fetch from `/api/v1/sales/metrics` with the same loading/error/data lifecycle as the auto-fetch.
- **R8**: Integration tests in `tests/integration/hook_manager_traffic.test.ts` SHALL mock `fetch` responses and assert loading toggles, data caching, error states, and refresh behavior.
