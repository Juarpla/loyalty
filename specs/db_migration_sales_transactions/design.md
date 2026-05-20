# Design

## Affected Files
- `supabase/migrations/[timestamp]_create_sales_transactions.sql`: Raw SQL migration script to create the table and index.
- `tests/integration/db_migration_sales.test.ts`: Integration test to assert the schema and constraints.

## Architecture & Data Flow
This feature sets up the lowest-level database schema in Supabase. It does not introduce any Next.js routes, controllers, or models yet. The integration tests will connect to the local Supabase instance to verify table creation and indexing.

## Decisions & Alternatives
- **Primary Key**: `id` as `uuid` rather than auto-incrementing integer to avoid enumeration and ensure global uniqueness, which is best practice in Supabase.
- **Index**: A B-Tree index on `phone_number` is chosen over Hash because B-Tree is the PostgreSQL default and perfectly sufficient for equality lookups.
