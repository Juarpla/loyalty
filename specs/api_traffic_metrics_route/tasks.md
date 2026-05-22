# Tasks - api_traffic_metrics_route (Feature ID: 12)

- [x] **T1**: Create Next.js App Router API route `src/app/api/v1/sales/metrics/route.ts` with GET handler delegating to `TrafficController.getMetrics` and mapping the result to `NextResponse.json` with appropriate status codes. Covers: R1, R2, R3, R4.
- [x] **T2**: Create the integration test suite in `tests/integration/api_traffic_metrics_route.test.ts` using Vitest to verify GET endpoint routing, 200 success response headers, and controller error status mapping. Covers: R1, R3, R4, R5.
- [x] **T3**: Verify using `./init.sh --quick` and `./init.sh` that everything compiles, all integration tests pass successfully, and linters are green.
