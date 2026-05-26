# Design — page_portal_landing (Feature ID: 50)

## 1. Overview

This feature creates the public-facing Captive Portal Onboarding page at `/portal`. It
integrates the existing `usePortal` hook (F48) and `WifiInfoQrComponent` (F49) into a
single cohesive page experience. No new backend routes, services, or hooks are required.

---

## 2. Files Expected to Change

### New Files

| Path | Purpose |
|---|---|
| `src/app/portal/page.tsx` | Server Component — exports `metadata` and mounts the client component |
| `src/app/portal/portal.client.tsx` | Client Component — registration form + conditional WiFi QR display |
| `tests/e2e/page_portal_landing.e2e.test.ts` | Playwright E2E tests |

### No changes to existing files

The `usePortal` hook and `WifiInfoQrComponent` are consumed as-is. No modifications to
existing production code are required.

---

## 3. Public Interfaces & Props

### `page.tsx` (Server Component)
```ts
export const metadata: Metadata = {
  title: "Connect to WiFi | Loyalty Portal",
  description: "Register to access free WiFi and join our loyalty program.",
};

export default function PortalPage() {
  return <PortalClient />;
}
```

### `portal.client.tsx` (Client Component)
```ts
"use client";

// Internal state from usePortal()
// Renders:
//   - Registration form when isSuccess === false
//   - WifiInfoQrComponent when isSuccess === true
// Props: none (self-contained)
```

### WiFi Credential Resolution
```ts
const ssid = process.env.NEXT_PUBLIC_WIFI_SSID ?? "BusinessWiFi";
const password = process.env.NEXT_PUBLIC_WIFI_PASSWORD ?? "welcome123";
```

These are `NEXT_PUBLIC_` vars so they are inlined at build time and safe for the client bundle.

---

## 4. Data Flow

```
[User visits /portal]
       ↓
[PortalPage (Server)]
       ↓ renders
[PortalClient (Client)]
       ↓ calls
[usePortal() hook]
       ↓ exposes { isLoading, isSuccess, error, registerClient, reset }
       ↓
[Registration Form] ──(submit)──→ registerClient({ name, phone })
       ↓                                 ↓
[API POST /api/v1/portal/register]    [isSuccess = true]
       ↓ 201                              ↓
[WifiInfoQrComponent shown]         [Form hidden]
```

---

## 5. Component Layout

The Client Component uses a single-column, max-w-sm centered layout consistent with
`WifiInfoQrComponent`'s own max-w-sm card. The page background uses `min-h-screen bg-zinc-950`
matching the admin pages.

**Registration form state:**
```
┌────────────────────────────┐
│  [Logo/Title area]         │
│  Welcome! Join & get WiFi  │
│                            │
│  Name: [input]             │
│  Phone: [input]            │
│  [Connect Button]          │
│  [error banner if any]     │
└────────────────────────────┘
```

**Success state (WiFi revealed):**
```
┌────────────────────────────┐
│  WifiInfoQrComponent       │
│  (QR + Copy Password btn)  │
└────────────────────────────┘
```

---

## 6. Error Handling

| Scenario | Behavior |
|---|---|
| `error` non-null from hook | Render `role="alert"` banner with error text inside the form view |
| Network failure | Hook surfaces error string; banner shown |
| Empty name or phone | HTML5 `required` attribute prevents submission before hook is called |

---

## 7. Next.js Local Guides Referenced

- **Server and Client Components:**
  `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  — Server Component exports metadata; Client Component uses hooks.
- **Layouts and Pages:**
  `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  — Page route at `src/app/portal/page.tsx` is automatically accessible at `/portal`.

---

## 8. Rejected Alternatives

| Alternative | Reason rejected |
|---|---|
| Single "use client" page with inline metadata | Next.js forbids exporting `metadata` from a Client Component (throws build error); Server/Client split is mandatory per the pattern established in F8, F15, F28, F42. |
| Using a separate `CaptivePortalForm` component file | The feature list has no such component; inlining the form in `portal.client.tsx` keeps scope atomic to this feature without exceeding its boundaries. |
| Fetching WiFi credentials from the API at runtime | Adds complexity and a network round-trip; `NEXT_PUBLIC_` env vars provide a simpler, zero-latency solution appropriate for a local business deployment. |

---

## 9. Testing Strategy

- **E2E only** — no new Vitest integration tests are required because this feature adds only
  a page-level integration of existing, already-tested units (hook + component). The E2E tests
  validate the assembled behavior.
- Tests use Playwright `page.route()` to intercept `/api/v1/portal/register` and return
  controlled 201 or 400 responses, avoiding the need for a live Supabase connection in CI.
