# Implementation Handoff: api_social_ideas_route (Feature ID: 34)

## Summary

Created the thin API route pasamanos at `POST /api/v1/social/ideas` that accepts a `context` string, delegates to the existing `SocialController.handleSocialIdeas()`, and returns the controller's response as JSON. Follows the exact pasamanos pattern established in F25 (`api_promotions_generate_route`).

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/app/api/v1/social/ideas/route.ts` | **Created** | POST handler — parses JSON body, extracts `context`, delegates to controller, maps success/error responses, catches unexpected exceptions |
| `tests/integration/api_social_ideas_route.test.ts` | **Created** | Integration tests covering all R4–R6 scenarios |
| `specs/api_social_ideas_route/tasks.md` | **Updated** | T1 and T2 marked `[x]` |

## Verification

| Check | Result |
|-------|--------|
| `pnpm test` (20 files, 161 tests) | ✅ Passed |
| `pnpm lint` | ✅ Passed |
| `pnpm build` | ✅ Passed (new route `/api/v1/social/ideas` listed as dynamic) |
| `./init.sh` (full) | ✅ Passed |

## Requirement Traceability

| Requirement | Coverage | Test |
|------------|----------|------|
| **R1**: POST handler exported | Route file exports `POST` function | Compilation check + all tests invoke `POST()` |
| **R2**: Request body parsing | Route calls `request.json()` and extracts `context` | R4 test sends valid body → 200 |
| **R3**: Logging on invocation | Route calls `logger.info` with context | Code inspection |
| **R4**: Successful generation (200) | Controller `success: true` → 200 | `"R4: should return 200 OK with success payload containing ideas"` |
| **R5**: Controller error mapping | Controller `success: false` → `result.status` | `"R5: should return 400 on controller validation error"` and `"R5: should return 500 on controller server error"` |
| **R6**: Unexpected exception fallback (500) | Catch block returns INTERNAL_SERVER_ERROR | `"R6: should return 500 with INTERNAL_SERVER_ERROR on unexpected exception"` |
| **R7**: Integration test coverage | Test file covers all scenarios above | All test entries include requirement ID prefix |

## E2E Gate Decision

**Skipped.** This feature is a single-layer backend change (thin API route pasamanos) with no UI components, no frontend changes, and no cross-layer data flows. The existing integration tests provide full coverage.
