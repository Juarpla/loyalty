# Requirements — WhatsApp Redirect Flow Integration Tests

**Feature:** 32 - test_integration_whatsapp_redirect
**Upstream:** 30 (util_whatsapp_link_encoder), 31 (component_whatsapp_share_button)
**Story:** F2 - Story 2.3: Button with prefilled wa.me link to WhatsApp

---

## R1 — Test file location

The integration test file SHALL exist at `tests/integration/whatsapp-redirect.integration.test.ts`.

## R2 — Vitest jsdom environment

WHEN the test suite is loaded, the file SHALL declare `// @vitest-environment jsdom` and SHALL import Vitest APIs (`describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`) from the `vitest` package.

## R3 — Mock setup and teardown

BEFORE each test case, the test SHALL restore all mocks (`vi.restoreAllMocks()`). AFTER each test case, the test SHALL unstub all globals (`vi.unstubAllGlobals()`).

## R4 — EncodeWhatsAppUrl mock

WHEN the test runs, the `encodeWhatsAppUrl` module import SHALL be mocked via `vi.mock(...)`. The mock SHALL return a deterministic URL `"https://wa.me/525551234567?text=Hello%20world"` by default.

## R5 — Successful redirect via window.open

WHEN the `WhatsAppShareButton` is rendered with valid `phone` and `message` props and a click is simulated, the test SHALL verify that `encodeWhatsAppUrl` was called with the exact phone and message strings. The test SHALL then verify that `window.open` was called with the expected `https://wa.me/...` URL and `"_blank"` as the second argument.

## R6 — Popup blocker fallback via window.location.href

IF `window.open` returns `null` (popup blocked), THEN the test SHALL verify that `window.location.href` is assigned the WhatsApp URL.

## R7 — Error fallback via window.location.href

IF `window.open` throws an error, THEN the test SHALL verify that `window.location.href` is assigned the WhatsApp URL.

## R8 — ARIA label attribute

WHEN the component is rendered, the button SHALL have an `aria-label` attribute set to `"Share on WhatsApp"`.
