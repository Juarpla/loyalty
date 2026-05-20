# Requirements - api_sales_record_route (Feature ID: 5)

- **R1**: The API route SHALL expose a POST endpoint at `/api/v1/sales/record` matching Next.js App Router conventions.
- **R2**: The API route SHALL parse the incoming JSON request body and delegate to `SalesController.recordTransaction`.
- **R3**: IF the request body is missing or cannot be parsed, THEN the API route SHALL handle the parsing error gracefully and return a validation error packet containing `{ success: false, status: 400, error: "Invalid JSON payload" }`.
- **R4**: IF the controller records the transaction successfully, THEN the API route SHALL return a 201 Created HTTP response containing `{ success: true, data: <SalesTransaction> }`.
- **R5**: IF the controller returns an error (validation error or DB connection failure), THEN the API route SHALL return the mapped error payload with the status code provided by the controller (e.g. 400 or 500).
