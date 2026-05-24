# Tasks - api_promotions_generate_route (Feature ID: 25)

- [x] **T1**: Create Next.js App Router API route `src/app/api/v1/promotions/generate/route.ts` with GET handler delegating to `PromotionsController.generate()`, logging via `logger.info`, mapping controller results to `NextResponse.json` with appropriate status codes, and wrapping in try/catch for unexpected exceptions. Covers: R1, R2, R3, R4, R5, R6.
- [x] **T2**: Create the integration test suite in `tests/integration/api_promotions_generate_route.test.ts` using Vitest to verify GET endpoint routing, 200 success response, controller error status mapping, and 500 fallback for unexpected exceptions. Covers: R1, R4, R5, R6, R7.
- [x] **T3**: Run `./init.sh --quick` and full `./init.sh` to confirm compilation, all integration tests pass, and linters are green. Covers: R7.
