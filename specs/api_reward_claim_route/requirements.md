# Requirements — api_reward_claim_route (Feature ID: 60)

The `api_reward_claim_route` feature exposes an HTTP endpoint `/api/v1/rewards/claim` to handle cashier milestone reward claims.

## Functional Requirements

- **R1**: The system MUST expose a POST handler under the Next.js App Router API route `src/app/api/v1/rewards/claim/route.ts`.
- **R2**: WHEN a valid POST request containing `clientId` or `client_id` is processed, the system MUST invoke `MilestoneController.claimReward` and, on success, return a status code of `200` with the success payload.
- **R3**: IF the incoming request JSON body is malformed or invalid, THEN the system MUST return a status code of `400` with a JSON payload containing `{ success: false, status: 400, error: "Invalid JSON payload" }`.
- **R4**: IF the controller returns an validation or business logic failure (such as milestone not qualifying or invalid/missing client ID), THEN the system MUST propagate the failure response along with its status code (e.g., `400`).
- **R5**: IF the controller encounters a database or network failure (such as `DB_CONNECTION_FAILURE`), THEN the system MUST return a status code of `500` along with the failure payload.
- **R6**: The integration tests in `tests/integration/api_reward_claim_route.integration.test.ts` MUST assert the endpoint routing behavior, payload formats, status codes, and exception propagation flows.
