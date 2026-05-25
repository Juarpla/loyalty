# Tasks - api_social_ideas_route (Feature ID: 34)

- [x] **T1**: Create Next.js App Router API route `src/app/api/v1/social/ideas/route.ts` with POST handler that parses JSON body for `context`, logs via `logger.info`, delegates to `SocialController.handleSocialIdeas(context)`, maps controller results to `NextResponse.json` with appropriate status codes, and wraps in try/catch for unexpected exceptions. Covers: R1, R2, R3, R4, R5, R6.
- [x] **T2**: Create the integration test suite in `tests/integration/api_social_ideas_route.test.ts` using Vitest to verify POST endpoint routing, 200 success response with generated ideas, controller error status mapping (400 validation error), and 500 fallback for unexpected exceptions. Covers: R1, R4, R5, R6, R7.
- [x] **T3**: Run `./init.sh --quick` then `./init.sh` to confirm compilation, all integration tests pass (including existing ones), and linters are green. Covers: R7.
