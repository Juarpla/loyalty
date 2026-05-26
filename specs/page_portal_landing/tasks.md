# Tasks — page_portal_landing (Feature ID: 50)

- [x] T1 - Create `src/app/portal/page.tsx` as a Server Component exporting `metadata` with
  `title: "Connect to WiFi | Loyalty Portal"` and `description`, and rendering `<PortalClient />`.
  Covers: R1, R2.

- [x] T2 - Create `src/app/portal/portal.client.tsx` as a Client Component with `"use client"`.
  Call `usePortal()` from `@/hooks/use-portal.hook` and expose `isLoading`, `isSuccess`,
  `error`, `registerClient`, and `reset` in the render logic. Covers: R2, R3.

- [x] T3 - Implement the registration form inside `portal.client.tsx`. The form MUST include:
  a text input for `name` (`data-testid="portal-name-input"`, `required`), a text input for
  `phone` (`data-testid="portal-phone-input"`, `required`), and a submit button
  (`data-testid="portal-submit-button"`) that invokes `registerClient({ name, phone })` on
  submit. Covers: R4.

- [x] T4 - Wire the submit button to show a loading indicator and become disabled while
  `isLoading` is `true`. Covers: R5.

- [x] T5 - Conditionally render `WifiInfoQrComponent` (from `src/components/wifi/qr.component.tsx`)
  with `ssid={process.env.NEXT_PUBLIC_WIFI_SSID ?? "BusinessWiFi"}` and
  `password={process.env.NEXT_PUBLIC_WIFI_PASSWORD ?? "welcome123"}` when `isSuccess` is `true`,
  and hide the registration form. Covers: R6.

- [x] T6 - Render an error banner with `role="alert"` containing the `error` string whenever
  `error` is non-null, inside the form view. Covers: R7.

- [x] T7 - Apply mobile-first layout: `min-h-screen bg-zinc-950`, single column, `max-w-sm
  mx-auto`, centered. Match the dark/glassmorphism theme. Ensure inputs and submit button
  have `min-h-[44px]`. Covers: R8, R9.

- [x] T8 - Create `tests/e2e/page_portal_landing.e2e.test.ts` with Playwright tests that:
  - Navigate to `/portal` at 375px viewport and assert form inputs and submit button are present.
  - Assert no horizontal overflow at 375px.
  - Assert inputs and button have `min-height` ≥ 44px.
  - Mock a 201 response and assert the WiFi QR view is shown (form hidden).
  - Mock a 400 response and assert a `[role="alert"]` error banner is visible.
  Covers: R4, R6, R7, R8, R9, R10.

- [x] T9 - Verify `pnpm test:agent` passes (all Vitest integration tests green — no new ones
  required, but must not regress existing ones). Covers: all R.

- [x] T10 - Verify `./init.sh --quick` exits 0. Covers: all R.
