# Design - page_company_wifi_dashboard (Feature ID: 72)

## Affected Files and Path Rules
All files are strictly lowercase in compliance with repository rules:
- `src/app/admin/company/settings/page.tsx` - Server Page Route component.
- `src/app/admin/company/settings/company-settings.client.tsx` - Client component coordinator.
- `src/hooks/use-company-settings.hook.ts` - Client hook managing state, fetching, validation, and post lifecycle.
- `src/components/company/color-swatch.component.tsx` - Visual color preview component.
- `tests/e2e/page_company_wifi_dashboard.spec.ts` - Playwright E2E test file.
- `tests/integration/hook_company_settings.test.tsx` - Vitest hook/UI integration test file.

## Architectural and UI Decisions

### Decoupled MVC Layout
Following the principles in `docs/architecture.md`, the view layer remains pure and decoupled from direct database or external API logic:
1. **Server Page Wrapper** (`page.tsx`) acts as an entry point setting metadata and serving `<CompanySettingsClient />`.
2. **Client Coordinator** (`company-settings.client.tsx`) binds UI controls and forms to custom state abstractions.
3. **Custom React Hook** (`use-company-settings.hook.ts`) encapsulates fetching from the pass-through API endpoint `/api/v1/company/[companyId]/wifi`, tracking `loading`, `saving`, `error`, and `success` states, and executing validate/save processes.

### UI Form & Real-time Color Swatch
- Form styling utilizes the same dark-mode theme (`bg-zinc-950`, border colors, typography) as `admin/promotions` and `admin/dashboard` for a seamless professional aesthetic.
- Global navigation is supplemented with a Link to `/admin/company/settings` alongside existing pages.
- The `Brand Color` input will accept hex text strings (e.g. `#6366f1`).
- Beside or beneath the hex input, a `<ColorSwatch color={brandColor} />` component will preview the color swatch by applying `style={{ backgroundColor: brandColor }}`. If the text input matches the hex pattern `/^#[0-9a-fA-F]{6}$/`, it renders the background color; otherwise, it renders a neutral fallback warning color/border.

### Secure Preview Box
- In addition to standard form fields, the page will offer a "Live Portal Preview" box. This box mimics the styling of the premium `/portal/[companyId]` banner card using the customized `welcome_title`, `welcome_message`, and `brand_color` directly from the local form state so managers see exactly what their portal looks like prior to saving.

### Authentication & Hardcoded Context
- In the absence of an authentication layer in this sandbox tier, we hardcode the `companyId` as `demo-company` within both the custom hook and the client view layer. This ensures dynamic resolution at the backend controller level without breaking existing APIs.

## Next.js Guides Consulted
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` for page structure.
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` for proper `"use client"` boundaries and SSR-safe hook fetch states.

## Rejected Alternatives
1. **Alternative**: Direct DB query on the server component page using Server Actions.
   - **Tradeoff**: Violates the MVC decoupled architecture where views only query through standard endpoint routes or dedicated hooks. Direct DB operations on views create coupling and bypass input validation layers inside `CompanyController.upsertWifiSettings`.
   - **Decision**: Rejected. Use hook-based API fetch to `/api/v1/company/[companyId]/wifi`.
2. **Alternative**: Relying on HTML `<input type="color">`.
   - **Tradeoff**: Color inputs often open native platform UI pickers that clash with dark theme aesthetics and lack granular hex key entry controls suitable for rapid configuration.
   - **Decision**: Rejected. Use standard text inputs with hex validations alongside our custom visual color swatch indicator.
