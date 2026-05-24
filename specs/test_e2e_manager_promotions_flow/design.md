# Feature 29 — test_e2e_manager_promotions_flow: Design

## Test file

`tests/e2e/manager_promotions_flow.e2e.test.ts`

Confirmed suffix `.e2e.test.ts` per Playwright config (`playwright.config.ts` line 14: `testMatch: '**/*.e2e.test.ts'`). The acceptance criterion mentions `.spec.ts` but that is overridden by the project convention.

## API mocking strategy

Use Playwright route interception (`page.route()`) to mock both API endpoints, matching the pattern established in `tests/e2e/page_manager_promotions.e2e.test.ts`:

| Endpoint | Method | Purpose |
|---|---|---|
| `**/api/v1/promotions/segments` | GET | Returns mock segment data |
| `**/api/v1/promotions/generate` | POST | Returns mock campaign drafts or errors |

For skeleton-state testing, use deferred route fulfillment (capture the `resolve` callback in a promise, assert skeleton visibility, then resolve).

## Mock data structures

Reuse and extend mock data from `tests/e2e/page_manager_promotions.e2e.test.ts`:

### Segments mock (success)
```typescript
const mockSegments = {
  success: true,
  data: {
    segments: [
      {
        phone_number: "+521234567890",
        name: "Juan",
        visit_count: 45,
        average_ticket: 320.5,
        last_transaction_date: "2026-04-15T10:30:00Z",
        segment: "inactive_30d" as const,
      },
      {
        phone_number: "+529876543210",
        name: "Maria",
        visit_count: 12,
        average_ticket: 850.0,
        last_transaction_date: "2026-05-20T14:00:00Z",
        segment: "high_spender" as const,
      },
      {
        phone_number: "+525551234567",
        name: "Carlos",
        visit_count: 28,
        average_ticket: 150.0,
        last_transaction_date: "2026-05-22T09:15:00Z",
        segment: "frequent" as const,
      },
    ],
    summary: { inactive_30d: 1, high_spender: 1, frequent: 1, unassigned: 0 },
  },
};
```

### Campaigns mock (success)
```typescript
const mockCampaigns = {
  success: true,
  data: {
    campaigns: [
      {
        phone_number: "+521234567890",
        recoveryCopy: "¡Hola Juan! Hemos extrañado tu visita. Vuelve hoy y disfruta de un 15% de descuento.",
        generatedAt: "2026-05-24T10:00:00.000Z",
      },
      {
        phone_number: "+521234567890",
        recoveryCopy: "Juan, tiene 30 días sin visitarnos. Te regalamos una bebida gratis en tu próximo pedido.",
        generatedAt: "2026-05-24T10:00:01.000Z",
      },
    ],
  },
};
```

### Empty segments mock
```typescript
const mockEmptySegments = {
  success: true,
  data: { segments: [], summary: {} },
};
```

## Test structure

```
test.describe("Manager Promotions Campaign Flow")
  ├── test("R4: ...")       // Page loads -> segment cards render
  ├── test("R5,R6,R7: ...") // Generate -> skeleton -> results appear
  ├── test("R8: ...")       // Generate -> API error -> error banner
  ├── test("R9: ...")       // Campaign content verification
  ├── test("R10: ...")      // Empty segments -> empty state
  ├── test("R11: ...")      // 375px mobile viewport
  └── test("R12: ...")      // 1440px desktop viewport
```

Tests SHALL be independent — each test sets up its own route interception via `page.route()` in the test body (matching the pattern in `page_manager_promotions.e2e.test.ts`).

## Data-testid selectors used

| Selector | Element |
|---|---|
| `segment-cards-populated` | Container for populated segment cards |
| `segment-card-inactive_30d` | Individual segment card for inactive_30d |
| `segment-card-high_spender` | Individual segment card for high_spender |
| `segment-card-frequent` | Individual segment card for frequent |
| `select-inactive_30d` | Generate campaign button on inactive_30d card |
| `campaigns-loading` | Skeleton/loading indicator during generation |
| `campaigns-results` | Container for generated campaign results |
| `campaign-card-0` | First campaign draft card |
| `campaign-card-1` | Second campaign draft card |
| `campaigns-error` | Error state banner |
| `segment-cards-empty` | Empty state message |

## Viewport sizes

- **Mobile**: 375px × 667px
- **Desktop**: 1440px × 900px

## Rejected alternative

**Alternative rejected**: Using the component's isolated test route `/test/segment-cards` instead of the real page route `/admin/promotions`.

- *Reason*: The component test route exercises only the segment cards in isolation, not the full page flow. Feature 29 requires verifying the complete end-to-end flow: page load -> segment cards rendered -> generation trigger -> skeleton -> campaign results. Using `/test/segment-cards` would miss the integration between the page, hooks, and the generate API. The real page route `/admin/promotions` is the correct target.
