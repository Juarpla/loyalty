# Tasks - model_sales_query (Feature ID: 3)

- [x] **T1**: Define `SalesAggregate` type interface in `src/backend/types/models.type.ts`. Covers: Design, R1, R2, R4.
- [x] **T2**: Implement `getSalesAggregate(phoneNumber)` inside `SalesModel` in `src/backend/models/sales.model.ts` with offline/simulation logic. Covers: R1, R2, R3, R4.
- [x] **T3**: Create integration tests in `tests/integration/model-sales-read.integration.test.ts` to assert aggregate calculations, no transactions cases, database offline mode connection failure bubbling, and offline/simulation mode. Covers: R1, R2, R3, R4.
