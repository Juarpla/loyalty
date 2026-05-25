# Tasks - service_low_traffic_detector (Feature ID: 37)

- [x] **T1**: Add the `isLowTrafficDay` static method to the `TrafficService` class in `src/backend/services/traffic.service.ts` implementing: weekday grouping of valid transactions, average daily count calculation, configurable threshold comparison (default 0.5), empty-input guard (returns false), and invalid-timestamp skipping. Covers: R1, R2, R3, R4, R5, R6.

- [x] **T2**: Create integration test suite in `tests/integration/service_low_traffic_detector.test.ts` with test cases verifying:
  - (a) Correctly identifies a low-traffic weekday using mock transaction sets. Covers: R1, R2, R7.
  - (b) Correctly returns `false` for a normal-traffic weekday. Covers: R3, R7.
  - (c) The `threshold` parameter correctly influences the detection decision. Covers: R4, R7.
  - (d) An empty transaction array returns `false`. Covers: R5, R7.
  - (e) Invalid timestamps are silently skipped without throwing. Covers: R6, R7.

- [x] **T3**: Verify using `./init.sh --quick` that the new integration test compiles and passes, and the linter is green.

- [x] **T4**: Run full `./init.sh` to confirm all existing tests still pass and the build succeeds.
