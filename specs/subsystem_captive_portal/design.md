# Design - subsystem_captive_portal (Feature ID: 76)

## Scope

Expected implementation scope:

- `src/app/portal/page.tsx`
- `src/app/portal/portal.client.tsx`
- `src/hooks/use-portal.hook.ts`
- `src/components/wifi/qr.component.tsx`
- `tests/e2e/subsystem_captive_portal.e2e.test.ts`
- `specs/subsystem_captive_portal/tasks.md`
- `progress/impl_subsystem_captive_portal.md`

The existing `/portal` route, portal client component, portal hook, and WiFi QR component already cover most of this subsystem. Implementation should preserve those public interfaces and add only the changes needed to satisfy any missing requirements and traceable verification.

## Next.js Guides Referenced

- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

The local guides confirm that `src/app/portal/page.tsx` exposes `/portal`, that pages are Server Components by default, and that interactivity belongs behind a focused Client Component boundary.

## Public Interfaces

Route:

```text
GET /portal
```

Client component behavior:

```typescript
export function PortalClient(): JSX.Element
```

Portal hook contract:

```typescript
interface PortalRegisterData {
  name: string;
  phone: string;
}

interface UsePortalReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  registerClient: (data: PortalRegisterData) => Promise<void>;
  reset: () => void;
}
```

QR component contract:

```typescript
interface WifiInfoQrComponentProps {
  ssid: string;
  password?: string;
  security?: string;
  onCopy?: () => void;
}
```

## Data Flow

1. `src/app/portal/page.tsx` remains a Server Component that exports route metadata and renders `PortalClient`.
2. `PortalClient` owns browser form state for guest `name` and `phone`.
3. On submit, `PortalClient` calls `usePortal().registerClient({ name, phone })`.
4. `usePortal` posts JSON to `/api/v1/portal/register` and exposes loading, success, and error state to the component.
5. On success, `PortalClient` hides the form and renders `WifiInfoQrComponent` using configured public WiFi credentials from `NEXT_PUBLIC_WIFI_SSID` and `NEXT_PUBLIC_WIFI_PASSWORD`, falling back to safe demo defaults.
6. `WifiInfoQrComponent` renders an inline SVG QR image plus visible SSID/security/password copy affordances.

## Error Handling

Registration errors remain client-visible and retryable:

- Non-2xx API responses use `error` or `message` from the response JSON when available.
- Network or unexpected failures are surfaced as an accessible alert.
- The form stays mounted after an error so the guest can correct input and retry.

The QR generation path should not depend on a remote QR API. The inline SVG generator keeps the captive portal usable on restricted guest networks.

## Verification Strategy

Primary verification is Playwright because the feature is a public route and browser onboarding flow. The new E2E suite should be narrow and requirement-traceable:

- Route/title smoke check.
- Form visibility and mobile control sizing.
- Registration POST request body check.
- Loading state with a delayed mocked response.
- Success transition to the inline SVG QR credential view.
- Failure transition to an accessible alert without unmounting the form.
- Mobile overflow check at 375px width.

The implementer must document the E2E gate decision in `progress/impl_subsystem_captive_portal.md` because this feature verifies a browser route and hook-driven client flow.

## Rejected Alternatives

- Replacing `/portal` with `/portal/[companyId]` was rejected because feature 76 explicitly targets `/portal` and feature 71 already owns the dynamic company-specific portal path.
- Adding a backend model or database migration was rejected because registration persistence already belongs to the existing `/api/v1/portal/register` subsystem and this feature is scoped to public onboarding flow availability and verification.
- Calling an external QR image service was rejected because captive portals must remain functional before unrestricted internet access is available.
