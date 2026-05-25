# Implementation — Feature 38: logic_flash_sale_injection

## Summary

Created a prompt decorator module that conditionally appends flash sale ("Oferta Relámpago") campaign instructions when the traffic service detects a historically low-traffic day.

## Files created

| File | Description |
|------|-------------|
| `src/backend/services/social-prompt.decorator.ts` | New decorator module with `decorate` function |
| `tests/integration/logic_flash_sale_injection.integration.test.ts` | Integration tests for the decorator |

## Files modified

| File | Description |
|------|-------------|
| `specs/38_logic_flash_sale_injection/tasks.md` | Marked all 6 tasks as complete |

## Behavior delivered

- `decorate(prompt, transactions, date?)` — conditionally appends flash sale text
- If `transactions` is empty → returns prompt unchanged without calling `isLowTrafficDay` (R5)
- If no `date` provided → defaults to `new Date()` (R6)
- Calls `TrafficService.isLowTrafficDay(date, transactions)` to check traffic (R2)
- If low traffic → appends `[Oferta Relámpago]...` text to prompt (R3)
- If normal traffic → returns prompt unchanged (R4)
- Flash sale text stored as named constant `FLASH_SALE_INJECTION` for maintainability

## Commands run

```bash
pnpm test
# Test Files  23 passed (23)
# Tests  177 passed (177)
```

## Traceability

- R1 (`decorate` function exists) → `tests/integration/logic_flash_sale_injection.integration.test.ts` (all tests call `decorate`)
- R2 (calls `TrafficService.isLowTrafficDay`) → `tests/integration/logic_flash_sale_injection.integration.test.ts`: `"R5: should return prompt unchanged and not call isLowTrafficDay when transactions are empty"` (proves spy was called when not empty)
- R3 (appends flash sale on low traffic) → `tests/integration/logic_flash_sale_injection.integration.test.ts`: `"R3: should append flash sale text when isLowTrafficDay returns true"`
- R4 (unchanged on normal traffic) → `tests/integration/logic_flash_sale_injection.integration.test.ts`: `"R4: should return prompt unchanged when isLowTrafficDay returns false"`
- R5 (unchanged on empty transactions) → `tests/integration/logic_flash_sale_injection.integration.test.ts`: `"R5: should return prompt unchanged and not call isLowTrafficDay when transactions are empty"`
- R6 (defaults date to `new Date()`) → `tests/integration/logic_flash_sale_injection.integration.test.ts`: `"R6: should default date to new Date() when not provided"`
- R7 (integration tests verify behavior) → All test cases above collectively cover R7

## E2E gate

**Decision: Skipped** — This is a pure backend module (decorator + service layer). No frontend components, API routes, or page layouts are affected. Per the implementer contract, E2E gate is only required for broad cross-layer features.

## Harness result

`./init.sh` — see separate run output below.
