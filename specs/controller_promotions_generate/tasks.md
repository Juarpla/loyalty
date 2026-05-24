# Tasks — Feature 24: controller_promotions_generate

- [x] T1 - Add `AIService` import to `src/backend/controllers/promotions.controller.ts`. Covers: R2, R3, R4, R5.
- [x] T2 - Add `generate()` static method to `PromotionsController` with start log (`PromotionsController.generate started`), try/catch block, and structured return. Covers: R4, R7.
- [x] T3 - In `generate()`: call `ClientModel.getCustomerSegments()`, filter `segments` to `segment === 'inactive_30d'`. Covers: R1.
- [x] T4 - In `generate()`: if filtered list is empty, return `{ success: true, data: { campaigns: [] } }` without calling `AIService`. Covers: R6.
- [x] T5 - In `generate()`: call `AIService.generateRecoveryPrompts(inactiveCustomers)` and compile the result into `{ success: true, data: { campaigns } }`. Covers: R2, R3, R4.
- [x] T6 - In `generate()`: define `FALLBACK_DISCOUNT` string constant with the Spanish discount message. Covers: R5.
- [x] T7 - In `generate()`: wrap `AIService` call in try/catch; on failure, log error and build fallback campaigns array with `FALLBACK_DISCOUNT` for each inactive customer. Covers: R5, R8.
- [x] T8 - In `generate()`: handle `DB_CONNECTION_FAILURE` from `ClientModel` by returning `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }`. Covers: R9.
- [x] T9 - In `generate()`: handle generic error from `ClientModel` by returning `{ success: false, status: 500, error: err.message }`. Covers: R8, R9.
- [x] T10 - Create `tests/integration/controller_promotions_generate.integration.test.ts` with test for successful generation flow: mock `ClientModel.getCustomerSegments()` to return inactive customers, mock `AIService.generateRecoveryPrompts()` to resolve, verify `success: true` and non-empty `data.campaigns`. Covers: R10.
- [x] T11 - Add integration test for AIService rejection: mock `AIService.generateRecoveryPrompts()` to reject, verify `data.campaigns` entries contain `FALLBACK_DISCOUNT` text. Covers: R11.
- [x] T12 - Add integration test for zero inactive customers: mock segmentation result with no `inactive_30d` entries, verify `data.campaigns` is `[]` and `AIService.generateRecoveryPrompts` was not called. Covers: R12.
- [x] T13 - Add integration test for `DB_CONNECTION_FAILURE`: mock `ClientModel.getCustomerSegments()` to throw `DB_CONNECTION_FAILURE`, verify `success: false`, `status: 500`, `error: "DB_CONNECTION_FAILURE"`. Covers: R9.
- [x] T14 - Add integration test for generic error from `ClientModel`: mock to throw a generic error, verify `success: false`, `status: 500`, and error message propagation. Covers: R8, R9.
- [x] T15 - Add logger spy integration tests: verify `logger.info` is called on start and `logger.error` is called on failure. Covers: R7, R8.

## Requirement coverage map

| Req | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14 | T15 |
|-----|----|----|----|----|----|----|----|----|----|-----|-----|-----|-----|-----|-----|
| R1  |    |    | ✅ |    |    |    |    |    |    |     |     |     |     |     |     |
| R2  | ✅ |    |    |    | ✅ |    |    |    |    |     |     |     |     |     |     |
| R3  | ✅ |    |    |    | ✅ |    |    |    |    |     |     |     |     |     |     |
| R4  | ✅ | ✅ |    |    | ✅ |    |    |    |    |     |     |     |     |     |     |
| R5  | ✅ |    |    |    |    | ✅ | ✅ |    |    |     |     |     |     |     |     |
| R6  |    |    |    | ✅ |    |    |    |    |    |     |     |     |     |     |     |
| R7  |    | ✅ |    |    |    |    |    |    |    |     |     |     |     |     | ✅ |
| R8  |    |    |    |    |    |    | ✅ |    | ✅ |     |     |     |     | ✅ | ✅ |
| R9  |    |    |    |    |    |    |    | ✅ | ✅ |     |     |     | ✅ | ✅ |     |
| R10 |    |    |    |    |    |    |    |    |    | ✅ |     |     |     |     |     |
| R11 |    |    |    |    |    |    |    |    |    |     | ✅ |     |     |     |     |
| R12 |    |    |    |    |    |    |    |    |    |     |     | ✅ |     |     |     |
