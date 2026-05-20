# Requirements - model_sales_query (Feature ID: 3)

- **R1**: WHEN a phone number is queried, the model SHALL calculate cumulative transaction count and average ticket size based on the matching records in `sales_transactions` table in Supabase.
- **R2**: IF no transactions are found for the phone number, THEN the model SHALL return zero counts and zero average ticket.
- **R3**: IF the database returns a connection failure or network error, THEN the query method SHALL bubble up a descriptive database error code (e.g. `'DB_CONNECTION_FAILURE'`).
- **R4**: IF the model is running in offline/simulation mode (i.e. Supabase credentials are not initialized), THEN the model SHALL return successfully generated mock sales aggregation simulating the database read.
