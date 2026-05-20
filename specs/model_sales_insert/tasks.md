# Tasks - model_sales_insert (Feature ID: 2)

- [x] **T1**: Install `@supabase/supabase-js` to project dependencies. Covers: Design.
- [x] **T2**: Define `SalesTransaction` type in `src/backend/types/models.type.ts`. Covers: R2.
- [x] **T3**: Update `src/backend/models/supabase.model.ts` to instantiate and expose the real `@supabase/supabase-js` client when credentials are present. Covers: R4.
- [x] **T4**: Implement `SalesModel` class and `insertTransaction` method in `src/backend/models/sales.model.ts`. Covers: R1, R2, R3, R4.
- [x] **T5**: Create integration tests in `tests/integration/model-sales-write.integration.test.ts` to assert successful DB writes, offline simulation fallback, and connection failure handling. Covers: R1, R2, R3, R4.
