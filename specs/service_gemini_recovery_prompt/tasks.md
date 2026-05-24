# Tasks — Feature 23: service_gemini_recovery_prompt

- [x] T1 — Add `GeminiRecoveryPromptInput` and `GeminiRecoveryPromptResult` interfaces to `src/backend/types/models.type.ts`. Covers: R1.
- [x] T2 — Add `generateRecoveryPrompts` static method signature to `AIService` class in `src/backend/services/ai.service.ts`. Covers: R1.
- [x] T3 — Implement prompt builder function that formats customer context (name, visit count, last transaction date) into a Gemini prompt string. Covers: R2.
- [x] T4 — Include explicit 180-character limit instruction in the prompt template. Covers: R3.
- [x] T5 — Implement post-response character limit enforcement with word-boundary truncation at 180 characters. Covers: R4.
- [x] T6 — Implement fallback message ("We miss you! Visit us soon for a special treat.") when Gemini call fails or returns empty. Covers: R5, R10.
- [x] T7 — Add `logger.info` call at method start logging customer count. Covers: R6.
- [x] T8 — Add `logger.error` call when per-customer Gemini call fails, including phone number and error. Covers: R7.
- [x] T9 — Add `logger.info` call after successful per-customer response, logging phone number and character count. Covers: R8.
- [x] T10 — Write integration test file `tests/integration/service_gemini_recovery_prompt.integration.test.ts` with mocked Gemini SDK that returns valid copy and asserts 180-character enforcement. Covers: R9.
- [x] T11 — Add integration test case with rejected/mocked LLM failure and verify fallback message is returned. Covers: R10.
- [x] T12 — Run `./init.sh` and verify all tests pass with no lint errors. Covers: R1–R10.
