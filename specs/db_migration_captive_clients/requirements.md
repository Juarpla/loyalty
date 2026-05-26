# Requirements

- **R1**: WHEN querying the DB schema, the system MUST ensure the `clients` table and `wifi_logins` table exist.
- **R2**: The system MUST define the `clients` table with `id` (uuid), `phone_number` (text), `name` (text), and `created_at` (timestamp with time zone).
- **R3**: The system MUST define the `wifi_logins` table with `id` (uuid), `client_id` (uuid), and `created_at` (timestamp with time zone).
- **R4**: WHEN metadata is inspected, the system MUST enforce a foreign key reference from `wifi_logins.client_id` pointing to the `clients` primary key.
- **R5**: The system MUST include integration tests in `tests/integration/db_migration_captive.test.ts` to assert schema existence and table column constraints.
