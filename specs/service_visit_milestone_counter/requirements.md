# Requirements — service_visit_milestone_counter (Feature ID: 58)

## Context

Feature 58 adds a `MilestoneService` inside `src/backend/services/milestone.service.ts`. This service evaluates whether a client (registered via the captive portal) has hit their 10th visit milestone (represented as exactly 10 accumulative rows in the `wifi_logins` table). When a client reaches this exact count, the service flags an active milestone which will eventually be used to alert the cashier and allow a reward claim.

---

## Requirements

- **R1 (Ubiquitous):** The system MUST expose a `MilestoneService` class from `src/backend/services/milestone.service.ts` with a static asynchronous `evaluateMilestone(clientId: string)` method.

- **R2 (Event-driven):** WHEN `evaluateMilestone` is invoked for a given client, the system MUST fetch the count of their logins in the `wifi_logins` table by invoking a new `getWifiLoginCount(clientId: string)` method in `ClientModel`.

- **R3 (Ubiquitous):** The system MUST define the `MilestoneEvaluation` TypeScript interface and the `MILESTONE_THRESHOLD` numeric constant in `src/backend/types/models.type.ts`.

- **R4 (Ubiquitous):** The system MUST set the `isMilestone` flag in the returned `MilestoneEvaluation` object to `true` if and only if the client's accumulative wifi login count is exactly equal to `MILESTONE_THRESHOLD` (which is 10).

- **R5 (State-driven):** WHILE in `offline_simulation` database mode, `ClientModel.getWifiLoginCount(clientId)` MUST check if the `clientId` string contains the pattern `-count-<number>` to parse and return that number, otherwise it MUST return a default simulated count of 10.

- **R6 (Unwanted behavior):** IF `ClientModel.getWifiLoginCount` receives an empty or whitespace-only `clientId` parameter, THEN the system MUST throw an `INVALID_CLIENT_ID` error without querying the database.

- **R7 (Unwanted behavior):** IF the database query in `ClientModel.getWifiLoginCount` encounters a connection or execution error, THEN the system MUST log the error via `logger.error` and throw a structured database error (`DB_CONNECTION_FAILURE` or `DB_QUERY_ERROR`).

- **R8 (Ubiquitous):** Integration tests in `tests/integration/service_visit_milestone_counter.test.ts` MUST verify exact milestone activation (count = 10), non-milestone state (count != 10), empty/whitespace client validations, database query error propagation, and offline simulation parsing.

---

## Verification Map

- **R1:** Import `MilestoneService` in the integration test and assert that `evaluateMilestone` is an asynchronous function.
- **R2:** Verify that calling `evaluateMilestone` results in a call to `ClientModel.getWifiLoginCount` with the identical `clientId`.
- **R3:** Verify that `src/backend/types/models.type.ts` contains the definition for `MilestoneEvaluation` and `MILESTONE_THRESHOLD = 10`.
- **R4:** Test inputs resulting in login counts of 9, 10, and 11. Assert that `isMilestone` is `true` only when the count is exactly 10.
- **R5:** Test `ClientModel.getWifiLoginCount` in simulation mode with inputs like `cli-count-5`, `cli-count-10`, `cli-count-15`, and a basic `cli-001` client ID to assert matching output integers.
- **R6:** Test `evaluateMilestone` and `ClientModel.getWifiLoginCount` with empty `""` and whitespace `"   "` client IDs, asserting that they reject with `INVALID_CLIENT_ID`.
- **R7:** Mock the Supabase client to throw a network error or a database syntax error, then assert that `ClientModel.getWifiLoginCount` throws `DB_CONNECTION_FAILURE` or `DB_QUERY_ERROR`.
- **R8:** Run `pnpm test` and verify that all integration tests in `tests/integration/service_visit_milestone_counter.test.ts` execute successfully and pass.
