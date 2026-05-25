# Tasks — Feature 38: logic_flash_sale_injection

- [x] T1 — Create `src/backend/services/social-prompt.decorator.ts` with the `decorate` function signature exporting `decorate(prompt, transactions, date?)`. Covers: R1.
- [x] T2 — Implement the low traffic check by importing `TrafficService` and calling `TrafficService.isLowTrafficDay(date, transactions)`. Default `date` to `new Date()` when not provided. Covers: R2, R6.
- [x] T3 — Implement the flash sale injection path: when `isLowTrafficDay` returns `true`, append the "[Oferta Relámpago]" text block to the prompt and return it. Store the injection text as a named constant. Covers: R3.
- [x] T4 — Implement the passthrough paths: return the prompt unchanged when traffic is not low (R4) or when transactions are empty (R5). Covers: R4, R5.
- [x] T5 — Write integration test file `tests/integration/logic_flash_sale_injection.integration.test.ts` with three test cases:
  - Mock low traffic → assert prompt contains "Oferta Relámpago"
  - Mock normal traffic → assert prompt passes through unchanged
  - Empty transactions array → assert prompt passes through unchanged
  Covers: R7.
- [x] T6 — Run `./init.sh` and verify all tests pass with no lint errors. Covers: R1–R7.
