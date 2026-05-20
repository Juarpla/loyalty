# Requirements - model_sales_insert (Feature ID: 2)

- **R1**: WHEN a sales transaction is inserted, the model SHALL save the record into the `sales_transactions` table in Supabase with the provided `phone_number` and `amount`.
- **R2**: WHEN the database successfully writes the transaction, the model SHALL return a `SalesTransaction` object containing: `id` (uuid), `phone_number` (text), `amount` (numeric), and `created_at` (timestamp with timezone).
- **R3**: IF the database returns a connection failure or network error, THEN the insert method SHALL bubble up a descriptive database error code (e.g. `'DB_CONNECTION_FAILURE'`).
- **R4**: IF the model is running in offline/simulation mode (i.e. Supabase credentials are not initialized), THEN the model SHALL return a successfully generated mock transaction record simulating the write operation.
