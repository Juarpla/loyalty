# Requirements — Feature 40: service_social_gemini_copywriter

## R1 — Method accepts decorated prompt and returns SocialIdea[]
The system MUST expose a `generateSocialPostSuggestions` static method on the `AIService` class that accepts a `prompt` string (pre-decorated with context and optional flash-sale injection) and returns a `Promise` resolving to an array of `SocialIdea` objects.

## R2 — Prompt includes structured output constraints
WHEN building the Gemini prompt, the system MUST include:
- An instruction to respond exclusively with a JSON array of objects.
- Each object MUST contain `title`, `body`, `visualPrompt`, and `hashtags` fields.
- Field-level constraints: `title` ≤ 80 chars, `body` ≤ 280 chars, `visualPrompt` ≤ 200 chars, `hashtags` array with max 5 tags each ≤ 30 chars.
- The original decorated prompt string MUST be appended as the business context.

## R3 — Response parsed as JSON
WHEN the Gemini API returns a response, the system MUST attempt to parse it as a JSON array. IF parsing succeeds, the system MUST return the first 3 items as `SocialIdea[]`.

## R4 — Field-level validation of each idea
WHEN parsing the JSON response, the system MUST validate that each item contains non-empty string values for `title`, `body`, and `visualPrompt`, and a non-empty array of strings for `hashtags`. IF any item fails validation, the system MUST replace that item with a default idea constructed from the original prompt context.

## R5 — Character limit enforcement per field
WHERE a parsed field exceeds its character limit, the system MUST truncate at the nearest word boundary. Fields enforce: `title` ≤ 80, `body` ≤ 280, `visualPrompt` ≤ 200, each `hashtag` ≤ 30, `hashtags` array ≤ 5 items.

## R6 — Fallback on JSON parse failure
IF the Gemini response is not valid JSON or the parsed array is empty, THEN the system MUST return simulated `SocialIdea[]` derived from the input prompt context and log a warning.

## R7 — Fallback on LLM failure
IF the Gemini API call throws or rejects (network error, timeout, API error), THEN the system MUST return simulated `SocialIdea[]` and log the error details via `logger.error`.

## R8 — Empty prompt handling
IF the input prompt string is empty or whitespace-only, THEN the system MUST log a warning and return a single default `SocialIdea` with fallback copy ("Share what makes your business special today!").

## R9 — Logs method invocation
WHEN `generateSocialPostSuggestions` is called, the system MUST log via `logger.info` with the prompt length and a truncated preview of the prompt.

## R10 — Logs per-response success
WHEN the LLM returns valid structured ideas, the system MUST log via `logger.info` with the count of generated ideas.

## R11 — Logs per-response failure
IF the LLM call fails OR JSON parsing fails, the system MUST log via `logger.warn` or `logger.error` with the failure reason.

## R12 — Integration tests mock Gemini API response schemas
WHEN the integration test suite runs, the system MUST:
- Replace the `callGemini` method with a mock that returns a valid JSON response matching the `SocialIdea[]` schema.
- Assert the returned array contains valid `SocialIdea` objects with correct field types and truncated values.
- Assert fallback behavior when Gemini returns malformed JSON.
- Assert fallback behavior when Gemini throws an error.
- Assert empty prompt handling.
