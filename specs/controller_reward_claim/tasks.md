# Tasks — controller_reward_claim (Feature ID: 59)

## Executable Checklist

- [x] T1 - Implement `ClientModel.resetWifiLoginCount(clientId: string)` inside `src/backend/models/client.model.ts` to support both production (deleting records from `wifi_logins`) and offline simulation modes. Covers: R7, R8.
- [x] T2 - Create the controller class `MilestoneController` and `claimReward` static method inside `src/backend/controllers/milestone.controller.ts` with comprehensive validations, milestone evaluation triggers, counter resets, and error handling. Covers: R1, R2, R3, R4, R5, R6, R9, R10.
- [x] T3 - Add integration tests inside `tests/integration/controller_reward_claim.integration.test.ts` to verify validation rules, milestone qualification bounds, audit logging, counter resets, database errors, and offline simulations. Covers: R11.
- [x] T4 - Execute `./init.sh --quick` and the full `./init.sh` script to verify all tests pass and that the harness linter and static analyses confirm success. Covers: R11.
