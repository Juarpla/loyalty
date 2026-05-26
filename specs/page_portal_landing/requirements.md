# Requirements — page_portal_landing (Feature ID: 50)

## 1. Feature Description

Creates the public-facing Captive Portal Onboarding page at `src/app/portal/page.tsx`.
The page integrates a client registration form (wired to `usePortal` hook) alongside the
`WifiInfoQrComponent` to display WiFi credentials. After a visitor submits their name and
phone number, the page registers the client via the portal API and shows the WiFi QR/copy
section on success.

---

## 2. Requirements Specification (EARS-style)

- **R1 (Ubiquitous):** The page MUST be accessible at the route `/portal` and export a default
  Next.js page component with a `metadata` export containing
  `title: "Connect to WiFi | Loyalty Portal"` and a descriptive `description`.

- **R2 (Ubiquitous):** The page MUST be split into a Server Component (`page.tsx`) that exports
  metadata, and a Client Component (`portal.client.tsx`) that owns all interactive state,
  following the established F8/F15/F28/F42 Server/Client split pattern.

- **R3 (Ubiquitous):** The Client Component MUST call `usePortal()` from
  `@/hooks/use-portal.hook` and expose the resulting `isLoading`, `isSuccess`, `error`,
  `registerClient`, and `reset` values to the rendered UI.

- **R4 (Ubiquitous):** WHILE `isSuccess` is `false`, the Client Component MUST render an
  inline registration form containing:
  - A text input for the visitor's name (required, `data-testid="portal-name-input"`).
  - A text input for the visitor's phone number (required, `data-testid="portal-phone-input"`).
  - A submit button (`data-testid="portal-submit-button"`) that calls `registerClient` with
    the form values.

- **R5 (State-driven):** WHILE `isLoading` is `true`, the submit button MUST be disabled and
  display a loading indicator (e.g., spinner or "Connecting..." text).

- **R6 (State-driven):** WHILE `isSuccess` is `true`, the Client Component MUST hide the
  registration form and render the `WifiInfoQrComponent` (`src/components/wifi/qr.component.tsx`)
  passing configured WiFi `ssid` and `password` props read from environment variables
  `NEXT_PUBLIC_WIFI_SSID` (defaulting to `"BusinessWiFi"`) and
  `NEXT_PUBLIC_WIFI_PASSWORD` (defaulting to `"welcome123"`).

- **R7 (Event-driven):** IF `error` is non-null, THEN the page MUST render an error banner
  with `role="alert"` containing the error message text, visible in the registration form view.

- **R8 (Ubiquitous):** The page MUST use a mobile-first layout (single column, `max-w-sm` centered)
  with the dark/glassmorphism theme matching the existing design system used by
  `WifiInfoQrComponent`.

- **R9 (Ubiquitous):** Every form input and the submit button MUST have a minimum touch target
  height of `44px`.

- **R10 (Ubiquitous):** Playwright E2E tests in `tests/e2e/page_portal_landing.e2e.test.ts` MUST
  verify that navigating to `/portal` at mobile viewport (375px width) renders the registration
  form, and that form inputs and the submit button are present and have min-height ≥ 44px.

---

## 3. Verification Plan

- **R1:** Check `src/app/portal/page.tsx` exports `metadata` with correct `title` string and a
  default function component.
- **R2:** Confirm `page.tsx` imports a client component; confirm the client component has
  `"use client"` directive at the top.
- **R3:** Confirm the client component imports and calls `usePortal()`.
- **R4:** E2E test asserts `[data-testid="portal-name-input"]`, `[data-testid="portal-phone-input"]`,
  and `[data-testid="portal-submit-button"]` are present when `isSuccess` is false.
- **R5:** E2E test mocks the network to delay the API response and asserts the submit button
  becomes disabled during loading.
- **R6:** E2E test mocks a successful API 201 response and asserts the form is gone and the
  `WifiInfoQrComponent` output (e.g., QR SVG or "Copy Password" button) is visible.
- **R7:** E2E test mocks a 400 API response and asserts a `[role="alert"]` element is visible
  with error text.
- **R8 + R9:** E2E test at 375px viewport asserts no horizontal overflow and input/button
  `min-height` computed style is ≥ 44px.
- **R10:** Existence and passage of `tests/e2e/page_portal_landing.e2e.test.ts`.
