# Design - page_marketing_landing_hub (Feature ID: 73)

## Affected Files

- [UPDATE] `src/app/page.tsx` — Add App Router `metadata` export to set page-level SEO attributes. Ensure the card container styles and interactive elements are fully standard-compliant (R3, R4).
- [NEW] `tests/e2e/page_marketing_landing_hub.e2e.test.ts` — Create Playwright E2E integration test verifying the hub page, presence of the 5 cards, links, metadata, and 44px touch tap bounds (R6).

## Architecture & Data Flow

```mermaid
graph TD
    Root[/] -->|Visits root route| Page[src/app/page.tsx]
    Page -->|Renders root UI| Layout[src/app/layout.tsx]
    
    subgraph SubsystemLinks ["Interactive Interface Cards (Touch targets >= 44px)"]
        Link1[Cashier Portal] -->|Navigates| Route1[/admin/cash]
        Link2[Manager Dashboard] -->|Navigates| Route2[/admin/dashboard]
        Link3[Promotions Manager] -->|Navigates| Route3[/admin/promotions]
        Link4[Social Content Hub] -->|Navigates| Route4[/admin/social]
        Link5[WiFi Captive Portal] -->|Navigates| Route5[/portal]
    end
    
    Page -.->|Exports| Metadata[Static Metadata Object]
```

### Next.js App Router Metadata Export

In Next.js App Router, metadata should be exported statically from Server Components. Because the root page component `Home` is currently a Server Component (no `"use client"` directive), we can easily export `metadata` directly from `src/app/page.tsx`:

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loyalty Engine Hub | Enterprise Core",
  description: "Enterprise local business customer loyalty platform core dashboard, featuring cashier operations, AI marketing promotion drafting, live traffic analytics, and guest captive wifi logins.",
};
```

### Touch Tap Target Size Standard (44px x 44px)

Per W3C mobile accessibility standards (and Feature Acceptance Criteria), all interactive target boundaries must be at least `44px` in height and width:
- Tailwind's `p-4` (16px padding on all sides) around text content ensures the target expands well beyond 44px.
- Height of cards: the combination of padding `p-4` (32px vertical) and text line height (~20px) yields `52px` of vertical click zone.
- Visual icon containers: uses `w-12 h-12` (`48px`) or `w-10 h-10` with margins, ensuring adequate tap targets.
- Hero CTA buttons: `Link` items utilize class `min-h-11` (`44px` minimum height) or standard padding (`py-3.5`) to hit `48px` to `52px` vertical bounds.

### Verification of E2E Logic

In `tests/e2e/page_marketing_landing_hub.e2e.test.ts`, the E2E script will use Playwright assertions:
1. Navigate to `/`.
2. Retrieve the standard metadata title page header.
3. Locate the 5 interface cards.
4. Retrieve the bounding box (`boundingBox()`) of each card to verify that both `width` and `height` are strictly `>= 44`.
5. Check that the `href` attribute of each card points to the correct subsystem URL.

## Implementation Decisions

- **Keep Page as a Server Component**: The root landing page does not hold any dynamic React state, hooks, or interactive state variables. Keeping it as a Next.js Server Component is highly optimal because it serves static markup directly, supports fast static metadata exports, and yields excellent Core Web Vitals performance.
- **Card Styling Integration**: Keep the fluid glassmorphic styling (dark gradient background `from-[#090b16] via-[#05060c] to-[#010103]`, ambient lighting orbs, backdrop-blur, and border overlays) as it matches the premium dark UI aesthetic.
- **Inline SVG / Lucide Icons**: Keep importing Lucide react icons because they compile cleanly and support SVG scaling natively.

## Next.js Docs Consulted

- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` — Root route routing and layouts structure.
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — Metadata config conventions for App Router pages.
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — Validating Server vs Client component boundaries.

## Rejected Alternatives

- **Injecting `"use client"` at Root level**: Rejected; converting the entire page to a Client Component is unnecessary since there is no client-side state. Keeping it as a Server Component allows Next.js to pre-render the static HTML, optimizing initial page load speed (INP/LCP indices).
- **Hardcoding inline styles for 44px tap targets**: Rejected; using Tailwind CSS utility classes like `p-4`, `min-h-11` or `h-12` is highly maintainable, responsive, and completely complies with our Tailwind design guidelines.
