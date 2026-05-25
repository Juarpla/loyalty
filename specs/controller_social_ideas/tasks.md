# Tasks: Social Suggestions Controller Action

- [x] T1 - Create `src/backend/controllers/social.controller.ts` with input validation (context ≥ 3 chars) and error responses. Covers: R1, R2, R5.
- [x] T2 - Wire controller to `ai.service.ts` for generating social post ideas on valid input. Covers: R3.
- [x] T3 - Add error handling for AI service failures (try/catch → 500 response). Covers: R4.
- [x] T4 - Create `tests/integration/controller_social_ideas.integration.test.ts` with tests for validation failure (400), successful generation (200), and server error (500), with requirement ID prefixes. Covers: R1, R2, R3, R4, R5.
