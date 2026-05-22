# Tasks - hook_manager_traffic (Feature ID: 13)

- [x] **T1**: Rewrite `src/hooks/use-traffic.hook.ts` to call `GET /api/v1/sales/metrics`, return `TrafficDistribution | null` as `data`, and expose `loading`, `error`, and `refresh`. Covers: R1, R2, R3, R4, R5, R6, R7.
- [x] **T2**: Create `tests/integration/hook-manager-traffic.integration.test.ts` with `// @vitest-environment jsdom`, mocked `fetch`, and cases: auto-fetch on mount (R2/R3), success caching (R4), error response (R5), network failure (R6), refresh callback (R7). Covers: R1–R8.
- [x] **T3**: Run `./init.sh --quick` and `./init.sh`; confirm all integration tests pass and lint is green. Covers: all requirements.
