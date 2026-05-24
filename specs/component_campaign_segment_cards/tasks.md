# Tasks: Campaign Segment Cards UI Component

- [x] **T1**: Create `src/components/promotions/` directory and `segment-cards.component.tsx` with:
  - `"use client"` directive
  - `SegmentCardsProps` interface accepting `segments`, `segmentsLoading`, `segmentsError`, `onSegmentSelect`, and `onRetry`
  - Four rendering states: loading (skeleton), error (banner + retry), empty (info message), populated (segment cards)
  - Segment type labels: "Inactive 30 Days", "High Spender", "Frequent" with distinct visual indicators (color + icon per segment type)
  - Action trigger button on each card calling `onSegmentSelect(segmentType)`
  - Responsive layout: single column on mobile, multi-column grid on larger viewports
  - Import types from `@/backend/types/models.type`
  - Touch-friendly button sizing (min 44px height)
  - Covers: R1, R2, R3, R4, R5, R6, R7

- [x] **T2**: Create E2E test harness page at `src/app/test/segment-cards/page.tsx` that:
  - Renders `SegmentCards` with mock data for each state
  - Covers: all requirements

- [x] **T3**: Write Playwright E2E tests in `tests/e2e/component_campaign_segment_cards.e2e.test.ts` with tests for:
  - Populated state: segment cards render with correct labels and counts (R1, R2)
  - Loading state: skeleton placeholders render (R3)
  - Error state: error banner and retry button render (R4)
  - Empty state: empty message renders (R5)
  - Action trigger: button click invokes callback with correct segment type (R6)
  - Mobile viewport: cards stack vertically without horizontal overflow at 375px width (R7)
  - Covers: R1, R2, R3, R4, R5, R6, R7, R8

- [x] **T4**: Run `pnpm lint` to verify no linting errors. Covers: all requirements.

- [x] **T5**: Run `pnpm build` to verify production build succeeds. Covers: all requirements.

- [x] **T6**: Run `./init.sh` to confirm full harness check passes. Covers: all requirements.
