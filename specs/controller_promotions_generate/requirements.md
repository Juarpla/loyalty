# Requirements — Feature 24: controller_promotions_generate

## R1 — Method fetches customer segments and filters inactive customers
The system MUST fetch all customer segments via `ClientModel.getCustomerSegments()` and filter the result to customers whose `segment` equals `'inactive_30d'`.

## R2 — Method invokes AIService with inactive customers
WHEN inactive-30d customers are identified, the system MUST call `AIService.generateRecoveryPrompts()` passing the filtered customer array.

## R3 — Method compiles offers from recovery prompts
WHEN recovery prompts are returned, the system MUST compile a `campaigns` array from the `GeminiRecoveryPromptResult[]` preserving each entry's `phone_number`, `recoveryCopy`, and `generatedAt` fields.

## R4 — Method returns structured response with campaigns
The system MUST return an object with `{ success: true, data: { campaigns: GeminiRecoveryPromptResult[] } }` when generation succeeds.

## R5 — Fallback discount on AIService failure
IF `AIService.generateRecoveryPrompts()` throws or rejects, THEN the system MUST catch the error and return a fallback response containing a default discount message applied to all inactive customers in place of AI-generated copy.

## R6 — Empty campaigns when no inactive customers exist
IF no customers with `segment === 'inactive_30d'` are found, THEN the system MUST return `{ success: true, data: { campaigns: [] } }` without invoking the AI service.

## R7 — Method logs invocation
WHEN `generate()` is called, the system MUST log `"PromotionsController.generate started"` via `logger.info`.

## R8 — Method logs errors
WHEN an error occurs during segment fetch or AI prompt generation, the system MUST log the failure message via `logger.error` with the method identifier and error details.

## R9 — DB_CONNECTION_FAILURE propagated
IF `ClientModel.getCustomerSegments()` throws `"DB_CONNECTION_FAILURE"`, THEN the system MUST return `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }`.

## R10 — Integration tests verify successful generation flow
WHEN the integration test suite runs with a mock that returns inactive customers and a mock `AIService` that resolves successfully, the system MUST verify the response shape with `success: true` and a non-empty `data.campaigns` array.

## R11 — Integration tests verify fallback injection
WHEN the integration test suite runs with a mock `AIService` that rejects, the system MUST verify that `data.campaigns` contains entries with the fallback discount message text for each inactive customer.

## R12 — Integration tests verify empty campaigns on no inactive customers
WHEN the integration test suite runs with segmentation returning zero inactive-30d customers, the system MUST verify that `data.campaigns` is an empty array and `AIService.generateRecoveryPrompts` was never called.
