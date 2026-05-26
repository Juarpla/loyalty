# Tasks

- [x] T1 - Generate a new Supabase migration file to create the `clients` and `wifi_logins` tables with their respective columns, constraints, and indexes. Covers: R1, R2, R3, R4.
- [x] T2 - Implement integration tests in `tests/integration/db_migration_captive.test.ts` to assert the existence of the tables, the foreign key on `client_id`, and the unique/B-Tree index on `phone_number`. Covers: R5.
