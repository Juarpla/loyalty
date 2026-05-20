# Requirements - hook_cashier_sales (Feature ID: 6)

- **R1**: The hook SHALL expose controlled form state for `phoneNumber` (string) and `amount` (string), plus setters so UI components can bind inputs without performing network requests.
- **R2**: WHEN the registration callback (`registerSale`) is invoked, the hook SHALL set `loading` to `true`, clear any prior `error` and `successMessage`, and issue a `POST` request to `/api/v1/sales/record` with JSON body `{ phone_number: phoneNumber, amount: Number(amount) }`.
- **R3**: WHILE `loading` is `true`, the hook SHALL keep `loading` at `true` until the fetch settles (success or failure).
- **R4**: IF the API responds with HTTP 201 and `{ success: true, data: <SalesTransaction> }`, THEN the hook SHALL reset `phoneNumber` and `amount` to empty strings, set a non-empty `successMessage`, and set `loading` to `false`.
- **R5**: IF the API responds with a non-201 status or `{ success: false, error: string }`, THEN the hook SHALL set a descriptive `error` string, preserve current form values, clear `successMessage`, and set `loading` to `false`.
- **R6**: IF the fetch throws (network failure), THEN the hook SHALL set a generic `error` message, preserve form values, and set `loading` to `false`.
