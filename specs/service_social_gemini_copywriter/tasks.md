# Tasks — Feature 40: service_social_gemini_copywriter

- [x] T1 — Add `SOCIAL_POST_LIMITS` constants to `src/backend/types/models.type.ts`. Covers: R2, R5.

- [x] T2 — Add `generateSocialPostSuggestions(prompt: string): Promise<SocialIdea[]>` static method signature to `AIService` class in `src/backend/services/ai.service.ts`. Covers: R1.

- [x] T3 — Implement the Gemini prompt builder that wraps the input prompt with structured output constraints (JSON array, field descriptions, character limits per field). Covers: R2.

- [x] T4 — Implement JSON response parsing with try/catch. On parse failure, log warning and return simulated `SocialIdea[]`. Covers: R3, R6, R11.

- [x] T5 — Implement field-level validation for each parsed item: verify `title`, `body`, `visualPrompt` are non-empty strings and `hashtags` is a non-empty string array. Fill missing fields with defaults. Covers: R4.

- [x] T6 — Implement per-field character limit enforcement with word-boundary truncation for all fields (title ≤ 80, body ≤ 280, visualPrompt ≤ 200, hashtag ≤ 30, max 5 hashtags). Covers: R5.

- [x] T7 — Implement fallback: when Gemini call throws (network error, timeout, API error), log `logger.error` with error details and return simulated `SocialIdea[]`. Covers: R7, R11.

- [x] T8 — Implement empty-prompt guard: when prompt is empty or whitespace-only, log warning and return a single default `SocialIdea`. Covers: R8.

- [x] T9 — Add `logger.info` call at method start logging prompt length and truncated preview. Covers: R9.

- [x] T10 — Add `logger.info` call after successful generation logging the count of returned ideas. Covers: R10.

- [x] T11 — Update `SocialController.handleSocialIdeas` in `src/backend/controllers/social.controller.ts` to:
  - Build a base prompt from the context string.
  - Apply `decorate(prompt, transactions)` from `social-prompt.decorator.ts`.
  - Call `AIService.generateSocialPostSuggestions(decoratedPrompt)` instead of `AIService.generateSocialIdeas(context)`.
  - Pass `transactions` (fetched from model layer or empty array) to the decorator.
  Covers: R1 (integration wiring).

- [x] T12 — Write integration test file `tests/integration/service_social_gemini_copywriter.integration.test.ts` with these test cases:
  - Valid Gemini JSON response returns correctly shaped `SocialIdea[]`. Covers: R3, R12.
  - Malformed JSON triggers simulated fallback. Covers: R6, R12.
  - Gemini API error triggers simulated fallback with error log. Covers: R7, R12.
  - Missing fields in some items are filled with defaults. Covers: R4, R12.
  - Over-limit fields are correctly truncated. Covers: R5, R12.
  - Empty prompt returns single default idea. Covers: R8, R12.
  - Mocked response with >3 items returns only first 3. Covers: R3.
  Covers: R12.

- [x] T13 — Run `./init.sh` and verify all tests pass with no lint errors. Covers: R1–R12.
