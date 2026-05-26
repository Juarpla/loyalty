# Implementation — Feature 40: service_social_gemini_copywriter

## Summary

Implemented `AIService.generateSocialPostSuggestions()` — a new static method that accepts a pre-decorated prompt string, builds a structured Gemini prompt with JSON output constraints, parses the LLM response, validates each field with defaults for missing values, enforces character limits with word-boundary truncation, and returns up to 3 `SocialIdea[]` objects. Includes full fallback chain (empty prompt → single default, LLM failure → simulated, JSON parse failure → simulated) with logging at every stage.

Updated `SocialController.handleSocialIdeas` to build a base prompt, apply the `decorate()` from `social-prompt.decorator.ts`, and call the new method instead of the old `generateSocialIdeas`.

## Files changed or created

| File | Action |
|------|--------|
| `src/backend/types/models.type.ts` | Modified — added `SOCIAL_POST_LIMITS` constants |
| `src/backend/services/ai.service.ts` | Modified — added `generateSocialPostSuggestions`, `validateSocialIdea`, `simulateSocialPostFallback`, `truncateAtWordBoundary` |
| `src/backend/controllers/social.controller.ts` | Modified — updated `handleSocialIdeas` to use decorator + new method |
| `tests/integration/controller_social_ideas.integration.test.ts` | Modified — updated mocks to target new method |
| `tests/integration/service_social_gemini_copywriter.integration.test.ts` | Created — new integration test suite |
| `specs/service_social_gemini_copywriter/tasks.md` | Modified — marked T1–T12 complete |

## Test results

`pnpm test:agent`: **25 test files passed, 204 tests passed** (was 24 files / 186 tests — 1 new test file with 18 new tests added, 3 old controller tests removed/replaced)

## Lint

`pnpm lint`: **0 errors, 1 pre-existing warning** (unrelated `ContextFormProps` in `src/app/test/context-form/page.tsx`)

## Traceability

| Requirement | Test(s) |
|-------------|---------|
| R1 — Method accepts prompt, returns SocialIdea[] | `service_social_gemini_copywriter.integration.test.ts` — "R3: SHALL return correctly shaped SocialIdea[]" |
| R2 — Structured output constraints in prompt | Covered by `truncateAtWordBoundary` tests and limit enforcement tests (R5) |
| R3 — Parse JSON, return first 3 items | "R3: SHALL return correctly shaped SocialIdea[]" + "R3: SHALL return only first 3 items" |
| R4 — Field-level validation with defaults | "R4: SHALL fill missing body and visualPrompt with defaults" + "R4: SHALL fill completely empty object with all defaults" |
| R5 — Character limit enforcement | "R5: SHALL truncate over-limit fields at word boundary" + "SHALL preserve text under the limit" + "SHALL truncate at word boundary when over limit" |
| R6 — Fallback on JSON parse failure | "R6: SHALL return simulated SocialIdea[] when Gemini returns malformed JSON" + "R6: SHALL log warning on malformed JSON" + "R6: SHALL return simulated response when Gemini returns empty string" |
| R7 — Fallback on LLM failure | "R7: SHALL return simulated SocialIdea[] when Gemini throws" + "R7: SHALL log error when Gemini call fails" |
| R8 — Empty prompt handling | "R8: SHALL return single default idea when prompt is empty string" + "R8: SHALL return single default idea when prompt is whitespace" + "R8: SHALL log warning on empty prompt" |
| R9 — Logs method invocation | "R9: SHALL log at start with prompt length and preview" |
| R10 — Logs per-response success | "R10: SHALL log count of returned ideas on success" |
| R11 — Logs per-response failure | "R11: SHALL log warning when JSON parse fails" |
| R12 — Integration tests mock Gemini | All integration tests above mock `callGemini` |

## E2E gate

**Decision: skipped** — this feature is a backend-only service and controller change with no frontend components. No E2E tests needed.

## Handoff

Recommend **`in_review`** for Feature 40.
