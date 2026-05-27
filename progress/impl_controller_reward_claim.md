# Implementation Handoff — controller_reward_claim (Feature ID: 59)

## Summary

Feature 59 implements the backend controller for customer milestone reward claims. Cashiers can invoke `MilestoneController.claimReward(reqBody)` to process reward claims for clients. The implementation validates request payloads, triggers milestone eligibility checks via `MilestoneService.evaluateMilestone`, writes audit claim logs via `logger.info`, and resets the milestone visit counters by invoking the brand new `ClientModel.resetWifiLoginCount` model function to delete the client's `wifi_logins` database records.

---

## Changed Areas

1. **`src/backend/models/client.model.ts`**:
   - Implemented `resetWifiLoginCount(clientId: string)` static method.
   - Deletes all database rows in the `wifi_logins` table where `client_id = clientId`.
   - Automatically handles production Supabase connections and offline simulation logic.

2. **`src/backend/controllers/milestone.controller.ts` [NEW]**:
   - Created the decoupled HTTP coordinator class `MilestoneController`.
   - Implemented `claimReward(reqBody: unknown)` to handle request structure checking, phone parameter fallback parses, qualification asserts, counter resets, audit logs, and exception groupings.

3. **`tests/integration/controller_reward_claim.integration.test.ts` [NEW]**:
   - Created comprehensive integration tests verifying:
     - Input validation errors (null/undefined bodies, malformed schemas, and empty/whitespace Client IDs).
     - Snake-case parameter parsing fallbacks (`client_id` fallback checks).
     - Milestone eligibility checks (rejecting claims for visit counts other than exactly 10).
     - Successful claim operations, database delete invocations, and audit log tracking.
     - Database connection timeout wrappers (`DB_CONNECTION_FAILURE` returns status `500`).
     - General database syntax errors (`Internal Server Error` returns status `500`).
     - Clean execution in offline simulation settings.

---

## Requirement Traceability

| Requirement ID | Description | Verified in Test |
| :--- | :--- | :--- |
| **R1** | Static asynchronous `claimReward` method exposure. | `should export MilestoneController and static method claimReward` |
| **R2** | Body validation (rejecting missing/null/non-object bodies). | `should return 400 when reqBody is null or undefined` and `not an object` |
| **R3** | Client ID validation (rejecting missing or whitespace strings). | `should return 400 when clientId is missing`, `not a string`, and `only whitespace` |
| **R4** | Invoking `MilestoneService.evaluateMilestone(clientId)`. | `should reject claim with 400 if client has not reached milestone threshold` |
| **R5** | Rejecting claims if `isMilestone` is `false`. | `should reject claim with 400 if client has not reached milestone threshold` |
| **R6** | Triggering audit logs and resetting visit count. | `should trigger claim audit logging, invoke resetWifiLoginCount, and return success` |
| **R7** | `ClientModel.resetWifiLoginCount` database delete function. | `should trigger claim audit logging, invoke resetWifiLoginCount, and return success` |
| **R8** | Offline simulation support for model deletions. | `should run resetWifiLoginCount successfully in offline simulation mode` |
| **R9** | Mapping network connection timeouts to `DB_CONNECTION_FAILURE`. | `should handle DB_CONNECTION_FAILURE and return 500` |
| **R10** | Mapping execution exceptions to `Internal Server Error`. | `should handle general query execution errors and return 500` |
| **R11** | Integration test suite validation. | `pnpm test` successfully executing all 13 assertion items. |

---

## Verification Evidence

All Vitest tests run and pass perfectly with clean linter checks:

```bash
 Test Files  34 passed (34)
      Tests  262 passed (262)
   Start at  13:52:23
   Duration  1.68s

[OK] pnpm test passed
[OK] pnpm lint passed
```
