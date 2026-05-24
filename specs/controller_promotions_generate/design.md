# Design — Feature 24: controller_promotions_generate

## Files to modify

| File | Change |
|------|--------|
| `src/backend/controllers/promotions.controller.ts` | Add `generate()` static method to `PromotionsController` |
| `tests/integration/controller_promotions_generate.test.ts` | New integration test file (per acceptance criteria) |

## New imports

```typescript
import { AIService } from "../services/ai.service";
```

## Method signature

```typescript
static async generate(): Promise<{
  success: boolean;
  data?: { campaigns: GeminiRecoveryPromptResult[] };
  status?: number;
  error?: string;
}>
```

No input parameters — the controller fetches segments autonomously.

## Data flow

```
Controller.generate()
  │
  ├── logger.info("PromotionsController.generate started")
  │
  ├── ClientModel.getCustomerSegments()
  │     │
  │     ├── Success → filter segments to segment === 'inactive_30d'
  │     │     │
  │     │     ├── inactiveCustomers.length === 0
  │     │     │     └── return { success: true, data: { campaigns: [] } }
  │     │     │
  │     │     └── inactiveCustomers.length > 0
  │     │           │
  │     │           ├── AIService.generateRecoveryPrompts(inactiveCustomers)
  │     │           │     │
  │     │           │     ├── Success → compile campaigns array
  │     │           │     │     └── return { success: true, data: { campaigns } }
  │     │           │     │
  │     │           │     └── Throws → catch, log, build fallback campaigns
  │     │           │           └── return { success: true, data: { campaigns: fallbackCampaigns } }
  │     │           │
  │     │
  │     └── Failure (DB_CONNECTION_FAILURE, etc.)
  │           └── return { success: false, status: 500, error: "..." }
  │
  └── Unexpected error
        └── logger.error, return { success: false, status: 500, error: err.message }
```

## Fallback discount message

When `AIService.generateRecoveryPrompts()` throws, the controller builds a fallback campaign for each inactive customer:

```typescript
const FALLBACK_DISCOUNT = "¡Te extrañamos! Visítanos y obtén un 15% de descuento en tu próxima compra.";
```

Each fallback campaign entry:

```typescript
{
  phone_number: customer.phone_number,
  recoveryCopy: FALLBACK_DISCOUNT,
  generatedAt: new Date().toISOString()
}
```

## Response shape (success)

```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "phone_number": "+521234567890",
        "recoveryCopy": "¡Hola Juan! Te tenemos una oferta especial...",
        "generatedAt": "2026-05-24T02:00:00.000Z"
      }
    ]
  }
}
```

## Response shape (error)

```json
{
  "success": false,
  "status": 500,
  "error": "DB_CONNECTION_FAILURE"
}
```

## Response shape (empty)

```json
{
  "success": true,
  "data": {
    "campaigns": []
  }
}
```

## Error handling

| Scenario | Behavior |
|----------|----------|
| `ClientModel.getCustomerSegments()` throws `DB_CONNECTION_FAILURE` | Return `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }` |
| `ClientModel.getCustomerSegments()` throws unknown error | Return `{ success: false, status: 500, error: <message> }` |
| `AIService.generateRecoveryPrompts()` throws | Log error, inject fallback discount for every inactive customer, return `success: true` with fallback campaigns |
| Inactive customer count is 0 | Return `{ success: true, data: { campaigns: [] } }`, do not call AI service |

## Rejected alternative: Controller calls Gemini directly

**Considered:** Having the controller import and call the Gemini SDK directly instead of routing through `AIService.generateRecoveryPrompts()`.

**Rejected because:**
1. It violates the decoupled MVC architecture — controllers should coordinate, not implement external API logic.
2. The `AIService` already handles per-customer prompt building, 180-character enforcement, per-customer error isolation, and logging.
3. Duplicating that logic in the controller would create technical debt and maintenance overhead.
4. The established pattern (evident in `getSegments()`) is for controllers to delegate to models/services, not to perform business logic directly.

## Next.js local docs consulted

No Next.js-specific docs were relevant for this feature — it is a pure backend controller change. No `node_modules/next/dist/docs/` files were consulted.
