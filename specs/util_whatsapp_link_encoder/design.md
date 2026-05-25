# Design

## Affected Files

- `src/backend/utils/whatsapp.utils.ts` — **Create**. New pure utility file exporting `encodeWhatsAppUrl`.
- `tests/integration/util_whatsapp_link_encoder.test.ts` — **Create**. Integration tests for the utility.

### Downstream consumer (not scope of this feature)

`src/backend/services/whatsapp.service.ts` already contains a `generateClickToChatLink` method with inline encoding logic. After this utility is available, that service SHOULD delegate encoding to `encodeWhatsAppUrl` instead of duplicating the logic. This is a separate refactoring task and is not in scope for this feature.

## Public Interface

```typescript
// src/backend/utils/whatsapp.utils.ts

/**
 * Encodes a phone number and text message into a WhatsApp prefilled URL.
 * Strips non-digits from phone, percent-encodes text per RFC 3986.
 */
export function encodeWhatsAppUrl(phone: string, text: string): string
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| `phone` | `string` | Phone number (non-digits are stripped) |
| `text` | `string` | Message text to be URL-encoded |

### Return value

A fully-formed `https://wa.me/...` URL string.

## Data Flow

A controller or service calls `encodeWhatsAppUrl(phone, message)` to produce a prefilled chat link. The result is returned to the caller — either embedded in an API response or used internally (e.g. by `whatsapp.service.ts` for notification dispatch).

```
Service/Controller → encodeWhatsAppUrl(phone, text) → "https://wa.me/521555...?text=Hola%20mundo"
```

## Error Handling

- **Invalid phone (no digits)**: Return URL with empty phone segment (`https://wa.me/?text=...`). No exception thrown.
- **Empty text**: Return URL with an empty `text=` query parameter. No exception thrown.
- **Special characters in text**: Percent-encoded via native `encodeURIComponent`. The utility does not throw for any input — it is a pure string formatter.

## Decisions & Alternatives

| Decision | Chosen approach | Alternative considered | Rationale |
|----------|----------------|------------------------|-----------|
| Form factor | Pure utility function in `src/backend/utils/` | Class method inside `whatsapp.service.ts` | Utils are stateless, framework-agnostic, and trivially testable. Service already exists and would become a consumer of the utility — extraction follows the architecture diagram which shows `Services → Utils` dependency. |
| Encoding mechanism | `encodeURIComponent` (native) | Custom regex-based percent-encoding | Native `encodeURIComponent` is standard, battle-tested, and produces `%20` for spaces per R3. A custom encoder would duplicate browser/Node built-in behaviour with no benefit. |
| Phone sanitization | Strip `[^0-9]` via regex | Leave phone as-is and let WhatsApp API validate | Stripping aligns with the existing `whatsapp.service.ts` behaviour and matches how WhatsApp expects numbers (digits only, country code without `+`). |

## Next.js Docs Consulted

None. This is a pure TypeScript utility with zero framework dependency.
