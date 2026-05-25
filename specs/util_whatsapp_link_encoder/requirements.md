# Requirements

- **R1**: The system MUST expose a named export `encodeWhatsAppUrl` from `src/backend/utils/whatsapp.utils.ts` that accepts two string parameters: `phone` and `text`.

- **R2**: WHEN `encodeWhatsAppUrl(phone, text)` is invoked, the system MUST return a URL string conforming to `https://wa.me/<phone>?text=<encoded>`.

- **R3**: WHEN the `text` argument contains blank space characters, the system MUST encode them as `%20`.

- **R4**: The system MUST strip all non-digit characters (`[^0-9]`) from the `phone` argument before inserting it into the URL.

- **R5**: IF the `text` argument contains characters that are unsafe for URLs (per RFC 3986), the system MUST percent-encode them using standard `encodeURIComponent` behavior.

- **R6**: IF the `phone` argument is empty or becomes empty after digit stripping, the system MUST return a URL with an empty phone segment: `https://wa.me/?text=<encoded>`.

- **R7**: IF the `text` argument is an empty string, the system MUST return a URL with an empty `text` query parameter: `https://wa.me/<phone>?text=` (empty value).
