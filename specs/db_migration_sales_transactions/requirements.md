# Requirements

- **R1**: WHEN querying the DB schema, the `sales_transactions` table MUST exist.
- **R2**: The `sales_transactions` table MUST contain the following columns: `id` (uuid, primary key), `phone_number` (text), `amount` (numeric), and `created_at` (timestamp with time zone).
- **R3**: WHEN indexing metadata is fetched, a B-Tree index MUST exist on the `phone_number` column.
