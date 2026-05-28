# Requirements

- **R1**: WHEN querying the DB schema, the system MUST ensure the `companies` table and `company_wifi_settings` table exist.
- **R2**: The system MUST define the `companies` table with `id` (uuid), `name` (text, not null), and `created_at` (timestamp with time zone).
- **R3**: The system MUST define the `company_wifi_settings` table with columns: `id` (uuid), `company_id` (uuid), `ssid` (text, not null), `wifi_password` (text, not null), `welcome_title` (text, not null, default 'Welcome to our WiFi'), `welcome_message` (text, not null, default 'Please sign in to connect'), `brand_color` (text, not null, default '#000000'), and `created_at` (timestamp with time zone).
- **R4**: WHEN metadata is inspected, the system MUST enforce a foreign key reference from `company_wifi_settings.company_id` pointing to the `companies.id` primary key with `ON DELETE CASCADE`.
- **R5**: WHEN metadata is inspected, the system MUST enforce a unique index/constraint on the `company_wifi_settings.company_id` column to guarantee a 1-to-1 relationship between a company and its WiFi settings.
- **R6**: The system MUST include integration tests in `tests/integration/db_migration_company_wifi.test.ts` to assert the schema structure, columns, constraints, indices, and default branding values.
