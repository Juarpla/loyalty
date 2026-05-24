# Tasks - controller_promotions_segments (Feature ID: 21)

- [x] **T1**: Create `PromotionsController.getSegments()` static method in `src/backend/controllers/promotions.controller.ts`. The method SHALL log the invocation, call `ClientModel.getCustomerSegments()`, handle `DB_CONNECTION_FAILURE` and generic errors with appropriate response envelopes, and return the uniform `ControllerResponse`. Covers: R1, R2, R3, R4, R5, R6.
- [x] **T2**: Create integration tests in `tests/integration/controller_promotions_segments.test.ts` that verify successful response shape (R2), `DB_CONNECTION_FAILURE` error mapping (R3), generic error mapping (R4), and logger invocation (R1, R6). Covers: R1, R2, R3, R4, R5, R6, R7.
