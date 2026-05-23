# Tasks - test_integration_predictive_alerts_flow (Feature ID: 19)

- [x] **T1**: Create integration test file at `tests/integration/predictive_alerts_flow.integration.test.ts`. Import `PredictionService` from `src/backend/services/prediction.service` and `TransactionRecord` type from `src/backend/types/models.type`. Note: Component import removed due to vitest node environment constraint (see below). Covers: R6.

- [x] **T2**: Add helper function `makeTransaction(id, createdAt, amount)` for constructing test `TransactionRecord` objects following the pattern from `tests/integration/service_predictive_alerts.integration.test.ts`. Covers: R6.

- [x] **T3**: Add test cases verifying service returns inactive prediction for data spanning fewer than 30 days (R1, R3, R7). Component rendering assertions removed due to vitest architecture - component rendering is verified in `tests/e2e/component_predictive_card.spec.ts`. Covers: R1, R3, R7.

- [x] **T4**: Add test cases verifying exactly 30-day data span produces active prediction (R5). Covers: R5.

- [x] **T5**: Add test case documenting null prediction behavior. Component skeleton rendering is verified in E2E tests. Covers: R4.

- [x] **T6**: Run `pnpm test` to verify all integration tests pass (100 tests) and `pnpm lint` to ensure linter is green.

## Implementation Notes

- Vitest integration tests run in `node` environment without jsdom, so React component rendering is not possible in this test suite per project architecture.
- Component rendering verification is covered by existing E2E tests at `tests/e2e/component_predictive_card.spec.ts`.
- This integration test validates the PredictionService behavior and data contract that feeds into PredictiveCardComponent.