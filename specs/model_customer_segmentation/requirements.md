# Requirements - model_customer_segmentation (Feature ID: 20)

- **R1**: WHEN `ClientModel.getCustomerSegments` is invoked, the model SHALL query the `sales_transactions` table and compute per-customer aggregate metrics (visit_count, average_ticket, last_transaction_date).
- **R2**: WHEN the per-customer aggregates are computed, the model SHALL assign exactly one segment tag per customer using the following priority: `inactive_30d` takes precedence over `frequent`, which takes precedence over `high_spender`.
- **R3**: IF a customer has no transactions in the `sales_transactions` table, THEN the model SHALL tag that customer as `inactive_30d`.
- **R4**: IF a customer's most recent transaction date is more than 30 days before the current date, THEN the model SHALL tag that customer as `inactive_30d`.
- **R5**: IF a customer is not tagged `inactive_30d` and has a visit_count greater than or equal to the `FREQUENT_VISIT_COUNT` threshold (default 5), THEN the model SHALL tag that customer as `frequent`.
- **R6**: IF a customer is not tagged `inactive_30d` or `frequent` and has an average_ticket greater than or equal to the `HIGH_SPENDER_MIN_TICKET` threshold (default 50), THEN the model SHALL tag that customer as `high_spender`.
- **R7**: The segmentation thresholds (`INACTIVE_DAYS`, `FREQUENT_VISIT_COUNT`, `HIGH_SPENDER_MIN_TICKET`) SHALL be exported as a readonly constants object from `models.type.ts` so tests can assert against their exact values.
- **R8**: WHEN the method completes, the model SHALL return a `CustomerSegmentationResult` object containing a `segments` array and a `summary` record with counts per segment (including `unassigned`).
- **R9**: IF no customers exist in the database, THEN the model SHALL return an empty `segments` array and a summary with zero counts for every segment.
- **R10**: IF the database returns a connection failure or network error, THEN the method SHALL propagate a descriptive error code (e.g. `'DB_CONNECTION_FAILURE'`).
