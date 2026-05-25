# Tasks — WhatsApp Redirect Flow Integration Tests

**Feature:** 32 - test_integration_whatsapp_redirect

---

- [x] **T1 — Create test file with jsdom environment and mock setup.** Covers: R1, R2, R3, R4.
  - Create `tests/integration/whatsapp-redirect.integration.test.ts`
  - Add `// @vitest-environment jsdom` pragma
  - Import `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach` from `vitest`
  - Import `render`, `screen`, `fireEvent` from `@testing-library/react`
  - Mock `@/backend/utils/whatsapp.utils` via `vi.mock(...)` — default mock returns `"https://wa.me/525551234567?text=Hello%20world"`
  - In `beforeEach`: call `vi.restoreAllMocks()`, stub `window.open` with a `vi.fn()`, set up writable `window.location` mock
  - In `afterEach`: call `vi.unstubAllGlobals()`, restore original `window.location`

- [x] **T2 — Write test for successful redirect (R5).** Covers: R5.
  - Mock `window.open` to return a dummy object `{}`
  - Render `<WhatsAppShareButton phone="+52 (555) 123-4567" message="Hello world" />`
  - `fireEvent.click(screen.getByRole("button"))`
  - Assert `encodeWhatsAppUrl` was called with `"+52 (555) 123-4567"` and `"Hello world"`
  - Assert `window.open` was called with `"https://wa.me/525551234567?text=Hello%20world"` and `"_blank"`

- [x] **T3 — Write test for popup blocker fallback (R6).** Covers: R6.
  - Mock `window.open` to return `null`
  - Render and click the button
  - Assert `window.location.href` is set to the WhatsApp URL

- [x] **T4 — Write test for error fallback (R7).** Covers: R7.
  - Mock `window.open` to throw `new Error("Pop-up blocked")`
  - Render and click the button
  - Assert `window.location.href` is set to the WhatsApp URL

- [x] **T5 — Write test for ARIA label (R8).** Covers: R8.
  - Render the component with default props
  - Assert `screen.getByRole("button")` has attribute `aria-label="Share on WhatsApp"`
