# Design

## Affected Areas
- `supabase/migrations/<timestamp>_captive_portal_schema.sql` (or similar new migration file)
- `tests/integration/db_migration_captive.test.ts`

## Database Schema Design

### `clients` Table
- `id`: UUID (Primary Key, default `uuid_generate_v4()`)
- `phone_number`: TEXT (Unique, Indexed B-Tree)
- `name`: TEXT
- `created_at`: TIMESTAMPTZ (Default `now()`)

### `wifi_logins` Table
- `id`: UUID (Primary Key, default `uuid_generate_v4()`)
- `client_id`: UUID (Foreign Key references `clients.id` ON DELETE CASCADE)
- `created_at`: TIMESTAMPTZ (Default `now()`)

## Data Flow
- Supabase migrations will execute the DDL statements to create the tables.
- A one-to-many relationship exists between `clients` and `wifi_logins`.
- The `phone_number` is indexed to optimize lookup times when checking returning visitors upon future portal logins.

## Rejected Alternatives
- **Flat Table Architecture**: Storing login counts as an integer within the `clients` table without a separate logins table. Rejected because we need to log specific timestamps for each WiFi login event to verify historical visit aggregates, peak hours, and the 10th visit milestone reliably. A separate event log table is required.
