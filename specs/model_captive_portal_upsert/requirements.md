# Requirements

- **R1:** WHEN a client registers for the captive portal with a phone number and an optional name, the system MUST upsert the client record in the `clients` table using the `phone_number` as the unique constraint.
- **R2:** IF the client already exists, THEN the system MUST update the `name` if a new one is provided, while preserving the existing `created_at` timestamp.
- **R3:** WHEN the client record is successfully upserted, the system MUST immediately insert a new session log record into the `wifi_logins` table linked via the `client_id`.
- **R4:** IF the database connection fails or the query errors out, THEN the system MUST throw a descriptive error code such as `DB_CONNECTION_FAILURE` or `DB_QUERY_ERROR`.
- **R5:** WHEN operating in `offline_simulation` mode, the system MUST return a simulated successful response containing mock IDs without attempting actual database queries.
