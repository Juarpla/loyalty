# Tasks — service_visit_milestone_counter (Feature ID: 58)

- [ ] T1 - Add `MilestoneEvaluation` interface and `MILESTONE_THRESHOLD = 10` constant to `src/backend/types/models.type.ts`. Covers: R3.
- [ ] T2 - Add `ClientModel.getWifiLoginCount(clientId: string)` in `src/backend/models/client.model.ts` supporting production Supabase head queries, offline simulation suffix parsing, validation, and database error mapping. Covers: R2, R5, R6, R7.
- [ ] T3 - Create `src/backend/services/milestone.service.ts` exporting `MilestoneService.evaluateMilestone(clientId: string)`. Covers: R1, R2.
- [ ] T4 - Implement validation guards for empty/whitespace client IDs and milestone logic evaluation (`isMilestone` true if and only if count is exactly 10). Covers: R4, R6.
- [ ] T5 - Create integration test suite `tests/integration/service_visit_milestone_counter.test.ts` verifying boundary visit counts (9, 10, 11), validation guards, database query exception mapping, and offline simulation parsing. Covers: R8.
- [ ] T6 - Execute `pnpm test`, `pnpm lint`, and `./init.sh` to verify full compilation and test coverage. Covers: R8.
