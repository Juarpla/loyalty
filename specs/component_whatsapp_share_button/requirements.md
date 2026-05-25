# Requirements

- **R1**: The system MUST expose a named React component export `WhatsAppShareButton` from `src/components/ui/whatsapp-share-button.component.tsx`.

- **R2**: The `WhatsAppShareButton` component MUST accept `phone: string` and `message: string` as required props, and an optional `className?: string` prop.

- **R3**: WHEN the button element is clicked, the system MUST invoke `encodeWhatsAppUrl(phone, message)` from `src/backend/utils/whatsapp.utils.ts` and call `window.open` with the resulting URL.

- **R4**: IF `window.open` returns `null` or throws an error (e.g., popup blocker), the system MUST fall back to opening the WhatsApp URL via `window.location.href` assignment.

- **R5**: The rendered button element MUST have a minimum interactive area of 44px × 44px to comply with touch-target guidelines.

- **R6**: The component file MUST include a `"use client"` directive to enable browser API access.

- **R7**: The button element MUST include an `aria-label` attribute with a descriptive text such as `"Share on WhatsApp"`.
