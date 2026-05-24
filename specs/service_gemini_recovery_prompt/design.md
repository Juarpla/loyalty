# Design — Feature 23: service_gemini_recovery_prompt

## Files to modify

| File | Change |
|------|--------|
| `src/backend/services/ai.service.ts` | Add `generateRecoveryPrompts` static method, prompt builder, Gemini call wrapper, fallback logic |
| `src/backend/types/models.type.ts` | Add `GeminiRecoveryPromptInput` and `GeminiRecoveryPromptResult` interfaces |
| `tests/integration/service_gemini_recovery_prompt.test.ts` | New integration test file (per acceptance criteria) |

## New types

```typescript
// Added to src/backend/types/models.type.ts

export interface GeminiRecoveryPromptInput {
  customer: SegmentedCustomer;
  businessName?: string;
}

export interface GeminiRecoveryPromptResult {
  phone_number: string;
  recoveryCopy: string;
  generatedAt: string;
}
```

## Method signature

```typescript
// Added to src/backend/services/ai.service.ts

static async generateRecoveryPrompts(
  customers: SegmentedCustomer[],
  options?: { businessName?: string }
): Promise<GeminiRecoveryPromptResult[]>
```

- `customers`: Array of `SegmentedCustomer` objects, expected to be pre-filtered to `inactive_30d` by the caller.
- `options.businessName`: Optional business name to include in the prompt (defaults to "our store").
- Returns: One `GeminiRecoveryPromptResult` per input customer, in the same order.

## Prompt template structure

For each customer, the method builds a prompt string:

```
You are a customer recovery copywriter for a local business.
Write a short, friendly message to re-engage the customer.

Customer name: {name}
Visit count: {visitCount}
Last visit: {lastTransactionDate} (or "No previous visits")
Business name: {businessName}

The message must be warm, personalized, and under 180 characters.
Respond with only the message text, no additional formatting.
```

## Data flow

```
Caller (controller/service)
  │
  ▼
AIService.generateRecoveryPrompts(customers, options?)
  │
  ├── logger.info("generateRecoveryPrompts started", { count })
  │
  ├── For each customer:
  │     │
  │     ├── Build prompt string (with name, visits, last date, business name)
  │     │
  │     ├── Call Gemini SDK (mockable interface)
  │     │     ├── Success → enforce 180-char limit → logger.info
  │     │     └── Failure → fallback message → logger.error
  │     │
  │     └── Collect result
  │
  └── Return GeminiRecoveryPromptResult[]
```

## Gemini SDK integration

The existing `ai.service.ts` does not yet import a Gemini SDK. The implementation should:

1. Use `@google/generative-ai` SDK (or equivalent) to call the Gemini model.
2. Expect the SDK response to contain generated text in `response.text()`.
3. If `GEMINI_API_KEY` env var is not set, fall back to simulation (deterministic template-based copy) for offline/dev mode.

This design follows the existing pattern in the codebase where services use environment-driven fallbacks (see `supabase.model.ts` offline mode).

## Character limit enforcement

After receiving the LLM response:
1. Trim whitespace from the response.
2. If the trimmed string exceeds 180 characters, truncate at the last space before position 180.
3. Append "…" if truncated.
4. The truncated result is what gets stored in `recoveryCopy`.

## Error handling

| Scenario | Behavior |
|----------|----------|
| Gemini API call throws | Log error via `logger.error`, return fallback message for that customer |
| Gemini API returns empty string | Treat as failure, return fallback message |
| Response exceeds 180 chars | Truncate at word boundary (R4) |
| `customers` array is empty | Log warning, return empty array |
| Unknown customer fields (null name etc.) | Use safe defaults ("Valued Customer", "recently") |

## Rejected alternative: Batch all customers in one prompt

**Considered:** Send all inactive customers in a single Gemini prompt and request bulk JSON output.

**Rejected because:**
1. Larger prompts consume more tokens and increase latency.
2. Per-customer error isolation is harder — one malformed response could corrupt the entire batch.
3. Individual character-limit enforcement per customer is more reliable when processing one at a time.
4. The batch approach requires structured JSON parsing which adds fragility.

## Next.js local docs consulted

No Next.js-specific docs were relevant for this feature — it is a pure backend service change. No `node_modules/next/dist/docs/` files were consulted.
