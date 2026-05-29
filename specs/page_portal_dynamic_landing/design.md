# Design - page_portal_dynamic_landing (Feature ID: 71)

## Affected Files

- [NEW] `src/app/portal/[companyId]/page.tsx`
- [NEW] `src/app/portal/[companyId]/portal-dynamic.client.tsx`
- [UPDATE] `src/app/portal/portal.client.tsx` only if reusable props are needed to avoid duplicating the existing portal form behavior
- [NEW] `tests/e2e/page_portal_dynamic_landing.spec.ts`
- [UPDATE] `specs/page_portal_dynamic_landing/tasks.md`
- [NEW] `progress/impl_page_portal_dynamic_landing.md`

## Route Contract

The public route is `/portal/<companyId>` and maps to:

```typescript
export default async function PortalCompanyPage(
  props: PageProps<"/portal/[companyId]">,
): Promise<JSX.Element>
```

The page must await `props.params` to read `companyId`, following the local Next.js 16 dynamic route guidance.

## Data Contract

The dynamic page fetches from the existing local API route:

```text
GET /api/v1/company/<companyId>/wifi
```

Successful API packets are expected to contain:

```typescript
{
  success: true;
  data: {
    company_id: string;
    ssid: string;
    wifi_password: string;
    welcome_title: string;
    welcome_message: string;
    brand_color: string;
  };
}
```

The UI-facing configuration should normalize this to:

```typescript
interface DynamicPortalConfig {
  companyId: string;
  ssid: string;
  password: string;
  welcomeTitle: string;
  welcomeMessage: string;
  brandColor: string;
}
```

Fallback values:

- `ssid`: `"BusinessWiFi"`
- `password`: `"welcome123"`
- `welcomeTitle`: `"Welcome! Get Free WiFi"`
- `welcomeMessage`: `"Register below to connect to our network"`
- `brandColor`: `"#6366f1"`

## Data Flow

1. `src/app/portal/[companyId]/page.tsx` awaits `params` and trims the dynamic `companyId`.
2. The Server Component fetches `/api/v1/company/${encodeURIComponent(companyId)}/wifi`.
3. On a successful packet with complete data, the page maps API snake_case fields into `DynamicPortalConfig`.
4. On failed fetch, non-success packet, or malformed data, the page builds fallback config while preserving the route `companyId`.
5. The page renders `PortalDynamicClient` with the normalized config.
6. `PortalDynamicClient` owns name and phone state, calls `usePortal()` for registration, renders the customized CTA/form state, and shows `WifiInfoQrComponent` with the same dynamic credentials after successful registration.

## UI Design

The dynamic portal must remain mobile-first and more visibly branded than the static `/portal` page:

- Use a full-screen dark background with restrained accent color derived from `brandColor`.
- Present the company welcome title, message, SSID, and a clear "Connect to WiFi" CTA above or around the form.
- Preserve existing `data-testid` values for the registration inputs and button so existing portal behavior remains recognizable.
- Add dynamic-route-specific stable test IDs for E2E verification:
  - `dynamic-portal-shell`
  - `dynamic-portal-cta`
  - `dynamic-portal-ssid`
- Keep touch targets at least 44px high and avoid horizontal overflow at 375px width.

## Error Handling

The route must not call `notFound()` or throw when WiFi settings are missing. A captive portal should remain usable even if company configuration is temporarily unavailable.

Malformed or incomplete API data should use the full fallback config. Partial rendering with missing password or SSID is rejected because it would produce a broken QR workflow.

## Testing Strategy

The primary verification is Playwright E2E because the feature acceptance explicitly names browser rendering on mobile.

`tests/e2e/page_portal_dynamic_landing.spec.ts` will:

- Navigate to `/portal/demo-company` at a mobile viewport.
- Mock `GET **/api/v1/company/demo-company/wifi` with company-specific settings and verify `R1` through `R5`.
- Mock successful `POST **/api/v1/portal/register`, submit the form, and verify `R6`.
- Mock a failed settings request and verify fallback UI for `R4`.
- Check that the document body does not overflow horizontally at mobile width.

The implementer must also run `pnpm test:agent` and `./init.sh`. The E2E gate is already required by the feature acceptance; the implementer should document that E2E was included by spec rather than asking to skip it.

## Consulted Documentation

- `docs/specs.md`
- `docs/architecture.md`
- `docs/conventions.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`

## Rejected Alternatives

- Replacing the static `/portal` route was rejected because this feature explicitly requires `/portal/[companyId]` and existing E2E coverage depends on `/portal`.
- Fetching Supabase directly from the page was rejected because the project architecture requires frontend routes to use controllers or local API routes rather than models.
- Making the entire dynamic page a Client Component was rejected because Next.js 16 pages are Server Components by default and only the form interaction needs client state.
