# Implementation - hook_manager_traffic (Feature ID: 13)

## Summary

Rewrote `src/hooks/use-traffic.hook.ts` to orchestrate traffic analytics fetches from the F12 endpoint `/api/v1/sales/metrics`. The hook auto-fetches on mount, caches `TrafficDistribution` data, exposes loading/error states, and provides a `refresh` callback for manual re-fetches.

## Changed Files

- [UPDATE] `src/hooks/use-traffic.hook.ts` — Rewritten to call `GET /api/v1/sales/metrics`, return `TrafficDistribution | null`, expose `loading`, `error`, `refresh`.
- [NEW] `tests/integration/hook-manager-traffic.integration.test.ts` — 8 integration tests covering all R1–R8 requirements with mocked `fetch` and `jsdom` environment.

## Verification

- `pnpm test`: 9 test files, 42 tests passed (34 existing + 8 new).
- `pnpm lint`: clean.
- `pnpm build`: compiled and built successfully.
- `./init.sh` (full): harness ready.

## Traceability

- R1 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R1: exposes data, loading, error, and refresh"
- R2 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R2, R3: auto-fetches on mount and keeps loading true until settled"
- R3 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R2, R3: auto-fetches on mount and keeps loading true until settled"
- R4 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R4: sets data and clears error on 200 success"
- R5 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R5: sets error and clears data on non-200 response" + "R5: sets error when success is false on 200 response"
- R6 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R6: sets generic error and clears data on network failure"
- R7 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R7: refresh re-fetches and updates state"
- R8 → `tests/integration/hook-manager-traffic.integration.test.ts`: "R8: all states are testable via mocked fetch"

## E2E gate

This change touches only a single frontend hook and its integration tests — no UI components, pages, or backend layers. E2E tests are not required. F14 (component_traffic_charts) and F15 (page_manager_reports) will cover UI rendering via Playwright.

Human decision: no — single-layer hook change, E2E reserved for F14–F16.
