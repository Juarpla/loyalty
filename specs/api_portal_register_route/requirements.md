# Requirements

* **R1**: WHEN a POST request is made to `/api/v1/portal/register`, the system MUST parse the request body as JSON.
* **R2**: IF the request body is not valid JSON, THEN the system MUST return a 400 Bad Request status with an error message of "Invalid JSON payload".
* **R3**: WHEN the JSON body is successfully parsed, the system MUST invoke `registerPortalClient` from `src/backend/controllers/portal.controller.ts` passing the parsed body.
* **R4**: IF the controller returns `success: false`, THEN the system MUST return a JSON response containing the controller's result payload and using the controller's HTTP status code (or 500 if missing).
* **R5**: WHEN the controller returns `success: true`, the system MUST return a JSON response containing the controller's result payload with a 201 Created HTTP status code.
* **R6**: WHEN verifying the API endpoint behavior, the system MUST pass integration tests defined in `tests/integration/api_portal_register_route.test.ts` validating successful registrations, invalid input propagation, and database errors.
