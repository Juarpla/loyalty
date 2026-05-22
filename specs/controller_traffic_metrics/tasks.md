# Tasks - controller_traffic_metrics (Feature ID: 11)

- [x] **T1**: Create the controller file `src/backend/controllers/traffic.controller.ts` with `getMetrics` method that fetches transactions via `SalesModel.getAllTransactions`, invokes `TrafficService.computeDistribution`, and returns formatted JSON responses. Covers: R1, R2, R3, R4, R5.
- [x] **T2**: Create the integration test suite in `tests/integration/controller_traffic_metrics.test.ts` using Vitest to assert success payload layouts, error mapping for DB connection failures, and general exception handling. Covers: R6.
- [x] **T3**: Verify using `./init.sh --quick` and `./init.sh` that everything is compiling, linters are green, and all integration tests pass cleanly.