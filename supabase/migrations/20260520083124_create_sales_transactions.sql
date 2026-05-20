-- Migration: Create sales_transactions table

CREATE TABLE sales_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number text NOT NULL,
    amount numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast lookup by phone number
CREATE INDEX sales_transactions_phone_number_idx ON sales_transactions USING btree (phone_number);
