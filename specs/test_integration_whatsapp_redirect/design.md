# Design — WhatsApp Redirect Flow Integration Tests

**Feature:** 32 - test_integration_whatsapp_redirect
**Implementer:** To be assigned after spec approval.

## Affected Files

| File | Action | Notes |
|------|--------|-------|
| `tests/integration/whatsapp-redirect.integration.test.ts` | **Create** | New integration test file |

No other files are created or modified. This feature touches zero product code.

## Test Environment

- **Framework:** Vitest (project default)
- **Environment pragma:** `// @vitest-environment jsdom` — overrides the root `node` environment per-file. Same approach used in `hook-cashier-sales.integration.test.ts`.
- **Vitest include pattern:** `tests/integration/**/*.integration.test.ts` (configured in `vitest.config.mts`). The file MUST use the `.integration.test.ts` suffix to be discovered.

> **Note on naming:** The acceptance criteria in `feature_list.json` references `whatsapp_redirect.test.ts`. However, the vitest config only includes `*.integration.test.ts` files. The spec recommends `whatsapp-redirect.integration.test.ts` to match both the vitest config and the kebab-case convention used by other integration tests (e.g., `hook-cashier-sales.integration.test.ts`).

## Mocking Strategy

| Mock | Mechanism | Purpose |
|------|-----------|---------|
| `encodeWhatsAppUrl` | `vi.mock("@/backend/utils/whatsapp.utils")` | Isolate the component from URL encoding; assert correct arguments passed |
| `window.open` | `vi.fn()` stubbed via `vi.stubGlobal("open", ...)` | Capture the opened URL; control return value (null vs Window vs throw) |
| `window.location` | `Object.defineProperty(window, "location", { value: ..., configurable: true })` | Capture fallback assignment when popup is blocked or error thrown |

The `window.location` mock needs special care: it must provide a writable `href` property. Use `Object.defineProperty` or a `URL`-like object `{ href: string }`.

## Test Cases

### T1 — Setup: test file template + mocks
- Create file with jsdom pragma
- Import vitest APIs and `@testing-library/react`
- Mock `encodeWhatsAppUrl` module
- beforeEach: `vi.restoreAllMocks()`, set up `window.open` and `window.location` mocks
- afterEach: `vi.unstubAllGlobals()`, restore `window.location`

### T2 — Successful redirect
1. Mock `window.open` to return a dummy `Window` object (e.g., `{}`)
2. Render `<WhatsAppShareButton phone="+52 (555) 123-4567" message="Hello world" />`
3. Simulate click via `fireEvent.click(screen.getByRole("button"))`
4. Assert `encodeWhatsAppUrl` called with `"+52 (555) 123-4567"` and `"Hello world"`
5. Assert `window.open` called with `"https://wa.me/525551234567?text=Hello%20world"` and `"_blank"`
6. Assert `window.location.href` was NOT assigned (remains original)

### T3 — Popup blocker fallback
1. Mock `window.open` to return `null`
2. Render and click the button
3. Assert `window.location.href` was assigned the WhatsApp URL

### T4 — Error fallback
1. Mock `window.open` to throw `new Error("Blocked")`
2. Render and click the button
3. Assert `window.location.href` was assigned the WhatsApp URL

### T5 — ARIA label presence
1. Render the component with default props
2. Assert the rendered button has `aria-label="Share on WhatsApp"`

## How This Differs from E2E Tests

| Dimension | Integration (this feature) | E2E (Playwright) |
|-----------|---------------------------|-------------------|
| Runtime | Vitest + jsdom (simulated browser) | Real Chromium browser |
| Mocking | `window.open`, `encodeWhatsAppUrl` are mocked | No mocking; real `wa.me` URL opens |
| What it proves | JS logic correctness: URL composition, conditional fallback, argument passing | Real click handler fires in browser, popup appears |
| Speed | Milliseconds | Seconds |
| File | `tests/integration/whatsapp-redirect.integration.test.ts` | `tests/e2e/component_whatsapp_share_button.spec.ts` (already done in feature 31) |

This feature is explicitly for unit-level integration tests, not browser E2E. The E2E test for the component was delivered in feature 31.

## Rejected Alternatives

1. **Testing via E2E only:** Rejected. Integration tests are faster, run in CI without a browser, and precisely verify argument passing and fallback logic at the JS level. E2E tests cannot easily assert that `encodeWhatsAppUrl` was called with specific arguments.
2. **Using `userEvent` from `@testing-library/user-event`:** Rejected in favor of `fireEvent` for simplicity. The component has a single `onClick` handler on a native `<button>`, so `fireEvent.click` is sufficient and avoids an additional dependency. If the component grows more complex interactivity, `userEvent` can be adopted later.
3. **Naming the file `whatsapp_redirect.test.ts`:** Rejected. The vitest config `include` pattern requires `*.integration.test.ts`. Using the suggested name would hide the file from the test runner.

## Testing Patterns Used

- **jsdom pragma:** `// @vitest-environment jsdom` at line 1
- **Global mocking:** `vi.stubGlobal("open", mockFn)` (consistent with `hook-cashier-sales.integration.test.ts`)
- **Module mocking:** `vi.mock(...)` for `@/backend/utils/whatsapp.utils`
- **DOM queries:** `screen.getByRole("button")` and `screen.getByLabelText(...)` from `@testing-library/react`
- **Click simulation:** `fireEvent.click(element)` from `@testing-library/react`
- **Location mock:** `Object.defineProperty(window, "location", ...)` with a writable `{ href: "" }` object

## Next.js Documentation Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — confirms `"use client"` directive required for `window.*` access (already present in feature 31's component).
