# Requirements - controller_sales_record (Feature ID: 4)

- **R1**: The controller SHALL validate that the input `phone_number` (or `phoneNumber`) is provided and matches a valid phone number format (must be a Peru phone number format `+51` followed by exactly 9 digits, or a standard international format `+` followed by 7 to 15 digits).
- **R2**: The controller SHALL validate that the input `amount` is provided, is a valid number, and is strictly positive (greater than 0).
- **R3**: IF either the phone number format is invalid, or the amount is negative, zero, or non-numeric, THEN the controller SHALL immediately return a validation error packet containing `{ success: false, status: 400, error: "<descriptive error message>" }`.
- **R4**: IF the input data is valid, THEN the controller SHALL invoke `SalesModel.insertTransaction` to record the transaction and return a success packet containing `{ success: true, data: <SalesTransaction> }`.
- **R5**: IF the model layer throws a database connection error or other exception, THEN the controller SHALL catch the exception and return a mapped error packet containing `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }` or other descriptive error.
