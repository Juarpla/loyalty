# Requirements — Feature 23: service_gemini_recovery_prompt

## R1 — Method accepts customers and returns recovery copy
The system MUST expose a `generateRecoveryPrompts` static method on the `AIService` class that accepts an array of `SegmentedCustomer` objects and returns a `Promise` resolving to an array of `GeminiRecoveryPromptResult` objects.

## R2 — Prompt includes customer context
WHEN building the Gemini prompt for a customer, the system MUST include the customer's name, visit count, and last transaction date (or "no previous visits" when null).

## R3 — Prompt instructs 180-character limit
WHEN building the Gemini prompt, the system MUST include an instruction that the generated recovery copy must not exceed 180 characters.

## R4 — Response enforces 180-character limit
WHERE the LLM response exceeds 180 characters, the system MUST truncate the copy to 180 characters at the nearest word boundary.

## R5 — Fallback on LLM failure
IF the Gemini API call throws or rejects, THEN the system MUST return a fallback message for that customer containing "We miss you! Visit us soon for a special treat."

## R6 — Logs method invocation
WHEN `generateRecoveryPrompts` is called, the system MUST log the start via `logger.info` with the count of customers received.

## R7 — Logs LLM failure
IF the Gemini API call fails for a customer, THEN the system MUST log the error via `logger.error` with the customer's phone number and error details.

## R8 — Logs per-customer success
WHEN the LLM returns a valid response for a customer, the system MUST log via `logger.info` with the customer's phone number and character count of the generated copy.

## R9 — Integration tests mock LLM calls
WHEN the integration test suite runs, the system MUST replace the Gemini SDK call with a mock function that returns a controlled response and verify the 180-character enforcement.

## R10 — Integration tests verify fallback behavior
WHEN the integration test suite runs with a rejected LLM mock, the system MUST verify the fallback message is returned for each failing customer.
