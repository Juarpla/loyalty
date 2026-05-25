# Tasks - hook_social_content (Feature ID: 35)

- [x] **T1**: Implement `src/hooks/use-social.hook.ts` with `"use client"` directive, `context`/`setContext` form state, `ideas` array state, `loading`/`error`/`successMessage` state, and `generateIdeas` callback that POSTs to `/api/v1/social/ideas`. Covers: R1, R2, R3, R4, R5, R6.
- [x] **T2**: Create `tests/integration/hook_social_content.integration.test.ts` with `// @vitest-environment jsdom`, mocked `global.fetch`, and test cases: R2/R3 loading toggle; R4 success stores ideas and clears context; R5 API error preserves context; R6 network failure preserves context. Covers: R1–R6.
- [x] **T3**: Run `./init.sh --quick` and `./init.sh`; confirm all integration tests pass and lint is green. Covers: all requirements.
