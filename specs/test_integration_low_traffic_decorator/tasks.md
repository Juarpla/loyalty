# Tasks: Low Traffic Decorator Flow Integration Tests

- [x] T1 — Create `tests/integration/low_traffic_decorator_flow.integration.test.ts` with test suite structure covering requirement-labeled `describe` blocks.  
  Covers: R1, R2, R3, R4, R5.

- [x] T2 — Implement test for low-traffic weekday detection decorator injection.  
  Covers: R1.  
  *Arrange:* Monday has 1 transaction vs. 10 on all other weekdays; call `decorate` with a Monday date.  
  *Assert:* Returned string contains `[Oferta Relámpago]`.

- [x] T3 — Implement test for normal-traffic weekday returning prompt unchanged.  
  Covers: R2.  
  *Arrange:* All weekdays have equal transactions; call `decorate` with any weekday.  
  *Assert:* Returned string equals the original prompt only.

- [x] T4 — Implement test for empty transactions array returning prompt unchanged.  
  Covers: R3.  
  *Arrange:* Empty array `[]` passed as transactions.  
  *Assert:* Returned string equals the original prompt.

- [x] T5 — Implement test for custom date parameter routing.  
  Covers: R4.  
  *Arrange:* Transactions show Monday as low-traffic; provide an explicit `date` parameter for a Monday.  
  *Assert:* Returned string contains `[Oferta Relámpago]`.

- [x] T6 — Implement test for all-invalid timestamps returning prompt unchanged.  
  Covers: R5.  
  *Arrange:* All transactions have unparseable `created_at` values.  
  *Assert:* Returned string equals the original prompt.

- [x] T7 — Run `pnpm test` and verify the new test file passes with zero failures.  
  Covers: R1, R2, R3, R4, R5.  
  *Result:* 24 test files, 187 tests — all passed.
