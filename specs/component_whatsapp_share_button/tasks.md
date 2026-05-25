# Tasks

- [x] T1 - Create `src/components/ui/whatsapp-share-button.component.tsx` with `WhatsAppShareButton` component. Covers: R1, R2, R6.

  - Add `"use client"` directive at top. (R6)
  - Export named function `WhatsAppShareButton`. (R1)
  - Accept `phone`, `message`, and optional `className` props. (R2)
  - Render a `<button>` with `onClick` handler. (R3)
  - Import `encodeWhatsAppUrl` from `@/backend/utils/whatsapp.utils`. (R3)

- [x] T2 - Implement click handler with popup blocker fallback. Covers: R3, R4.

  - On click: construct URL via `encodeWhatsAppUrl(phone, message)`, call `window.open(url, '_blank')`.
  - If `window.open` returns `null` or throws, assign `window.location.href = url`.

- [x] T3 - Style button with touch-friendly sizing and accessible label. Covers: R5, R7.

  - Minimum 44px × 44px touch target using Tailwind classes (`min-h-11 min-w-11`).
  - Default WhatsApp-branded green styling with hover/focus transitions.
  - Add `aria-label="Share on WhatsApp"`.
  - Accept `className` prop for consumer overrides.
  - Add `focus-visible:` ring for keyboard accessibility.

- [x] T4 - Write Playwright E2E tests in `tests/e2e/component_whatsapp_share_button.e2e.test.ts`. Covers: R1, R2, R3, R4, R5, R6, R7.

  Test cases must include:
  - Mount component with `phone` and `message` props. (R1, R2)
  - Simulate click and assert `window.open` called with correct `https://wa.me/...` URL. (R3)
  - Mock `window.open` to return `null` and assert `window.location.href` fallback is set. (R4)
  - Assert minimum button dimensions are 44px × 44px. (R5)
  - Assert `aria-label` attribute is present. (R7)
