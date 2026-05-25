# Design: Social Suggestions Controller Action

## Files to Change

| File | Action | Description |
|------|--------|-------------|
| `src/backend/controllers/social.controller.ts` | **Create** | New controller handling social idea requests |
| `tests/integration/controller_social_ideas.test.ts` | **Create** | Integration tests for all requirement coverage |

## Public Interface

### `POST /api/v1/social/ideas` (via pass-through API route)

**Request body:**
```typescript
{
  "context": string  // Business context description, min 3 chars
}
```

**Success response (200):**
```typescript
{
  "success": true,
  "data": {
    "ideas": [
      {
        "title": string,
        "body": string,
        "visualPrompt": string,
        "hashtags": string[]
      }
    ]
  }
}
```

**Validation error response (400):**
```typescript
{
  "success": false,
  "error": "Context must be at least 3 characters long"
}
```

**Server error response (500):**
```typescript
{
  "success": false,
  "error": "Internal server error"
}
```

### Controller exported function

```typescript
export async function handleSocialIdeas(
  context: string
): Promise<NextResponse>
```

## Data Flow

```
API Route (pasamanos) 
  → extracts `context` from request body 
  → calls controller.handleSocialIdeas(context)
    → validates context (min 3 chars)
    → if invalid: return 400
    → invokes aiService.generateSocialIdeas(context)
    → formats response with generated ideas
    → return 200
```

## Error Handling

- **Validation errors**: Caught at the top of the controller. Return 400 with `{ success: false, error: "<message>" }`.
- **AI service errors**: Wrapped in try/catch. Return 500 with `{ success: false, error: "Internal server error" }`.
- **Missing body**: Handle gracefully — treated as validation failure (null context → 400).

## Dependencies

- `@/backend/services/ai.service` — existing Gemini integration service for AI copywriting

## Rejected Alternative

**Validation in API route**: Placing validation logic directly in the API route (`route.ts`) was considered but rejected. Keeping validation in the controller layer maintains the pasamanos pattern where routes are thin pass-throughs with zero business logic, and controllers own all request processing concerns. This also makes the controller independently testable without HTTP routing.

## Next.js Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — API route patterns
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — Server/Client boundaries
