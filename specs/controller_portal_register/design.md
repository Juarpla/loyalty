# Design: controller_portal_register

## Overview
The `controller_portal_register` serves as the HTTP coordinator for captive portal registrations. It validates incoming user details (name and phone number) before passing them down to the `client.model.ts` for database upserting. This guarantees only sanitized data enters the database.

## Files to Change
- `src/backend/controllers/portal.controller.ts`: Create the registration controller action.
- `tests/integration/controller_portal_register.test.ts`: Create integration tests covering validation constraints.

## Public Interfaces
- `async function registerPortalClient(reqBody: unknown): Promise<ResultObject>`
  - Accepts a raw JSON body from the HTTP route.
  - Validates `name` (string, minimum 2 characters) and `phone` (string, valid phone format).
  - Returns a structured success or error payload.

## Data Flow
1. API Route (`api_portal_register_route`, F47) receives POST request and passes payload to this controller.
2. The controller parses and validates the payload using a validation schema (e.g., Zod).
3. If validation fails, return 400 with a detailed error message packet.
4. If validation succeeds, call the `upsertCaptiveClient` method in `src/backend/models/client.model.ts` (created in feature 45).
5. Return the resulting model data or propagate database errors appropriately.

## Error Handling
- **Validation Errors**: Catch parsing errors and transform them into standard 400 error shapes: `{ error: "Validation failed", details: [...] }`.
- **Database Errors**: Catch thrown database errors from the model layer and return 500 or appropriate error codes.

## Rejected Alternatives
- **Validating directly in the API Route**: Rejected because it mixes HTTP routing concerns with business validation logic. Separating validation into the controller ensures it can be unit-tested without mocking the Next.js Request object.
