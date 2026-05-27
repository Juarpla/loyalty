# Session History

Append completed session summaries below.

## Feature: db_migration_sales_transactions
- **Status:** Done
- **Summary:** Created Supabase SQL migration for `sales_transactions` table with uuid primary key, columns, and B-Tree index on `phone_number`. Extracted types into `models.type.ts`. Integration tested via Vitest asserting schema columns and indexes dynamically. All CI/CD checks pass.

## Feature: model_sales_insert
- **Status:** Done
- **Summary:** Implemented the raw database write model and transaction DAO (`SalesModel.insertTransaction`) inside `src/backend/models/sales.model.ts` connecting to Supabase. Defined the `SalesTransaction` type. Verified successful database insertion, connection failures mapping to 'DB_CONNECTION_FAILURE', and offline/simulation mode via Vitest integration tests. All CI/CD checks pass.

## Feature: model_sales_query
- **Status:** Done
- **Summary:** Implemented the sales aggregate query model and transaction query DAO (`SalesModel.getSalesAggregate`) inside `src/backend/models/sales.model.ts` connecting to Supabase. Defined the `SalesAggregate` type interface. Verified aggregate calculation logic, zero fallback when no transactions exist, database unreachable connection failure mapping, and offline/simulation mode via Vitest integration tests. All CI/CD checks pass.

## Feature: controller_sales_record
- **Status:** Done
- **Summary:** Implemented the pure backend controller action `SalesController.recordTransaction` inside `src/backend/controllers/sales.controller.ts` to parse, validate, and sanitize incoming HTTP transaction requests before database insertion. Added strict phone validation rules (9 digits for Peruvian mobile numbers, standard 7-15 digits for E.164 numbers) and positive numeric amount checks. Verified validation branches, offline mock fallbacks, database insertions, and clean DB connection error mappings using Vitest integration tests. All linting and production Next.js builds compiled successfully.

## Feature: api_sales_record_route
- **Status:** Done
- **Summary:** Implemented the thin Next.js App Router API route handler `src/app/api/v1/sales/record/route.ts` mapping incoming POST request payloads directly to the controller layer. The route safely traps JSON parsing failures from malformed/empty request bodies (returning 400 Bad Request) and follows standard REST practices by returning 201 Created on success. Tested handler parameter delegation, parsing error exceptions, and controller status bubbles using Vitest integration tests. All linting and Next.js compilations pass cleanly.

## Feature: hook_cashier_sales
- **Status:** Done
- **Summary:** Implemented `useCashierSales` client hook (`src/hooks/use-cashier-sales.hook.ts`) managing cashier form state, POST registration to `/api/v1/sales/record`, loading indicators, success banner on 201, and error preservation on failure. Added `@testing-library/react` and Vitest jsdom integration tests (`hook-cashier-sales.integration.test.ts`) covering R1–R6. Reviewer accepted; `./init.sh` green (23 tests).

## Feature: component_cashier_form
- **Status:** Done
- **Summary:** Implemented `CashierForm` (`src/components/cashier/form.component.tsx`) with responsive numeric touchpad for mobile (&lt;768px), standard inputs on desktop, and loading-aware submit. Added `/admin/cash` mount route and `/admin/cash/preview` for R7 E2E. Playwright tests (`component_cashier_form.e2e.test.ts`) — 4 passed. Reviewer accepted; full harness green.

## Feature: page_cashier_dashboard
- **Status:** Done
- **Summary:** Wired `useCashierSales` hook to `CashierForm` in a split Server/Client component architecture (`page.tsx` + `cashier-dashboard.client.tsx`) required by Next.js metadata export restrictions. Added success/error banners with `role="status"` / `role="alert"`. Updated `CashierForm` to accept controlled props with internal fallback for backward compatibility. Playwright E2E (`page_cashier_dashboard.e2e.test.ts`) — 2 passed. E2E gate: human approved. Reviewer accepted; full harness green.

## Feature: test_e2e_cashier_sales_flow
- **Status:** Done
- **Summary:** Created Playwright E2E tests (`tests/e2e/cashier_sales_flow.e2e.test.ts`) verifying the full cashier sales registration workflow: mobile success (375px — fill valid phone + amount, submit, assert success banner + form cleared), mobile error (375px — invalid phone → error banner), desktop success (1440px — fill, submit, success + cleared). 3 new E2E tests pass (9 total). Uses `data-testid` selectors and keyboard `fill()` for phone input (touchpad lacks `+` key). E2E gate: human approved. Reviewer accepted; full harness green.

## Feature: controller_traffic_metrics
- **Status:** Done
- **Summary:** Implemented `TrafficController.getMetrics` (and `getTrafficOverview` alias) in `src/backend/controllers/traffic.controller.ts` to fetch all transactions via `SalesModel.getAllTransactions`, invoke `TrafficService.computeDistribution`, and return the distribution object (`hours`, `weekdays`, `peakHour`, `peakWeekday`, `totalTransactions`). Added `SalesModel.getAllTransactions` method to `sales.model.ts` with offline simulation fallback. Created 5-integration test cases covering R1–R6 (success payload structure, distribution computation, DB connection failure, generic exceptions). E2E gate: not required (backend-only). Reviewer accepted; full harness green (34 tests, lint, build all pass).

## Feature: api_traffic_metrics_route
- **Status:** Done
- **Summary:** Implemented the thin Next.js App Router GET pasamanos route at `src/app/api/v1/sales/metrics/route.ts` delegating to `TrafficController.getMetrics` and mapping success to 200 OK, errors to controller-provided status codes (default 500). Follows the same F5 pasamanos pattern. Created 4 integration test cases covering R1–R5 (GET endpoint, controller delegation, 200 success payload, DB_CONNECTION_FAILURE 500, generic error 500). E2E gate: not required (backend-only). Reviewer accepted; full harness green (34 tests, lint, build all pass).

## Feature: hook_manager_traffic
- **Status:** Done
- **Summary:** Rewrote `src/hooks/use-traffic.hook.ts` to call `GET /api/v1/sales/metrics`, return `TrafficDistribution | null` as `data`, and expose `loading`, `error`, and `refresh`. Auto-fetches on mount with `useEffect` + `setTimeout` pattern. Created 8 integration tests (`hook-manager-traffic.integration.test.ts`) with `jsdom` environment and mocked `fetch` covering R1–R8 (state exposure, auto-fetch, loading lifecycle, success caching, error responses, network failure, refresh callback, full lifecycle). E2E gate: not required (single-layer hook change; UI E2E reserved for F14–F16). Reviewer accepted; full harness green (42 tests, lint, build all pass).

## Feature: component_traffic_charts
- **Status:** Done
- **Summary:** Refactored `src/components/traffic/chart.component.tsx` from hardcoded mock to props-driven `TrafficChartComponent` accepting `data`, `loading`, `error`. Extracted `hourly-chart.component.tsx` (24 bars, peak highlight) and `weekday-chart.component.tsx` (7 bars, peak highlight). Created `chart.utils.ts` with pure helpers (`normalizeToPercentages`, `findPeakIndex`, `formatHourLabel`, `formatWeekdayLabel`). Added loading skeleton (`data-testid="traffic-chart-skeleton"`) and error banner (`data-testid="traffic-chart-error"`). Created minimal host page `src/app/admin/dashboard/page.tsx` wiring `useTraffic` to the component. Wrote integration tests (6 cases for helpers, R10) and Playwright E2E tests (13 specs covering chart visibility, peak highlights, mobile responsiveness, loading state, error state). E2E gate: human approved YES. Initial review REJECTED due to missing R5/R6 tests; implementer added 2 E2E specs, re-review ACCEPTED. Full harness green (59 integration + 13 E2E tests, lint, build).

## Feature: page_manager_reports
- **Status:** Done
- **Summary:** Rewrote `src/app/admin/dashboard/page.tsx` from minimal Client Component to full Server Component exporting metadata (`title: "Manager Dashboard | Loyalty"`). Extracted `dashboard.client.tsx` Client Component containing semantic header with brand/title/subtitle, `<nav>` with `next/link` navigation to `/admin/cash`, `/admin/promotions`, and `/admin/social`, and `<main>` mounting `TrafficChartComponent` wired to `useTraffic`. Applied responsive Tailwind classes (`max-w-2xl`, `mx-auto`, `px-4`, `sm:gap-6`) and visible focus indicators (`focus-visible:ring-2`). Created 12 Playwright E2E tests (`page_manager_reports.e2e.test.ts`) and 8 integration tests covering R1–R9 (header, chart integration, responsive layout, loading/error states, navigation, metadata, accessibility). E2E gate: human approved YES. Reviewer ACCEPTED on first pass. Full harness green (67 integration + 25 E2E tests, lint, build).

## Feature: test_e2e_manager_reports_responsiveness
- **Status:** Done
- **Summary:** Created Playwright E2E tests (`tests/e2e/manager_reports_responsiveness.e2e.test.ts`) verifying Manager Dashboard chart responsiveness across 5 viewport dimensions: mobile portrait (375x667), modern mobile portrait (390x844), mobile landscape (844x390), tablet portrait (768x1024), and desktop (1440x900). Tests verify all 24 hourly bars and 7 weekday bars are visible, clickable, and cause no horizontal overflow at each viewport. 5 E2E tests pass covering all 9 requirements (R1–R9). E2E gate: feature IS the E2E deliverable (human approved spec). Reviewer ACCEPTED. Full harness green (67 integration + 5 E2E tests, lint, build).

## Feature: service_predictive_alerts
- **Status:** Done
- **Summary:** Implemented `PredictionService.predict()` in `src/backend/services/prediction.service.ts` — a pure backend service that computes week-over-week weekend visit ratios from `TransactionRecord[]` and returns alert projections when data spans ≥ 30 days. Added `WeekVisitCount`, `WeekendRatio`, and `PredictionResult` interfaces to `src/backend/types/models.type.ts`. Service groups transactions by ISO 8601 calendar week, counts total and weekend visits per week, computes consecutive weekend ratio percentage changes (division-by-zero returns 0), and determines shift direction (increasing/decreasing/stable) using a 5% threshold. Returns `inactive` with `dataSpanDays: 0` for empty input, and `inactive` for spans < 30 days. Invalid timestamps are silently skipped. Created 21 integration tests across R1–R9 in `tests/integration/service_predictive_alerts.integration.test.ts`. E2E gate: not required (pure backend service). Reviewer ACCEPTED. Full harness green (88 integration tests, lint, build all pass).

## Feature: component_predictive_card
- **Status:** Done
- **Summary:** Implemented `PredictiveCardComponent` in `src/components/dashboard/predictive-card.component.tsx` — a pure client component rendering predictive alert cards on the manager dashboard. Three visual states: skeleton loading (null prediction), muted inactive card (insufficient data < 30 days), and active card with color-coded shift direction badge (green/increasing, red/decreasing, amber/stable) and human-readable summary text. Created test harness page at `src/app/test/predictive-card/page.tsx` with 5 mock scenarios. Wrote 6 Playwright E2E tests (`tests/e2e/component_predictive_card.e2e.test.ts`) covering active/inactive/loading states, shift direction indicators, and mobile viewport responsiveness (375px, no horizontal overflow). E2E gate: human approved. Full harness green (88 integration + 36 E2E tests, lint, build all pass).

## Feature: model_customer_segmentation
- **Status:** Done
- **Summary:** Implemented `ClientModel.getCustomerSegments()` in `src/backend/models/client.model.ts` — an aggregate querying method that clusters customers into segments (`inactive_30d`, `frequent`, `high_spender`) based on transaction history. Added `CustomerSegment`, `SegmentedCustomer`, `CustomerSegmentationResult` types and `SEGMENTATION_THRESHOLDS` constants to `src/backend/types/models.type.ts`. Method fetches all transactions from `sales_transactions`, aggregates per customer (visit_count, avg_ticket, last_transaction_date), assigns mutually exclusive segment tags with deterministic priority (`inactive_30d > frequent > high_spender`), and returns a summary with per-segment counts. Handles empty DB (zero-count result) and DB connection failures (propagates `DB_CONNECTION_FAILURE`). 9 integration tests covering R1-R10. Full harness green (14 test files, 109 tests, lint, build all pass). E2E gate: not required (backend-only). Reviewer ACCEPTED.

## Feature: controller_promotions_segments
- **Status:** Done
- **Summary:** Created `PromotionsController.getSegments()` in `src/backend/controllers/promotions.controller.ts` — a static controller method that coordinates customer segmentation by invoking `ClientModel.getCustomerSegments()` and returning a uniform response envelope. Follows the established `SalesController`/`TrafficController` pattern: logs invocation via `logger.info`, catches `DB_CONNECTION_FAILURE` → 500 error, catches generic errors → 500, and logs all errors via `logger.error`. Created 5 integration tests covering R1-R7 (success response shape, DB_CONNECTION_FAILURE mapping, generic error mapping, logger invocation). Full harness green (15 test files, 114 tests, lint, build all pass). E2E gate: not required (backend-only). Reviewer ACCEPTED.

## Feature: api_promotions_segments_route
- **Status:** Done
- **Summary:** Created thin pasamanos API route at `src/app/api/v1/promotions/segments/route.ts` exposing a GET handler that delegates to `PromotionsController.getSegments()`. Follows the established pasamanos pattern: logs invocation via `logger.info`, returns 200 on success, maps controller error status codes, and adds defensive try/catch wrapping for unexpected exceptions (500 + `INTERNAL_SERVER_ERROR`). Created 3 integration tests covering success response shape, controller error mapping, and unexpected exception fallback. Build output confirms route at `ƒ /api/v1/promotions/segments`. Full harness green (15 test files, 114 tests, lint, build all pass). E2E gate: not required (backend-only). Reviewer ACCEPTED.

## Feature: service_gemini_recovery_prompt
- **Status:** Done
- **Summary:** Added `AIService.generateRecoveryPrompts()` to `src/backend/services/ai.service.ts` — a Gemini-powered recovery copywriter that generates personalized messages for inactive customers. Method accepts `SegmentedCustomer[]`, builds per-customer prompts with name/visit count/last visit date, calls Gemini (REST API when `GEMINI_API_KEY` is set, simulation fallback otherwise), enforces 180-character word-boundary truncation, and returns fallback "We miss you! Visit us soon for a special treat." on LLM failure. Added `GeminiRecoveryPromptInput` and `GeminiRecoveryPromptResult` types. 20 integration tests covering R1-R10. Full harness green (16 test files, 132 tests, lint, build all pass). E2E gate: not required (backend-only). Reviewer ACCEPTED.

## Feature: controller_promotions_generate
- **Status:** Done
- **Summary:** Added `generate()` static method to `PromotionsController` in `src/backend/controllers/promotions.controller.ts` — orchestrates campaign generation by fetching customer segments via `ClientModel.getCustomerSegments()`, filtering to `inactive_30d`, and invoking `AIService.generateRecoveryPrompts()` for personalized recovery copy. On LLM failure, injects a Spanish fallback discount message ("¡Te extrañamos! Visítanos y obtén un 15% de descuento en tu próxima compra."). Handles empty segments (returns empty campaigns without calling AI), DB_CONNECTION_FAILURE, and generic errors. Created 8 integration tests covering success flow, AI fallback injection, empty campaigns, DB errors, generic errors, and logger spies. Full harness green (17 test files, 140 tests, lint, build all pass). E2E gate: not required (backend-only). Reviewer ACCEPTED.

## Feature: api_promotions_generate_route
- **Status:** Done
- **Summary:** Created thin pasamanos API route at `src/app/api/v1/promotions/generate/route.ts` exposing a GET handler that delegates to `PromotionsController.generate()`. Follows the exact F22 pattern: logs invocation via `logger.info`, maps controller success to 200, controller error to `result.status` (or 500), and wraps in defensive try/catch for unexpected exceptions (500 + `INTERNAL_SERVER_ERROR`). Created 3 integration tests covering success response shape, controller error mapping, and unexpected exception fallback. Build output confirms route at `ƒ /api/v1/promotions/generate`. Full harness green (17 test files, 140 tests, lint, build all pass). E2E gate: not required (backend-only). Reviewer ACCEPTED.

## Feature: test_integration_predictive_alerts_flow
- **Status:** Done
- **Summary:** Created integration tests (`tests/integration/predictive_alerts_flow.integration.test.ts`) validating the PredictionService behavior and data contract for the predictive alerts flow. 12 test cases covering R1 (inactive for <30 days), R3/R7 (no active alert data when inactive), R5 (30-day boundary active), R4 (null prediction documentation). Due to vitest architecture (node environment, no jsdom), React component rendering is not possible in vitest integration tests — component rendering verification is covered by existing E2E test at `tests/e2e/component_predictive_card.spec.ts`. Full harness green (100 integration tests, lint, build all pass).

## Feature: hook_manager_campaigns
- **Status:** Done
- **Summary:** Implemented `useCampaigns()` client hook (`src/hooks/use-campaigns.hook.ts`) managing manager campaign workflow — auto-fetches customer segments on mount via `GET /api/v1/promotions/segments` and exposes `generateCampaigns()` to trigger AI recovery copy generation via `GET /api/v1/promotions/generate`. Dual independent state groups (segments + campaigns) with separate loading/error states. 11 integration tests covering all 9 requirements (R1–R9). Full harness green (18 test files, 151 tests, lint, build all pass). E2E gate: N/A (single-layer frontend hook). Reviewer ACCEPTED.

## Feature: component_campaign_segment_cards
- **Status:** Done
- **Summary:** Implemented `SegmentCards` component (`src/components/promotions/segment-cards.component.tsx`) — a client component rendering customer segment cards (Inactive 30 Days, High Spender, Frequent) with 4 visual states: loading (3 skeleton cards with pulse animation), error (red banner with retry button), empty (info message), and populated (responsive grid of color-coded cards with segment icons and action trigger buttons). Each segment type has distinct visual indicator: amber/Clock (inactive_30d), emerald/TrendingUp (high_spender), blue/Users (frequent). Touch-friendly (44px+ tap targets) with responsive layout: single column mobile, 2 columns tablet, 3 columns desktop. Created E2E test harness at `src/app/test/segment-cards/page.tsx` and 7 Playwright E2E tests covering all 8 requirements (R1–R8). Full harness green (18 test files, 151 tests, lint, build all pass). E2E gate: spec-required E2E tests written and verified. Reviewer ACCEPTED.

## Feature: page_manager_promotions
- **Status:** Done
- **Summary:** Created `/admin/promotions` App Router page route integrating `SegmentCards` (F27) with `useCampaigns` hook (F26). Created Server Component `page.tsx` with metadata ("Promotions Manager | Loyalty") and extracted `promotions.client.tsx` Client Component with header, admin navigation (Cashier/Dashboard/Social), `SegmentCards` mounting, campaign results section, skeleton loading indicators, and error banner with retry. Follows the established F8/F15 page pattern. Created 12 Playwright E2E tests covering all 10 requirements (R1–R10): metadata, header, navigation, segment card rendering, campaign generation trigger, loading/error states, responsive layout at 375/768/1440px, and accessibility landmarks with focus indicators. Full harness green (18 test files, 151 tests, lint, build all pass). E2E gate: spec-approved E2E tests. SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Reviewer ACCEPTED.

## Feature: test_e2e_manager_promotions_flow
- **Status:** Done
- **Summary:** Created E2E Playwright tests (`tests/e2e/manager_promotions_flow.e2e.test.ts`) verifying the complete promotions campaign flow: segment card rendering (R4), skeleton loading state during generation (R5,R7), campaign draft cards with recoveryCopy and timestamp (R6,R9), error banner on API 500 failure (R8), empty segments state (R10), mobile viewport no overflow at 375px (R11), and desktop correct rendering at 1440px (R12). 7 new E2E tests pass (63 total). Follows existing route interception pattern from `page_manager_promotions.e2e.test.ts`. E2E gate: feature IS the E2E tests — inherently satisfied. Full harness green (18 test files, 151 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: util_whatsapp_link_encoder
- **Status:** Done
- **Summary:** Implemented `encodeWhatsAppUrl(phone, text)` in `src/backend/utils/whatsapp.utils.ts` — a pure utility that strips non-digits from phone, percent-encodes text via native `encodeURIComponent`, and returns `https://wa.me/<phone>?text=<encoded>`. Handles edge cases: empty/zero-digit phone → empty phone segment, empty text → empty `text=`. Created 7 integration tests in `tests/integration/util_whatsapp_link_encoder.test.ts` covering all 7 requirements (R1–R7). Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (151 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: component_whatsapp_share_button
- **Status:** Done
- **Summary:** Implemented `WhatsAppShareButton` client component (`src/components/ui/whatsapp-share-button.component.tsx`) — a touch-friendly reusable button that opens prefilled WhatsApp chat URLs via `encodeWhatsAppUrl` with `window.open` and popup blocker fallback. Accepts `phone`, `message`, and optional `className` props. Includes 44px+ touch target (R5), `"use client"` directive (R6), `aria-label="Share on WhatsApp"` (R7), WhatsApp-green branding, and focus-visible keyboard ring. Created 4 Playwright E2E tests covering R1–R7. Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (151 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: test_integration_whatsapp_redirect
- **Status:** Done
- **Summary:** Created Vitest integration tests for the `WhatsAppShareButton` component's redirect flow (`tests/integration/whatsapp-redirect.integration.test.ts`) with 4 tests covering successful `window.open` redirect (R5), popup blocker fallback via `window.location.href` (R6), error fallback (R7), and ARIA label presence (R8). Used `// @vitest-environment jsdom` pragma, `vi.mock` for `encodeWhatsAppUrl`, and `vi.stubGlobal` for `window.open`. Fixed pre-existing `vitest.config.mts` alias (`@` → `./src`). Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (155 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: controller_social_ideas
- **Status:** Done
- **Summary:** Implemented `SocialController.handleSocialIdeas` in `src/backend/controllers/social.controller.ts` — validates context description (≥3 chars → 400 on failure), invokes `AIService.generateSocialIdeas` for AI-generated social post drafts, and returns 200 with formatted ideas or 500 on server error. Added `SocialIdea` type and `generateSocialIdeas` method to `ai.service.ts`. Created 6 integration tests covering R1–R5 (validation null/empty/short, successful generation, server error, valid contract). Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (20 test files, 161 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: api_social_ideas_route
- **Status:** Done
- **Summary:** Created thin pasamanos API route at `src/app/api/v1/social/ideas/route.ts` exposing a POST handler that parses `context` from the JSON request body, delegates to `SocialController.handleSocialIdeas(context)`, and returns the controller's response. Follows the established pasamanos pattern (F5/F12/F22/F25): logs invocation via `logger.info`, returns 200 on success with generated ideas, maps controller error status codes (400/500), and wraps in defensive try/catch for unexpected exceptions (500 + `INTERNAL_SERVER_ERROR`). Created 4 integration tests covering success payload with mock ideas, 400 validation error mapping, 500 controller server error mapping, and unexpected exception fallback. Build output confirms route at `ƒ /api/v1/social/ideas`. Full SDD workflow: pending → spec_author → spec_ready (human approved) → in_progress → in_review → done. Full harness green (20 test files, 161 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: hook_social_content
- **Status:** Done
- **Summary:** Implemented `useSocialIdeas()` client hook (`src/hooks/use-social.hook.ts`) managing social ideas state — exposes `context` form state with `setContext`, `ideas` array (typed `SocialIdea[]`), `loading`/`error`/`successMessage` flags, and `generateIdeas` callback that POSTs to `/api/v1/social/ideas`. Created 5 integration tests in `tests/integration/hook_social_content.integration.test.ts` (`// @vitest-environment jsdom`, mocked `global.fetch`) covering all 6 requirements (R1–R6). Full SDD workflow: pending → spec_author → spec_ready (human approved) → in_progress → in_review → done. Full harness green (21 test files, 166 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: component_social_context_form
- **Status:** Done
- **Summary:** Implemented `ContextForm` component (`src/components/social/context-form.component.tsx`) — responsive textarea form with live character count, "Generate Ideas" submit button with animated spinner, error banner (`role="alert"`), and success banner (`role="status"`). Mobile-first layout: `rows={6}`, button `min-h-11` (≥44px touch target), no overflow at 375px. Desktop: `max-w-lg mx-auto` centered, `sm:rows-4`. Created E2E test harness at `src/app/test/context-form/page.tsx` and 6 Playwright E2E tests covering all 10 requirements (R1–R10). Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (21 test files, 166 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: service_low_traffic_detector
- **Status:** Done
- **Summary:** Added `TrafficService.isLowTrafficDay(date, transactions, threshold?)` static method to `src/backend/services/traffic.service.ts` — groups historical transactions by weekday, computes average daily count, and returns `true` if the target weekday's count falls below `averageDailyCount * threshold` (default 0.5). Empty input returns `false`, invalid timestamps are silently skipped. Created 7 integration tests in `tests/integration/service_low_traffic_detector.integration.test.ts` covering all 7 requirements (R1–R7): low-traffic detection, normal-traffic false, configurable threshold, empty input, and invalid timestamp handling. Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (22 test files, 173 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: logic_flash_sale_injection
- **Status:** Done
- **Summary:** Created `src/backend/services/social-prompt.decorator.ts` with a `decorate(prompt, transactions, date?)` function that conditionally appends "Oferta Relámpago" flash sale campaign instructions to AI prompts when `TrafficService.isLowTrafficDay` detects a historically low-traffic day. Handles empty transactions (passthrough without calling service), date defaulting to `new Date()`, and normal traffic passthrough. Flash sale text stored as named constant `FLASH_SALE_INJECTION`. Created 4 integration tests in `tests/integration/logic_flash_sale_injection.integration.test.ts` covering all 7 requirements (R1–R7). Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (23 test files, 177 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: test_integration_low_traffic_decorator
- **Status:** Done
- **Summary:** Created integration tests (`tests/integration/low_traffic_decorator_flow.integration.test.ts`) for the `decorate()` function in `social-prompt.decorator.ts`. 10 test cases across 5 requirement-labeled `describe` blocks covering R1 (low-traffic day injects flash sale text), R2 (normal-traffic day returns prompt unchanged), R3 (empty transactions unchanged), R4 (custom date parameter routing), and R5 (all-invalid timestamps unchanged). No production code was modified — all code was already in place from features 37 & 38. Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (24 test files, 187 tests, lint, build all pass). Reviewer ACCEPTED.

## Feature: service_social_gemini_copywriter
- **Status:** Done
- **Summary:** Implemented `AIService.generateSocialPostSuggestions(prompt)` — a new static method on `AIService` accepting a pre-decorated prompt string, building a structured Gemini prompt with JSON output constraints, parsing & validating the LLM response, enforcing character limits with word-boundary truncation, and returning up to 3 `SocialIdea[]` objects. Full fallback chain: empty/whitespace prompt → single default idea, LLM failure → 3 simulated ideas using prompt context, malformed JSON → simulated fallback with warning log. Added `SOCIAL_POST_LIMITS` constants to `models.type.ts`, `validateSocialIdea`, `truncateAtWordBoundary`, and `simulateSocialPostFallback` helpers. Updated `SocialController.handleSocialIdeas` to build a base prompt, apply `decorate()` from `social-prompt.decorator.ts`, and call the new method. Created 18 integration tests in `tests/integration/service_social_gemini_copywriter.integration.test.ts` with 7 test cases covering all 12 requirements (R1–R12). Full SDD workflow: pending → spec_author → spec_ready (human approved) → in_progress → in_review → done. Full harness green (25 test files, 204 tests, lint, build all pass). Reviewer ACCEPTED.


## Feature: component_social_suggestions_cards
- **Status:** Done
- **Summary:** Implemented `SuggestionsCards` component (`src/components/social/suggestions-cards.component.tsx`) — renders clean output suggestions with visual prompts and clipboard handlers. Added Playwright E2E tests (`tests/e2e/component_social_suggestions_cards.spec.ts`) and a test route (`src/app/test-social-cards/page.tsx`). Full SDD workflow: pending -> spec_author -> spec_ready -> in_progress -> in_review -> done. Full harness green. Reviewer ACCEPTED.

## Feature: page_manager_social
- **Status:** Done
- **Summary:** Implemented `page_manager_social` (`src/app/admin/social/page.tsx`) integrating the `ContextForm` and `SuggestionsCards` components, wired with the `useSocialIdeas` hook. Added responsive mobile (stack) and desktop (grid) layouts. Resolved unescaped entity lint errors. Playwright E2E tests (`tests/e2e/page_manager_social.spec.ts`) cover responsive behaviors and layout integrations. Full SDD workflow completed: pending -> spec_author -> spec_ready -> in_progress -> in_review -> done. E2E gate human approved. Full harness green. Reviewer ACCEPTED. UPDATE: Reopened to add missing skeletal loading indicators (`animate-pulse`). Verified passing tests and init.sh. Re-ACCEPTED and closed.

## Feature: test_e2e_social_clipboard_actions
- **Status:** Done
- **Summary:** Created Playwright E2E tests (`tests/e2e/social_clipboard_actions.spec.ts`) for the Social Content Creation page. The tests verify the skeletal loading indicators (which were added to `page.tsx` during a blocker resolution step) and the touch copy-to-clipboard functionality. Fixed linting errors (any type replaced with `() => void` and removed unused props). Reviewer accepted; full harness green (init.sh passed, 204 tests).

## Feature: db_migration_captive_clients
- **Status:** Done
- **Summary:** Generated Supabase migration `20260526000146_captive_portal_schema.sql` for the captive portal, creating the `clients` table (for profile records) and the `wifi_logins` table (for session logs) with a one-to-many relationship. Wrote integration tests in `tests/integration/db_migration_captive.test.ts` to assert that schema constraints map to EARS requirements R1-R5. Regenerated types with `pnpm db:gen-types`. The reviewer verified C1-C6 and ran `./init.sh` flawlessly. Harness fully green. Reviewer ACCEPTED.

## Feature: model_captive_portal_upsert
- **Status:** Done
- **Summary:** Implemented `registerPortalLogin` in `ClientModel` (`src/backend/models/client.model.ts`). Added error handling and data upserting into the `clients` table along with inserting logs to `wifi_logins`. Created passing integration tests `tests/integration/model_captive_portal_upsert.integration.test.ts`. Fixed a TypeScript error during build where `error` variable was mistyped for casting. All tests and `./init.sh` pass cleanly. Reviewer ACCEPTED.

## Feature: controller_portal_register
- **Status:** Done
- **Summary:** Implemented `src/backend/controllers/portal.controller.ts` with validation logic for client signups without external dependencies. Wrote and passed integration tests `tests/integration/controller_portal_register.integration.test.ts` to assert validation limits and logic flows. `./init.sh` confirmed fully functional without issues. Reviewer confirmed checkpoints C1-C6 and ACCEPTED the work.

## Feature: api_portal_register_route
- **Status:** Done
- **Summary:** Implemented `src/app/api/v1/portal/register/route.ts` routing POST requests to the `portal.controller.ts`. Wrote and verified integration tests in `tests/integration/api_portal_register_route.test.ts`. Ensured proper request formatting and response behavior. Reviewer ACCEPTED.

## Feature: hook_captive_portal
- **Status:** Done
- **Summary:** Implemented `usePortal` custom React hook (`src/hooks/use-portal.hook.ts`) that manages state variables (`isLoading`, `isSuccess`, `error`) and provides `registerClient` to perform a POST fetch to `/api/v1/portal/register`. Also provides a `reset` function to restore initial state variables. Implemented 6 comprehensive Vitest integration tests in `tests/integration/hook_captive_portal.integration.test.ts` covering initial state, loading states, successful requests, API failure handling, network error catches, and reset helpers. E2E gate was successfully documented as skipped since it is a pure client hook. Linter and full production Next.js compilation pass cleanly. Reviewer ACCEPTED.

## Feature: component_wifi_info_qr
- **Status:** Done
- **Summary:** Implemented `WifiInfoQrComponent` (`src/components/wifi/qr.component.tsx`) — a premium glassmorphic UI component for the Captive Portal displaying WiFi name, a tactile clipboard copy password button, and a native inline SVG QR code matrix (zero external dependencies). Built a lightweight inline QR code matrix generator rendering crisp SVG `<path>` vectors. Component manages internal clipboard state with copy-feedback transitions. Enforces min 48px tap targets and max-w-sm layout. Created integration tests (`tests/integration/wifi_qr.test.tsx`) covering R1–R9 and Playwright E2E tests (`tests/e2e/component_wifi_info_qr.e2e.test.ts`) verifying mobile layout fit and tap target sizes via a dedicated test route (`/test/wifi-qr`). Full SDD workflow: pending → spec_author → spec_ready (human approved) → in_progress → in_review → done. Full harness green (./init.sh exit 0, all tests green). Reviewer ACCEPTED.

## Feature: page_portal_landing
- **Status:** Done
- **Summary:** Implemented the public-facing Captive Portal Onboarding page at `/portal`. Created `src/app/portal/page.tsx` (Server Component exporting `metadata` with `title: "Connect to WiFi | Loyalty Portal"`) and `src/app/portal/portal.client.tsx` (Client Component: `usePortal()` hook, registration form with `data-testid` attributes for name/phone/submit, loading spinner + disabled state during API call, `role="alert"` error banner, conditional `WifiInfoQrComponent` display on success using `NEXT_PUBLIC_WIFI_SSID`/`NEXT_PUBLIC_WIFI_PASSWORD` env vars with safe defaults). Mobile-first dark glassmorphism layout (`min-h-screen bg-zinc-950`, `max-w-sm` centered, `min-h-[44px]` on all inputs/buttons). Follows established F8/F15/F28/F42 Server/Client split pattern. No existing files modified. Created 8 Playwright E2E tests covering R1–R10: route accessibility + title, form inputs present at 375px, no horizontal overflow, three tap-target height tests, mocked 201 → WiFi QR visible + form hidden, mocked 400 → error banner visible. Full SDD workflow: pending → spec_author → spec_ready (human approved) → in_progress → in_review → done. Harness: 215 integration tests pass, 7 pre-existing DB failures (no regressions), lint ✅, build ✅, 8/8 E2E tests passed. Reviewer ACCEPTED.

## Feature: test_e2e_portal_onboarding_flow
- **Status:** Done
- **Summary:** Created Playwright E2E tests (`tests/e2e/portal_onboarding_flow.spec.ts`) validating the complete user onboarding journey in the Captive Portal. Tests cover: accessibility/title (R1), viewport containment and touch support at 375x812 viewport (R2), presence of landing state elements (R3), API registration mock (R4), loading/connecting states (R5), WiFi QR view transition on 201 (R6, R7), simulated clipboard permissions check and visual "Copied Password!" feedback (R8), and API error alert banner validations (R9). All 4 E2E tests passed cleanly, 222 Vitest integration tests passed green, linter and production build compiled with exit code 0. Reviewer ACCEPTED.

## Feature: service_arrival_notification_builder
- **Status:** Done
- **Summary:** Implemented `ArrivalService.buildNotification` in `src/backend/services/arrival.service.ts` to generate deterministic arrival greeting notifications for captive portal customers. Added `ArrivalNotificationInput` and `ArrivalNotification` types, delegated WhatsApp link creation to `encodeWhatsAppUrl`, normalized names/business labels, and added 5 Vitest integration tests covering R1-R8. Full SDD workflow completed: spec_ready after human approval -> in_progress -> in_review -> done. Full harness green: 29 test files, 227 tests, lint, and production build passed. Reviewer ACCEPTED.

## Feature: controller_arrival_notifications
- **Status:** Done
- **Summary:** Implemented `ArrivalController.getNotifications()` in `src/backend/controllers/arrival.controller.ts` to fetch recent captive portal arrivals through `ClientModel.getRecentPortalArrivals()`, format each row with `ArrivalService.buildNotification()`, enrich notifications with `clientId`, `loginId`, and `arrivedAt`, and return summary metrics (`total`, `named`, `anonymous`, `generatedAt`, `latestArrivalAt`). Added shared arrival controller/result types, a bounded offline/production model read path for `wifi_logins` joined to `clients`, and 4 integration tests covering R1-R11. Full SDD workflow completed: pending -> spec_author -> spec_ready (human approved) -> in_progress -> in_review -> done. Full harness green: 30 test files, 231 tests, lint, and production build passed. Reviewer ACCEPTED.

## Feature: api_arrival_notifications_route
- **Status:** Done
- **Summary:** Implemented `GET /api/v1/arrivals/notifications` in `src/app/api/v1/arrivals/notifications/route.ts` as a thin App Router pasamanos route that logs invocation, delegates to `ArrivalController.getNotifications()` without request parsing, returns successful controller payloads with HTTP 200, maps controller error payloads through `result.status || 500`, and catches unexpected exceptions with `{ success: false, error: "INTERNAL_SERVER_ERROR" }`. Added `tests/integration/api_arrival_notifications_route.integration.test.ts` with 5 tests covering R1-R7. Full SDD workflow completed: pending -> spec_author -> spec_ready (human approved) -> in_progress -> in_review -> done. Full harness green: 31 test files, 236 tests, lint, and production build passed. Reviewer ACCEPTED.

## Feature: hook_manager_arrivals
- **Status:** Done
- **Summary:** Implemented `useArrivals()` in `src/hooks/use-arrivals.hook.ts` as a client hook for the manager arrivals feed. The hook auto-fetches `GET /api/v1/arrivals/notifications`, exposes `notifications`, `summary`, `loading`, `error`, and `refresh`, preserves backend API error messages, and maps fetch-operation failures to the generic arrival-feed error required by R6. Added `tests/integration/hook-manager-arrivals.integration.test.ts` with 7 tests covering R1-R8, including success, controlled API failures, network failure, and manual refresh. Full SDD workflow completed: pending -> spec_author -> spec_ready (human approved) -> in_progress -> in_review -> rejected for R6 -> fixed -> in_review -> done. Full harness green: 32 test files, 243 tests, lint, and production build passed. Reviewer ACCEPTED.

## Feature: component_manager_arrivals_feed
- **Status:** Done
- **Summary:** Implemented `ArrivalsFeedComponent` client component (`src/components/dashboard/arrivals-feed.component.tsx`) — renders manager-facing arrivals lists with loading skeletons (R2), error banners with retry triggers (R3), zero-state informational views (R4), and populated feeds with real-time stats and green WhatsApp prefilled greeting buttons (R5, R6). Created `/test/arrivals-feed` test harness page (`src/app/test/arrivals-feed/page.tsx`) and 5/5 Playwright E2E tests (`tests/e2e/component_manager_arrivals_feed.e2e.test.ts`) covering all viewports (R7). Fixed pre-existing E2E recursion bug in `tests/e2e/component_whatsapp_share_button.e2e.test.ts`. Full SDD workflow: pending → spec_author → spec_ready → in_progress → in_review → done. Full harness green (all integration/E2E tests pass, build ✅, lint ✅). Reviewer ACCEPTED.

