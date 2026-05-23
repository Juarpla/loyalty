# Tasks: Dashboard Predictive Alert UI Card Component

## Task 1: Create Predictive Card Component ✅

Create `src/components/dashboard/predictive-card.component.tsx` with:
- `"use client"` directive
- `PredictiveCardProps` interface accepting `prediction: PredictionResult | null`
- Three rendering states: loading (skeleton), inactive, active
- Import `PredictionResult` from `@/backend/types/models.type`
- Visual styling consistent with existing `TrafficChartComponent` patterns
- Shift direction color coding: green (increasing), red (decreasing), amber (stable)
- Human-readable prediction summary text based on `projectedWeekendShift`

**Verification:** Component compiles without TypeScript errors. `pnpm build` succeeds. ✅

## Task 2: Create Dashboard Directory (if needed) ✅

Ensure `src/components/dashboard/` directory exists. Create it if it does not already exist.

**Verification:** Directory exists and component file is placed correctly. ✅

## Task 3: Write Playwright E2E Tests ✅

Create `tests/e2e/component_predictive_card.e2e.test.ts` with tests for:
- Active prediction card renders with correct shift direction text and color indicators
- Inactive prediction card renders with "insufficient data" message
- Null prediction renders skeleton loading state
- Mobile viewport (375px width) renders without horizontal overflow

**Verification:** `pnpm test:e2e` passes (36/36 tests, including 6 new predictive card tests). ✅

Also created `src/app/test/predictive-card/page.tsx` as a test harness page for E2E verification.

## Task 4: Run Integration Tests ✅

Run existing integration tests to ensure no regressions.

**Verification:** `pnpm test` passes fully green (88/88 tests). ✅

## Task 5: Run Full Harness Check ✅

Run `./init.sh` to verify all harness constraints are satisfied.

**Verification:** `./init.sh` returns `[OK] harness ready (full)`. ✅
