# Requirements — Feature 38: logic_flash_sale_injection

## R1 — Decorator function exists
The system MUST expose a `decorate` function in `src/backend/services/social-prompt.decorator.ts` that accepts a prompt string, an optional date, and an array of transaction records, and returns a decorated prompt string.

## R2 — Decorator invokes low traffic check
WHEN `decorate` is called with a date and transaction records, the system MUST call `TrafficService.isLowTrafficDay(date, transactions)` to determine if the given day is a historically low traffic day.

## R3 — Flash sale injection on low traffic day
WHEN `TrafficService.isLowTrafficDay` returns `true`, the system MUST append "Oferta Relámpago" flash sale campaign tag instructions to the prompt string before returning it.

## R4 — Passthrough on normal traffic day
WHEN `TrafficService.isLowTrafficDay` returns `false`, the system MUST return the prompt string unchanged.

## R5 — Passthrough with empty transactions
WHEN the transactions array is empty, the system MUST return the prompt string unchanged without calling `TrafficService.isLowTrafficDay`.

## R6 — Passthrough with no date provided
WHEN no date argument is supplied to `decorate`, the system MUST default to the current date using `new Date()` before invoking the low traffic check.

## R7 — Integration tests verify behavior
WHEN the integration test suite runs, the system MUST assert that:
- A mocked low-traffic scenario results in a prompt containing "Oferta Relámpago".
- A mocked normal-traffic scenario passes the prompt through unchanged.
- An empty transactions array passes the prompt through unchanged.
