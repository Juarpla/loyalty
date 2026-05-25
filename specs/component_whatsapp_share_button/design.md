# Design

## Affected Files

- `src/components/ui/whatsapp-share-button.component.tsx` — **Create**. New Client Component rendering a WhatsApp share button.
- `tests/e2e/component_whatsapp_share_button.spec.ts` — **Create**. Playwright E2E tests verifying click behavior.

### Upstream dependency

Feature #30 (`util_whatsapp_link_encoder`) is already `done`. The utility `encodeWhatsAppUrl` at `src/backend/utils/whatsapp.utils.ts` is available for import.

## Public Interface

```tsx
// src/components/ui/whatsapp-share-button.component.tsx

"use client";

interface WhatsAppShareButtonProps {
  phone: string;
  message: string;
  className?: string;
}

export function WhatsAppShareButton({
  phone,
  message,
  className,
}: WhatsAppShareButtonProps)
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `phone` | `string` | Yes | Target phone number (digits only, non-digits stripped by utility) |
| `message` | `string` | Yes | Prefilled message text (percent-encoded by utility) |
| `className` | `string` | No | Additional Tailwind CSS classes for custom styling |

## Data Flow

```
User clicks button
  → encodeWhatsAppUrl(phone, message)  // builds https://wa.me/...?text=...
  → window.open(url, '_blank')
    → IF blocked/throws → window.location.href = url
```

The component imports `encodeWhatsAppUrl` directly from the backend utility layer. This is acceptable because the utility is stateless, has zero backend dependencies (no DB, no API clients), and is a pure string formatter. This avoids adding an extra controller or API endpoint for a simple URL construction.

## Error Handling

- **Popup blocker detection**: `window.open` returns `null` when blocked. The component catches this and falls back to `window.location.href = url`, which navigates the current page to the WhatsApp URL.
- **Empty phone/message**: The underlying `encodeWhatsAppUrl` already handles empty phone (returns `https://wa.me/?text=...`) and empty text (returns `https://wa.me/<phone>?text=`). No additional validation is needed.
- **Try/catch on click**: The click handler wraps the `window.open` call in a try/catch to handle any unexpected exceptions gracefully.

## Styling

- The button uses Tailwind utility classes.
- Minimum 44px × 44px touch target (via `min-h-11 min-w-11` or equivalent padding).
- Default styling: prominent, branded WhatsApp-green with hover/focus states.
- `className` prop allows consumers to override or extend the default styling.

## Accessibility

- `aria-label="Share on WhatsApp"` on the button.
- Focus-visible ring for keyboard navigation.
- Role `button` is implicit when using a `<button>` element.

## Rejected Alternative

| Alternative | Rationale for rejection |
|-------------|------------------------|
| Accept `url` as a prop instead of `phone` + `message` | Would require every consumer to import and call `encodeWhatsAppUrl` themselves, duplicating the encoding logic. The component is a self-contained share button — it owns the URL construction. |
| Use `<a href="wa.me/...">` instead of `window.open` | An `<a>` tag navigates the current page, losing app state. `window.open` preserves the SPA experience and allows the fallback to `location.href` only when the popup is blocked. |
| Delegate click logic to a custom hook (`use-whatsapp-share.hook.ts`) | The component is under 150 lines and has trivial logic (one click handler with a try/catch). Extracting a hook adds indirection with no benefit. The single-responsibility rule only mandates extraction when the component exceeds 150 lines or has complex mutable state. |

## Next.js Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — Confirms that the `"use client"` directive is required for React components that use browser-only APIs (`window.open`, `window.location`) and event handlers (`onClick`).
