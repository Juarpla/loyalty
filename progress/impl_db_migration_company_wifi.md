# Feature Implementation: PostgreSQL Migration for Company WiFi Settings Schema (Feature 67)

This document describes the implemented tables, columns, constraints, unique indices, and defaults for multi-company customized WiFi portal schema and the integration tests verifying it.

## 1. Migration Details

A new Supabase schema migration was created at `supabase/migrations/20260528000000_company_wifi_schema.sql` implementing:

### `companies` Table (R1, R2)
- `id`: `UUID` primary key generating values with `uuid_generate_v4()`.
- `name`: `TEXT` non-nullable column.
- `created_at`: `TIMESTAMPTZ` defaulting to the current time (`now()`).

### `company_wifi_settings` Table (R1, R3, R4, R5)
- `id`: `UUID` primary key generating values with `uuid_generate_v4()`.
- `company_id`: `UUID` non-nullable, foreign key referencing `companies.id` with `ON DELETE CASCADE` and a `UNIQUE` index constraint to guarantee a 1-to-1 relationship between a company and its WiFi settings.
- `ssid`: `TEXT` non-nullable column.
- `wifi_password`: `TEXT` non-nullable column.
- `welcome_title`: `TEXT` non-nullable column with a default of `'Welcome to our WiFi'`.
- `welcome_message`: `TEXT` non-nullable column with a default of `'Please sign in to connect'`.
- `brand_color`: `TEXT` non-nullable column with a default of `'#000000'`.
- `created_at`: `TIMESTAMPTZ` defaulting to the current time (`now()`).

## 2. Integration Tests

Integration test files were written to both `tests/integration/db_migration_company_wifi.test.ts` (as specified by R6) and `tests/integration/db_migration_company_wifi.integration.test.ts` (to ensure pick-up by Vitest's custom file matcher) verifying:
1. `companies` table existence and column attributes.
2. `company_wifi_settings` table existence, column attributes, and default branding configurations.
3. The foreign key constraint with cascade deletion rules from `company_wifi_settings.company_id` to `companies.id`.
4. The unique constraint/index on `company_wifi_settings.company_id`.

## 3. Verification Results

All tests pass perfectly:
- `pnpm exec vitest run tests/integration/db_migration_company_wifi.integration.test.ts` is fully green with 4/4 assertions successful.
- `pnpm test` (full project test runner) is fully green with 287/287 tests successful.
- `pnpm db:gen-types` completed successfully and updated `src/backend/types/database.type.ts` with the new `companies` and `company_wifi_settings` tables.
- `pnpm db:lint` completed successfully with no schema errors found.
- `./init.sh` harness run is fully green.

## 4. Traceability

- R1 -> `tests/integration/db_migration_company_wifi.integration.test.ts`: "R1, R2, R6: should create companies table with correct columns and types" and "R1, R3, R6: should create company_wifi_settings table with correct columns, types, and defaults"
- R2 -> `tests/integration/db_migration_company_wifi.integration.test.ts`: "R1, R2, R6: should create companies table with correct columns and types"
- R3 -> `tests/integration/db_migration_company_wifi.integration.test.ts`: "R1, R3, R6: should create company_wifi_settings table with correct columns, types, and defaults"
- R4 -> `tests/integration/db_migration_company_wifi.integration.test.ts`: "R4, R6: should enforce a foreign key reference from company_wifi_settings.company_id to companies.id with ON DELETE CASCADE"
- R5 -> `tests/integration/db_migration_company_wifi.integration.test.ts`: "R5, R6: should enforce a unique index/constraint on company_wifi_settings.company_id column"
- R6 -> `tests/integration/db_migration_company_wifi.integration.test.ts` and `tests/integration/db_migration_company_wifi.test.ts`: integration tests assert table structure, columns, constraints, indexes, and default branding values.

## 5. E2E Gate

Human decision: not required. This feature is a database migration and generated type update only; it does not touch UI, routes, or cross-layer user flows. Playwright E2E tests are not applicable.
