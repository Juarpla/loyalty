# Tasks - hook_manager_campaigns (Feature ID: 26)

- [x] **T1**: Implement `src/hooks/use-campaigns.hook.ts` with `"use client"` directive, segments auto-fetch from `GET /api/v1/promotions/segments`, and `generateCampaigns` callback to `GET /api/v1/promotions/generate`. Expose: `segments`, `segmentsLoading`, `segmentsError`, `campaigns`, `generating`, `generateError`, `generateCampaigns`. Covers: R1, R2, R3, R4, R5, R6, R7, R8.

- [x] **T2**: Create `tests/integration/hook-manager-campaigns.integration.test.ts` with `// @vitest-environment jsdom`, mocked `fetch`, covering: segments auto-fetch on mount (R2/R3), segments API error (R4), segments network failure (R5), generate trigger and loading toggles (R6), generate success (R7), generate error (R8). Covers: R1–R9.

- [x] **T3**: Run `./init.sh --quick` and `./init.sh`; confirm all integration tests pass and lint is green. Covers: all requirements.
