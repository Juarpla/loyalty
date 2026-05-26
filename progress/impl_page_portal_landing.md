# Implementation Report — page_portal_landing (Feature ID: 50)

## Summary

Implemented the public-facing Captive Portal Onboarding page at `/portal`. The page:

1. Uses the established Server/Client split pattern (like F8, F15, F28, F42): a Server Component (`page.tsx`) exports `metadata` and mounts the Client Component (`portal.client.tsx`).
2. The Client Component calls `usePortal()` from `@/hooks/use-portal.hook`, shows a registration form when `isSuccess === false`, conditionally renders `WifiInfoQrComponent` on success, shows an `role="alert"` error banner when `error` is non-null, and disables the submit button with a loading spinner when `isLoading === true`.
3. Layout is mobile-first dark theme (`min-h-screen bg-zinc-950`, `max-w-sm` centered) matching the `WifiInfoQrComponent` glassmorphism design system. All inputs and the submit button have `min-h-[44px]`.
4. E2E tests via Playwright (`tests/e2e/page_portal_landing.e2e.test.ts`) cover 375px viewport rendering, no horizontal overflow, touch target heights, mocked 201 → WiFi QR shown, and mocked 400 → error banner visible.

No existing files were modified; only three new files were created.

---

## Changed Files

| File | Status | Purpose |
|---|---|---|
| `src/app/portal/page.tsx` | ✅ Created | Server Component — exports metadata, renders `<PortalClient />` |
| `src/app/portal/portal.client.tsx` | ✅ Created | Client Component — form + conditional WiFi QR + error banner |
| `tests/e2e/page_portal_landing.e2e.test.ts` | ✅ Created | Playwright E2E tests |

---

## Verification

### Integration tests (`pnpm test:agent`)

- **215 tests passed, 7 failed**
- All 7 failures are **pre-existing** DB connectivity failures (`DB_CONNECTION_FAILURE` — Supabase not running locally on port 54322). None are related to this feature.
- All portal-related integration tests pass (including `model_captive_portal_upsert` offline mode test).
- **No regressions introduced.**

### E2E gate

E2E approval was granted as part of spec approval for page-level features with E2E tests. Playwright tests executed and **all 8 tests passed**. Two selector fixes were applied after initial run:
1. `getByRole("button", { name: /Copy Password/i })` → `getByText("Copy Password", { exact: true })` — because `WifiInfoQrComponent` uses an aria-label that says "Copy Wi-Fi password to clipboard", not "Copy Password".
2. `page.locator('[role="alert"]')` → `:not([id="__next-route-announcer__"])` qualifier — to exclude Next.js's built-in route announcer which also has `role="alert"`.

**Result: `pnpm test:e2e tests/e2e/page_portal_landing.e2e.test.ts` → 8 passed (3.1s)**

### Lint check (`pnpm lint`)

**Result: clean, no errors.**

### Quick harness check (`./init.sh --quick`)

7 pre-existing DB failures (Supabase not running locally), 215 integration tests pass. No regressions. Lint passes. Quick mode skips build.

---

## Requirement Traceability

| Requirement | Implementation | Test |
|---|---|---|
| R1 — Route `/portal` with metadata title | `page.tsx` exports `metadata` with `title: "Connect to WiFi \| Loyalty Portal"` | E2E: `R1: Page is accessible at /portal and has correct title` |
| R2 — Server/Client split | `page.tsx` is Server Component; `portal.client.tsx` has `"use client"` directive | Code inspection + E2E page render |
| R3 — `usePortal()` called | `portal.client.tsx` imports and calls `usePortal()`, destructures all 5 values | Code inspection |
| R4 — Registration form with name/phone/submit | Form with `data-testid` attributes, `required`, calls `registerClient` on submit | E2E: `R4: Registration form inputs and submit button are present` |
| R5 — Loading state on submit button | Button `disabled={isLoading}`, shows spinner + "Connecting..." text | E2E: (implicit in 201 mock test — button disabled during fetch) |
| R6 — WiFi QR on success | `isSuccess === true` hides form, shows `<WifiInfoQrComponent ssid=... password=...>` | E2E: `R6: Mocked 201 response shows WiFi QR view and hides the registration form` |
| R7 — Error banner with `role="alert"` | `{error && <div role="alert">...{error}</div>}` rendered in form view | E2E: `R7: Mocked 400 response shows role=alert error banner` |
| R8 — Mobile-first layout, `max-w-sm` centered | `min-h-screen bg-zinc-950`, `w-full max-w-sm` on container | E2E: `R8: No horizontal overflow at 375px mobile viewport` |
| R9 — Min touch target `44px` | All inputs and button have `min-h-[44px]` class | E2E: `R9: Name/Phone input / submit button has min-height >= 44px` (3 tests) |
| R10 — Playwright E2E tests exist | `tests/e2e/page_portal_landing.e2e.test.ts` created | File existence |

---

## E2E Gate Decision

Per the implementer instructions, the E2E gate approval was granted as part of the spec approval for this page-level feature. The E2E test file covers the required scenarios using `page.route()` to intercept `POST /api/v1/portal/register` and avoid live Supabase dependency in CI, consistent with the testing strategy defined in `specs/page_portal_landing/design.md` section 9.
