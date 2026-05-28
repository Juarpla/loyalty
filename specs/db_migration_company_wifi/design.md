# Design

## Affected Areas
- `supabase/migrations/<timestamp>_company_wifi_schema.sql` (or similar new migration file)
- `tests/integration/db_migration_company_wifi.test.ts`

## Database Schema Design

### `companies` Table
- `id`: UUID (Primary Key, default `uuid_generate_v4()`)
- `name`: TEXT (Not Null)
- `created_at`: TIMESTAMPTZ (Default `now()`)

### `company_wifi_settings` Table
- `id`: UUID (Primary Key, default `uuid_generate_v4()`)
- `company_id`: UUID (Unique, Not Null, Foreign Key references `companies.id` ON DELETE CASCADE)
- `ssid`: TEXT (Not Null)
- `wifi_password`: TEXT (Not Null)
- `welcome_title`: TEXT (Not Null, Default `'Welcome to our WiFi'`)
- `welcome_message`: TEXT (Not Null, Default `'Please sign in to connect'`)
- `brand_color`: TEXT (Not Null, Default `'#000000'`)
- `created_at`: TIMESTAMPTZ (Default `now()`)

## Data Flow
- Supabase migrations will execute the DDL statements to create the tables.
- A one-to-one relationship exists between `companies` and `company_wifi_settings` enforced via a UNIQUE constraint/index on `company_wifi_settings.company_id`.
- This schema enables multi-tenant dynamic WiFi landing portals.

## Consulted Documentation
- Next.js project conventions and structure.

## Rejected Alternatives
- **Single Table Architecture**: Storing WiFi settings directly inside the `companies` table. Rejected because branding properties and network connection details represent a distinct subdomain of WiFi configurations that can grow independently (e.g., adding login options, landing page options, or multiple locations per company in the future) and should be decoupled from core company tenant details.
