# Requirements - controller_traffic_metrics (Feature ID: 11)

- **R1**: WHEN the controller receives a metrics request, it SHALL fetch all transaction records from the database model layer.
- **R2**: WHEN transaction records are fetched, the controller SHALL invoke `TrafficService.computeDistribution` with the transaction array to calculate hourly and weekday distributions.
- **R3**: WHEN the distribution service returns computed results, the controller SHALL return a success payload containing the distribution object with `hours`, `weekdays`, `peakHour`, `peakWeekday`, and `totalTransactions` fields.
- **R4**: IF the database model throws a connection failure, THEN the controller SHALL catch the exception and return an error packet containing `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }`.
- **R5**: IF the database model throws any other exception, THEN the controller SHALL catch the exception and return an error packet containing `{ success: false, status: 500, error: "<descriptive error message>" }`.
- **R6**: Integration tests in `tests/integration/controller_traffic_metrics.test.ts` SHALL verify payload layouts and HTTP status codes for both success and error scenarios.