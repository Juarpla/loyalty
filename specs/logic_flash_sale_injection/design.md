# Design — Feature 38: logic_flash_sale_injection

## Files to create/modify

| File | Change |
|------|--------|
| `src/backend/services/social-prompt.decorator.ts` | **New** — Create the decorator module with the `decorate` function |
| `tests/integration/logic_flash_sale_injection.test.ts` | **New** — Integration tests (per acceptance criteria and R7) |

No existing files are modified. The decorator is a new isolated module that imports `TrafficService` and sits between the caller and the AI service.

## Public interface

```typescript
// src/backend/services/social-prompt.decorator.ts

export function decorate(
  prompt: string,
  transactions: TransactionRecord[],
  date?: Date,
): string
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | `string` | — | The original prompt to be sent to the AI service |
| `transactions` | `TransactionRecord[]` | — | Historical transaction records used to assess traffic levels |
| `date` | `Date` (optional) | `new Date()` | The target date to evaluate. Defaults to current date if omitted |

Returns: `string` — The original prompt, optionally decorated with flash sale instructions.

## Flash sale injection text

When low traffic is detected, the following text is appended to the prompt:

```
[Oferta Relámpago] This is a low-traffic day. Suggest creating a flash sale post to attract more customers today. Include urgency phrases and a limited-time offer angle.
```

This text is appended at the end of the original prompt, separated by a newline. The exact verbiage should be stored as a `const` for maintainability and testability.

## Data flow

```
SocialController.handleSocialIdeas(context)
  │
  ├── Build original prompt (e.g. "Generate 3 social media post ideas...")
  │
  ├── decorate(prompt, transactions, date?)
  │     │
  │     ├── transactions.length === 0 ?
  │     │     └── return prompt (unchanged)                     ← R5
  │     │
  │     ├── date = date ?? new Date()                            ← R6
  │     │
  │     ├── TrafficService.isLowTrafficDay(date, transactions)   ← R2
  │     │     │
  │     │     ├── true  → prompt += "\n[Oferta Relámpago]..."   ← R3
  │     │     └── false → prompt unchanged                      ← R4
  │     │
  │     └── return decorated prompt
  │
  └── AIService.generateSocialIdeas(decoratedPrompt)
```

## Integration with SocialController

The `SocialController.handleSocialIdeas` method currently calls `AIService.generateSocialIdeas(context)` directly. After this feature, the controller will inject the decorator call:

```
const prompt = `Generate 3 social media post ideas... Context: ${context}`;
const decoratedPrompt = decorate(prompt, transactions); // new
const ideas = await AIService.generateSocialIdeas(decoratedPrompt);
```

Note: The specific integration point in `SocialController` is the implementer's concern. The spec only defines the decorator contract and behavior.

## Transaction record source

The `transactions` parameter is expected to come from the caller (controller). The caller is responsible for fetching historical transactions from the model layer. The decorator itself does not fetch data — it is a pure transformation function.

## Relationship to existing types

The decorator reuses the existing `TransactionRecord` type from `src/backend/types/models.type.ts`. No new types are needed.

## Error handling

| Scenario | Behavior |
|----------|----------|
| Empty transactions array | Return prompt unchanged (R5) |
| `TrafficService.isLowTrafficDay` throws | Let the exception propagate — the decorator does not catch errors from the traffic service |
| `date` is undefined | Default to `new Date()` (R6) |

## Rejected alternative: Inline the flash sale logic in SocialController

**Considered:** Adding the `isLowTrafficDay` check directly inside `SocialController.handleSocialIdeas`.

**Rejected because:**
1. Violates the Single Responsibility Principle — the controller should not contain prompt decoration logic.
2. Harder to unit test in isolation without spinning up the full controller.
3. Would require duplicating the decorator logic if other controllers (e.g., promotions) also need flash sale injection in the future.
4. A dedicated decorator module follows the Decorator pattern, keeping prompt transformation chainable and composable.

## Next.js local docs consulted

No Next.js-specific docs were relevant for this feature — it is a pure backend service module. No `node_modules/next/dist/docs/` files were consulted.
