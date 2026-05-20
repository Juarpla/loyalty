# Implementation Handoff: model_sales_query

## Summary
Successfully implemented the sales aggregate query layer (`SalesModel.getSalesAggregate`) inside `src/backend/models/sales.model.ts` connecting to Supabase. This method aggregates a client's transaction history to compute visit counts and average ticket sizes, handles offline/simulation mode fallback, and accurately maps network connection failures to `'DB_CONNECTION_FAILURE'`.

## Changed Areas
- **Backend Types**: Added the `SalesAggregate` type interface in `src/backend/types/models.type.ts` to represent customer transaction aggregates.
- **Model DAO**: Implemented `SalesModel.getSalesAggregate(phoneNumber)` in `src/backend/models/sales.model.ts` with offline simulation fallback, postgrest retrieval, average ticket arithmetic, and error handling.
- **Tests**: Created comprehensive integration tests in `tests/integration/model-sales-read.integration.test.ts` ensuring full coverage of calculations, zero falls, unreachable db simulation (by mocking client `from` method to avoid GET undici timeout loop), and offline simulation.

## Commands & Verification Evidence
- `pnpm test` executed successfully with all 9 integration tests fully green (including smoke, migration, write, and the 4 new read model tests).
- `eslint` passed with 0 errors/warnings.
- `./init.sh --quick` passed with 0 failures.

## Traceability
- **R1** -> `tests/integration/model-sales-read.integration.test.ts` ("R1: should successfully calculate cumulative transaction count and average ticket size when connected")
- **R2** -> `tests/integration/model-sales-read.integration.test.ts` ("R2: should return zero count and zero average ticket when no transactions exist for the phone number")
- **R3** -> `tests/integration/model-sales-read.integration.test.ts` ("R3: should bubble up 'DB_CONNECTION_FAILURE' when database is unreachable")
- **R4** -> `tests/integration/model-sales-read.integration.test.ts` ("R4: should return successfully generated mock aggregation in offline/simulation mode")

## E2E Gate
- **Decision**: Skipped.
- **Justification**: This is a backend-only database query layer. No user interfaces, custom React hooks, or HTTP routes exist yet to be end-to-end tested. E2E Playwright tests will be created when the cashier/customer UI components are implemented in later features.
