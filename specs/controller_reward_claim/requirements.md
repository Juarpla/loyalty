# Requirements — controller_reward_claim (Feature ID: 59)

## Context

Feature 59 implements the `MilestoneController` class inside `src/backend/controllers/milestone.controller.ts`. This controller manages customer milestone reward claiming. When a cashier triggers a claim, the controller validates the request, checks if the client qualifies (visit count equals exactly 10), writes an audit claim log, and resets the milestone counter. The counter is reset by deleting all existing visit records for the client in the `wifi_logins` table.

---

## Requirements

- **R1 (Ubiquitous):** The system MUST expose a `MilestoneController` class from `src/backend/controllers/milestone.controller.ts` with a static asynchronous `claimReward(reqBody: unknown)` method.

- **R2 (Unwanted behavior):** IF the `reqBody` is missing, null, or not an object, THEN `claimReward` MUST return a JSON response with `{ success: false, status: 400, error: "Request body is required" }`.

- **R3 (Unwanted behavior):** IF the `clientId` (or `client_id`) parameter is missing from the request body or is not a non-empty string, THEN `claimReward` MUST return a JSON response with `{ success: false, status: 400, error: "Validation failed: Client ID is required" }`.

- **R4 (Event-driven):** WHEN a valid claim request is processed, the system MUST invoke `MilestoneService.evaluateMilestone(clientId)` to check if the client qualifies for the milestone reward.

- **R5 (Unwanted behavior):** IF `MilestoneService.evaluateMilestone` determines that the client's `isMilestone` is `false`, THEN `claimReward` MUST return a JSON response with `{ success: false, status: 400, error: "Validation failed: Milestone not reached" }`.

- **R6 (Event-driven):** WHEN a client qualifies for the milestone reward (`isMilestone` is `true`), the system MUST write an audit log using `logger.info` and reset the client's milestone counter by invoking `ClientModel.resetWifiLoginCount(clientId)`.

- **R7 (Ubiquitous):** The system MUST expose `ClientModel.resetWifiLoginCount(clientId: string)` in `src/backend/models/client.model.ts` which deletes the customer's login records from the `wifi_logins` table to reset their visit count.

- **R8 (State-driven):** WHILE in `offline_simulation` database mode, `ClientModel.resetWifiLoginCount` MUST return successfully after simulating a database operation.

- **R9 (Unwanted behavior):** IF any database operations (such as resetting the milestone counter) encounter connection errors, THEN `claimReward` MUST return a JSON response with `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }`.

- **R10 (Unwanted behavior):** IF any database operations (such as resetting the milestone counter) encounter execution errors, THEN `claimReward` MUST return a JSON response with `{ success: false, status: 500, error: "Internal Server Error" }`.

- **R11 (Ubiquitous):** Integration tests in `tests/integration/controller_reward_claim.test.ts` MUST assert validation rules, non-milestone claim rejection, successful claim processing and counter reset, database error mapping, and offline simulation behaviors.

---

## Verification Map

- **R1:** Import `MilestoneController` in the integration test and assert that `claimReward` is an asynchronous function.
- **R2:** Call `claimReward` with `null`, `undefined`, or a primitive and assert it returns status `400` with the exact message.
- **R3:** Call `claimReward` with an object lacking `clientId` or having empty/whitespace string values and assert it returns status `400` with the exact message.
- **R4:** Mock `MilestoneService.evaluateMilestone` and assert it is invoked with the exact `clientId` provided.
- **R5:** Mock `MilestoneService.evaluateMilestone` to return `isMilestone: false` and assert that the controller returns status `400` with `"Validation failed: Milestone not reached"`.
- **R6:** Verify that a successful claim writes a log via `logger.info` and triggers a call to `ClientModel.resetWifiLoginCount`.
- **R7:** Verify that calling `ClientModel.resetWifiLoginCount` in production mode executes a delete command on `wifi_logins` table where `client_id = clientId`.
- **R8:** Assert that in `offline_simulation` database mode, calling `ClientModel.resetWifiLoginCount` completes successfully without trying to query the real database.
- **R9:** Mock `ClientModel.resetWifiLoginCount` to throw a `DB_CONNECTION_FAILURE` error and assert the controller propagates a status `500` response with `"DB_CONNECTION_FAILURE"`.
- **R10:** Mock `ClientModel.resetWifiLoginCount` to throw a general error and assert the controller propagates a status `500` response with `"Internal Server Error"`.
- **R11:** Run the integration test suite via `pnpm test` and assert all verification tests pass.
