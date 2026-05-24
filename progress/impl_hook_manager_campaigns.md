# Implementation Handoff — hook_manager_campaigns (Feature ID: 26)

## Summary

Implemented `useCampaigns()` — a client-side React hook that manages the manager campaign workflow. The hook auto-fetches customer segments on mount via `GET /api/v1/promotions/segments` and provides a `generateCampaigns()` callback to trigger AI-powered recovery copy generation via `GET /api/v1/promotions/generate`.

## Files Changed

- [NEW] `src/hooks/use-campaigns.hook.ts` — Client hook with `"use client"` directive. Exposes dual independent state groups (segments + campaigns) with separate loading and error states.
- [NEW] `tests/integration/hook-manager-campaigns.integration.test.ts` — 11 integration tests (R1–R9) with `@vitest-environment jsdom`, mocked `fetch`.

## Behavior Delivered

- **Segments auto-fetch**: On mount, the hook issues `GET /api/v1/promotions/segments` and exposes `segments`, `segmentsLoading`, `segmentsError`.
- **Campaign generation**: `generateCampaigns()` triggers `GET /api/v1/promotions/generate` and exposes `campaigns`, `generating`, `generateError`.
- **Independent states**: Segments and generation have separate loading/error states, allowing the UI to display segments while generation runs.
- **Error handling**: Non-200 responses, `success: false` payloads, and network failures all produce descriptive error strings.
- **Clean lifecycle**: Prior `campaigns` data is cleared on new generation; segments persist across generations.

## Commands Run & Results

| Command | Result |
|---------|--------|
| `pnpm test` | 18 files, 151 tests — all green |
| `pnpm lint` | Clean, no warnings |
| `pnpm build` | Production build compiled successfully |

## Traceability

| Requirement | Test File | Test Name |
|---|---|---|
| R1 | `hook-manager-campaigns.integration.test.ts` | `"R1: exposes segments, campaigns, loading states, error states, and generateCampaigns"` |
| R2 | `hook-manager-campaigns.integration.test.ts` | `"R2, R3: auto-fetches segments on mount and loading toggles until settled"` |
| R3 | `hook-manager-campaigns.integration.test.ts` | `"R3: sets segments and clears error on 200 success"` |
| R4 | `hook-manager-campaigns.integration.test.ts` | `"R4: sets segmentsError on non-200 response"`, `"R4: sets segmentsError when success is false on 200 response"` |
| R5 | `hook-manager-campaigns.integration.test.ts` | `"R5: sets generic segmentsError on network failure"` |
| R6 | `hook-manager-campaigns.integration.test.ts` | `"R6: generateCampaigns sets generating true and clears prior campaigns"` |
| R7 | `hook-manager-campaigns.integration.test.ts` | `"R7: generate success sets campaigns array"` |
| R8 | `hook-manager-campaigns.integration.test.ts` | `"R8: generate error sets generateError and clears campaigns"`, `"R8: generate network failure sets generic error"` |
| R9 | `hook-manager-campaigns.integration.test.ts` | `"R9: full lifecycle — segments load, generate yields campaigns"` |

## E2E Gate

**Decision**: N/A — this is a single-layer frontend hook change (no backend, database, or cross-layer modifications). The hook is a pure data-fetch abstraction consumed by Features 27+ which will have their own E2E coverage.

## Reviewer Instructions

1. Verify that 151 tests pass: `pnpm test`
2. Verify lint: `pnpm lint`
3. Verify build: `pnpm build`
4. Review `src/hooks/use-campaigns.hook.ts` for compliance with the approved spec
5. Review `tests/integration/hook-manager-campaigns.integration.test.ts` for requirement coverage
