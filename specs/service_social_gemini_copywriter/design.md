# Design — Feature 40: service_social_gemini_copywriter

## Files to modify

| File | Action | Description |
|------|--------|-------------|
| `src/backend/services/ai.service.ts` | **Modify** | Add `generateSocialPostSuggestions` static method with prompt builder, response parser, field validator, and character-limit enforcer |
| `src/backend/controllers/social.controller.ts` | **Modify** | Update `handleSocialIdeas` to build base prompt, apply `decorate()` from social-prompt.decorator, then call the new method |
| `src/backend/types/models.type.ts` | **Modify** | Add character-limit constants for social post fields |
| `tests/integration/service_social_gemini_copywriter.test.ts` | **Create** | New integration test suite (per acceptance criteria) |

## New constants

Added to `src/backend/types/models.type.ts`:

```typescript
export const SOCIAL_POST_LIMITS = {
  TITLE_MAX: 80,
  BODY_MAX: 280,
  VISUAL_PROMPT_MAX: 200,
  HASHTAGS_MAX: 5,
  HASHTAG_MAX_LENGTH: 30,
  MAX_IDEAS: 3,
} as const;
```

## Public interface

```typescript
// Added to src/backend/services/ai.service.ts

/**
 * Generates structured social media post suggestions via Gemini.
 * @param prompt - Fully decorated prompt string (context + optional flash sale injection)
 * @returns Array of validated SocialIdea objects
 */
static async generateSocialPostSuggestions(
  prompt: string
): Promise<SocialIdea[]>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `string` | Pre-built prompt that includes the user's context description, optionally decorated with flash-sale instructions by `social-prompt.decorator.ts` |

Returns: `Promise<SocialIdea[]>` — up to 3 validated social post idea objects.

## Prompt template structure

The method builds the full Gemini prompt by wrapping the input `prompt` with formatting instructions:

```
You are a social media copywriter for a local business. 
Generate up to 3 social media post ideas.

For each idea, respond with a JSON object containing these fields:
- "title": string (max 80 characters, attention-grabbing headline)
- "body": string (max 280 characters, the post body text)
- "visualPrompt": string (max 200 characters, description of an image to accompany the post)
- "hashtags": string[] (max 5 tags, each max 30 characters)

Respond ONLY with a JSON array of objects. No markdown, no code fences, no additional text.

Business context:
{decoratedPrompt}
```

## Data flow

```
SocialController.handleSocialIdeas(context, transactions)
  │
  ├── Validate context (≥3 chars, done by controller)              ← existing
  │
  ├── Build base prompt string:
  │     "Generate social media posts for: {context}"
  │
  ├── Apply decorator:
  │     prompt = decorate(basePrompt, transactions)                 ← Feature 38 decorator
  │     (appends flash sale tag on low-traffic days)
  │
  ├── Call AIService.generateSocialPostSuggestions(prompt)          ← NEW method
  │     │
  │     ├── logger.info("generateSocialPostSuggestions started")     ← R9
  │     │
  │     ├── Build Gemini prompt (wrap with formatting instructions)  ← R2
  │     │
  │     ├── Call Gemini via callGemini(fullPrompt)                  ← existing
  │     │     │
  │     │     ├── Success → parse JSON                              ← R3
  │     │     │     ├── Validate each item's fields                 ← R4
  │     │     │     ├── Enforce character limits per field          ← R5
  │     │     │     ├── logger.info(count of ideas)                 ← R10
  │     │     │     └── Return SocialIdea[]
  │     │     │
  │     │     └── Failure (throw/error)
  │     │           ├── logger.error(reason)                        ← R11
  │     │           └── Return simulated SocialIdea[]               ← R7
  │     │
  │     └── JSON parse failure
  │           ├── logger.warn("malformed response")                 ← R11
  │           └── Return simulated SocialIdea[]                     ← R6
  │
  └── Return { success, data: { ideas } } to API pasamanos
```

## Response validation algorithm

For each item in the parsed JSON array:

1. Verify it is a non-null object.
2. Verify `title` is a non-empty string — if missing, assign fallback title ("New Post").
3. Verify `body` is a non-empty string — if missing, assign fallback body ("Check out what's happening at our store!").
4. Verify `visualPrompt` is a non-empty string — if missing, assign fallback ("A photo of our team at work").
5. Verify `hashtags` is a non-empty array of strings — if missing, assign default hashtags `["#localbusiness", "#shoplocal"]`.
6. Enforce character limits: truncate each field at its max length at the nearest word boundary.
7. Cap the hashtags array at 5 items; truncate each hashtag at 30 chars.
8. Cap the result array at 3 items.

## Simulated fallback response

When the LLM fails or returns unparseable content, the method returns a simulated `SocialIdea[]` using the original prompt context for personalization:

```typescript
[
  {
    title: "New Post: {context}",
    body: `Check out what's happening at our store! ${context}`,
    visualPrompt: "A photo of our team working on " + context,
    hashtags: ["#localbusiness", "#community", "#shoplocal"],
  },
  {
    title: "Behind the Scenes",
    body: "Get a sneak peek behind the scenes of what makes our business special.",
    visualPrompt: "Behind-the-scenes photo of the team preparing for the day",
    hashtags: ["#behindthescenes", "#smallbusiness", "#familyowned"],
  },
  {
    title: "Customer Spotlight",
    body: "We love our customers! Thanks for being part of our journey.",
    visualPrompt: "Happy customer holding a product with a smile",
    hashtags: ["#customerlove", "#thankyou", "#communityfirst"],
  },
]
```

## Error handling

| Scenario | Behavior |
|----------|----------|
| Gemini API call throws | Log `logger.error`, return simulated `SocialIdea[]` (R7) |
| Gemini returns empty string | Log `logger.warn`, return simulated `SocialIdea[]` (R6) |
| Response not valid JSON | Log `logger.warn`, return simulated `SocialIdea[]` (R6) |
| JSON has missing/null fields | Fill with defaults per item (R4) |
| Fields exceed char limits | Truncate at word boundary (R5) |
| Empty/whitespace-only prompt | Log warning, return single default idea (R8) |
| Hashtags > 5 items | Truncate to first 5 (R5) |

## Rejected alternative: Accept raw context and let service apply decorator

**Considered:** Having `generateSocialPostSuggestions` accept `context: string` and `isLowTrafficDay: boolean` directly, duplicating the decorator logic inside the service.

**Rejected because:**

1. Violates the Single Responsibility Principle — the AI service should not also be a prompt decorator.
2. The `social-prompt.decorator.ts` module was already created (Feature 38) as a composable, testable unit. Duplicating its logic in the service would create a maintenance burden.
3. The decorator may add other injections in the future (holiday campaigns, inventory clearance). Keeping the service input as a raw string makes it future-proof — the service does not need to know about traffic analysis or campaign logic.
4. The controller is the natural orchestrator: it builds the base prompt, optionally decorates it, then passes it to the AI service.

## Rejected alternative: Extend existing `generateSocialIdeas` instead of new method

**Considered:** Adding all validation and fallback logic directly into the existing `generateSocialIdeas(context)` method.

**Rejected because:**

1. The existing method accepts `context: string`, not a decorated prompt. Changing its signature would break the existing caller contract.
2. Mixing the old simulation logic with the new structured validation would create a tangled method with multiple responsibilities.
3. A separate method (`generateSocialPostSuggestions`) keeps backward compatibility and makes the feature's changes explicit and testable in isolation.

## Mock strategy for testing

The integration test mocks `AIService.callGemini` (or the underlying `fetch` call) to return controlled responses:

- **Happy path mock**: Return a valid JSON string representing 3 `SocialIdea` objects.
- **Malformed JSON mock**: Return `"not json"` to trigger parse fallback.
- **Empty response mock**: Return `""` to trigger empty-handling fallback.
- **Missing fields mock**: Return JSON array where some items lack required fields.
- **Over-limit mock**: Return fields exceeding character limits to assert truncation.
- **Rejection mock**: Throw an error to simulate API failure.

The existing testing pattern from `service_gemini_recovery_prompt` uses per-customer mock isolation. The new test should mock at the `callGemini` level using Vitest's `vi.spyOn` or by setting `GEMINI_API_KEY` to empty to fall through to `simulateGeminiResponse` (then asserting the simulated output matches expected structure).

## Next.js local docs consulted

No Next.js-specific docs were relevant for this feature — it is a pure backend service change with a thin controller update. No `node_modules/next/dist/docs/` files were consulted.
