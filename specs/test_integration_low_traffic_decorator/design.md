# Design: Low Traffic Decorator Flow Integration Tests

## Overview

This feature adds a Vitest integration test file covering the `decorate()` function exported by `src/backend/services/social-prompt.decorator.ts`. The function conditionally appends a flash sale prompt injection when the target date falls on a historically low-traffic weekday.

No production code changes are required. The unit under test (`decorate`) and its dependency (`TrafficService.isLowTrafficDay`) are both already implemented and deployed.

## File scope

| File | Action | Reason |
|------|--------|--------|
| `tests/integration/low_traffic_decorator_flow.integration.test.ts` | **Create** | New integration test suite for the decorator flow (as specified by feature 39 acceptance criteria). |
| No production files | — | All production code is already in place (features 37, 38). |

## Public interface under test

```typescript
// From src/backend/services/social-prompt.decorator.ts
function decorate(
  prompt: string,
  transactions: TransactionRecord[],
  date?: Date,
): string
```

## Data flow

```
Test Input (prompt, transactions, optional date)
  │
  ▼
decorate()
  │
  ├─ Empty transactions? → return prompt
  │
  ├─ TrafficService.isLowTrafficDay(date, transactions)
  │     │
  │     ├─ true  → return prompt + FLASH_SALE_INJECTION
  │     │
  │     └─ false → return prompt
  │
  └─ Test Assertion: actual string matches expected string
```

## Test scenarios mapped to requirements

| Scenario | Requirements | Input traits | Expected output |
|----------|-------------|--------------|-----------------|
| Low-traffic weekday | R1 | Monday has 1 tx, others have 10+ each, query Monday | Prompt + injection |
| Normal-traffic weekday | R2 | All weekdays have equal txs, query any day | Prompt only |
| Empty transactions | R3 | Empty array `[]` | Prompt only |
| Custom low-traffic date | R4 | Explicit date param pointing to a historically slow weekday | Prompt + injection |
| All-invalid timestamps | R5 | Every `created_at` is unparseable | Prompt only |

## Error handling

No error handling is needed beyond what `decorate()` already provides. All test inputs are controlled and mock-based. The function is pure (no I/O, no side effects), so no error paths exist within the test framework.

## Rejected alternatives

- **Unit-testing the decorator in isolation from TrafficService**: Rejected. The decorator's purpose is to integrate `TrafficService.isLowTrafficDay` with prompt building. Mocking the service would defeat the integration test intent. The acceptance criteria explicitly require "correct keywords are appended on slow days" — a true end-to-end behavior check.

- **Adding the test to the existing `service_low_traffic_detector.integration.test.ts`**: Rejected. That file is exclusively dedicated to `TrafficService.isLowTrafficDay`. Adding decorator tests would violate the single-responsibility test principle and make the file harder to maintain.

## Next.js docs consulted

Not applicable. This feature touches only a backend integration test file — no Next.js framework code, pages, routes, or components.
