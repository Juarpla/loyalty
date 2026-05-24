# Implementation — Feature 23: service_gemini_recovery_prompt

## Summary

Added `generateRecoveryPrompts` static method to `AIService` that connects Gemini (via REST API or simulation mode) to write personalized recovery copy for inactive customers. The method accepts an array of `SegmentedCustomer`, builds a prompt with customer context, calls the LLM (or simulation fallback), enforces a 180-character word-boundary limit, and returns `GeminiRecoveryPromptResult[]`.

## Files changed

| File | Change |
|------|--------|
| `src/backend/types/models.type.ts` | Added `GeminiRecoveryPromptInput` and `GeminiRecoveryPromptResult` interfaces |
| `src/backend/services/ai.service.ts` | Added `generateRecoveryPrompts`, `buildRecoveryPrompt`, `callGemini`, `simulateGeminiResponse`, `enforceCharLimit` methods |
| `tests/integration/service_gemini_recovery_prompt.integration.test.ts` | New integration test file covering all requirements |

## Test results

```
pnpm test:agent → 16 files, 132 tests passed
pnpm lint → clean
pnpm build → compiled successfully
./init.sh → [OK] harness ready (full)
```

## Traceability

| Req | Test(s) |
|-----|---------|
| R1 | `service_gemini_recovery_prompt.integration.test.ts`: "accepts customers and returns recovery copy" |
| R2 | `service_gemini_recovery_prompt.integration.test.ts`: "R2: prompt builder" (4 subtests) |
| R3 | `service_gemini_recovery_prompt.integration.test.ts`: "R3: 180-char instruction in prompt" |
| R4 | `service_gemini_recovery_prompt.integration.test.ts`: "R4: character limit enforcement" (3 subtests) |
| R5 | `service_gemini_recovery_prompt.integration.test.ts`: "R5: fallback message" |
| R6 | `service_gemini_recovery_prompt.integration.test.ts`: "R6: logs method invocation" |
| R7 | `service_gemini_recovery_prompt.integration.test.ts`: "R10: SHALL log error with phone number" |
| R8 | `service_gemini_recovery_prompt.integration.test.ts`: "R9: SHALL log success with phone number" |
| R9 | `service_gemini_recovery_prompt.integration.test.ts`: "R9: mock Gemini returns valid copy" (3 subtests) |
| R10 | `service_gemini_recovery_prompt.integration.test.ts`: "R10: mock Gemini rejects" (2 subtests) |

## E2E gate

Not needed — this is a pure backend service change. No frontend components, API routes, or UI were touched.

## Commands run

```bash
pnpm test:agent         # 132 tests, all green
pnpm lint               # clean
pnpm build              # compiled successfully
./init.sh               # full harness [OK]
```

## Handoff recommendation

Ready for `in_review`.
