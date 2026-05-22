# Requirements - api_traffic_metrics_route (Feature ID: 12)

- **R1**: The API route SHALL expose a GET endpoint at `/api/v1/sales/metrics` matching Next.js App Router conventions.
- **R2**: The API route SHALL delegate to `TrafficController.getMetrics` with no request body parsing.
- **R3**: IF the controller returns a success payload, THEN the API route SHALL return a 200 OK HTTP response containing `{ success: true, data: <distribution> }`.
- **R4**: IF the controller returns an error payload, THEN the API route SHALL return the mapped error JSON with the status code provided by the controller (e.g. 500).
- **R5**: Integration tests in `tests/integration/api_traffic_metrics_route.test.ts` SHALL assert endpoint routing, response headers, and HTTP status code mapping for both success and error scenarios.
