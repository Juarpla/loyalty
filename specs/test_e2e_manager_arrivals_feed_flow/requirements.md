# Requirements - test_e2e_manager_arrivals_feed_flow (Feature ID: 57)

Feature 57 implements full end-to-end integration tests using Playwright. It validates that the manager-facing Arrivals Feed UI (from Feature 56) is embedded within the real manager dashboard at `/admin/dashboard` and successfully displays real-time visitor registration streams from the Captive Portal onboarding flow at `/portal` (from Feature 51).

## Requirements

- **R1 (Ubiquitous):** The system MUST embed the `ArrivalsFeedComponent` in the main manager dashboard route (`/admin/dashboard` mapped to `src/app/admin/dashboard/dashboard.client.tsx`), utilizing the `useArrivals()` reactive state hook.
- **R2 (State-driven):** WHEN a customer completes registration at the Captive Portal (`/portal`), the system MUST write a visit/login entry to the database and reflect the new visitor in the arrivals feed.
- **R3 (Ubiquitous):** Playwright E2E tests in `tests/e2e/manager_arrivals_feed_flow.spec.ts` MUST verify the integrated stream update:
  1. Navigate to `/admin/dashboard` and verify the initial feed state (empty or rendering existing logins).
  2. In a separate context/page, navigate to `/portal` and successfully complete a visitor onboarding registration (providing a unique name and phone number).
  3. Return to the dashboard at `/admin/dashboard`, invoke the manual refresh button (`data-testid="refresh-button"`), and assert that the newly registered client card is appended to the top of the feed list.
- **R4 (State-driven):** The newly appended arrival card MUST display:
  - The correct customer name (or "Cliente Anónimo" if anonymous fallback is triggered) (`data-testid="arrival-name"`).
  - The correct standard phone number (`data-testid="arrival-phone"`).
  - A greeting preview (`data-testid="arrival-greeting"`).
  - A green WhatsApp action link (`data-testid="whatsapp-link"`) with a valid prefilled wa.me `href` mapping target details.
- **R5 (Ubiquitous):** Playwright E2E tests MUST mock or assert that clicking the WhatsApp CTA link on the newly appended card points to the correct destination URL format: `https://wa.me/<phone>?text=<encoded_greeting>`.

## Verification Mapping

- **R1:** Verify `/admin/dashboard` correctly imports and renders `ArrivalsFeedComponent` with properties supplied by `useArrivals()`.
- **R2:** Assert that client portal signups successfully log entries to the `wifi_logins` table and can be queried via `GET /api/v1/arrivals/notifications`.
- **R3:** Run `pnpm test:e2e` to execute `tests/e2e/manager_arrivals_feed_flow.spec.ts` and verify that registering a client at `/portal` makes that client's card appear on `/admin/dashboard` after a refresh.
- **R4:** Assert that the appended card renders the exact client name, phone number, greeting preview, and WhatsApp redirect CTA button.
- **R5:** Assert that the `href` attribute on the WhatsApp CTA button contains the exact pre-filled WhatsApp greeting link corresponding to the visitor.
