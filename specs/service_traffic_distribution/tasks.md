# Tasks - service_traffic_distribution (Feature ID: 10)

- [x] **T1**: Define `TransactionRecord` and `TrafficDistribution` interfaces in `src/backend/types/models.type.ts`. Covers: Design, R1, R2, R4, R5.
- [x] **T2**: Implement `TrafficService` class with `computeDistribution` static method in `src/backend/services/traffic.service.ts` that builds 24-hour and 7-weekday frequency arrays from transaction timestamps. Covers: R1, R2, R3, R4, R5.
- [x] **T3**: Handle edge cases: invalid timestamps are skipped (R3), empty arrays return zeroed buckets (R4), and peak indices use lowest-index tie-breaking (R5). Covers: R3, R4, R5.
- [x] **T4**: Create integration test suite in `tests/integration/service-traffic-distribution.integration.test.ts` with mocked datasets verifying: normal distribution correctness, empty input returns zeros, invalid timestamps are skipped, and peak hour/weekday identification. Covers: R1, R2, R3, R4, R5, R6.
- [x] **T5**: Verify using `./init.sh --quick` and `./init.sh` that everything compiles, all integration tests pass successfully, and linters are green.
