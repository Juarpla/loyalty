# Requirements - page_marketing_landing_hub (Feature ID: 73)

- **R1**: The system MUST render a premium dark-mode glassmorphic landing page when the root URL `/` is visited.
- **R2**: The page layout MUST include clear interactive entry points (rendered as touch-accessible cards/buttons) for the following subsystems:
  - **Cashier Portal**: Linking to `/admin/cash`
  - **Manager Dashboard**: Linking to `/admin/dashboard`
  - **Promotions Manager**: Linking to `/admin/promotions`
  - **Social Planner / Social Content Hub**: Linking to `/admin/social`
  - **Captive Portal / WiFi Captive Portal**: Linking to `/portal`
- **R3**: Every interactive card and link entry point on the page MUST conform to a minimum 44px by 44px touch tap target standard (using CSS height/padding/min-height layout constraints).
- **R4**: The page component MUST define and export Next.js App Router static metadata conforming to local guidelines, with a `title` containing "Loyalty Engine Hub" (or matching brand title) and a descriptive `description`.
- **R5**: The page MUST compile cleanly through the production build pipeline (`pnpm build`) and pass all ESLint static analysis rule checks (`pnpm lint`).
- **R6**: E2E tests in `tests/e2e/page_marketing_landing_hub.e2e.test.ts` MUST verify that navigating to `/` renders the page successfully, that all 5 subsystem card routes exist, have touch targets larger than 44px, and contain correct navigation links.

## Acceptance Criteria

1. Visually premium dark-mode glassmorphic landing page renders successfully at the root path `/`.
2. The page includes functional cards/buttons representing Cashier, Manager Dashboard, Promotions Manager, Social Planner, and Captive Portal.
3. Every card and action link conforms to a minimum 44px by 44px touch target boundary.
4. Correct `metadata` export is included in `/` matching App Router specification.
5. All pipeline compilations, ESLint, and E2E tests pass cleanly.

## Verification Evidence

- `src/app/page.tsx` exports default page component and exports `metadata` conforming to App Router guidelines.
- Cards/Links in `/` have `href` matching `/admin/cash`, `/admin/dashboard`, `/admin/promotions`, `/admin/social`, and `/portal`.
- CSS classes (e.g. `min-h-11`, `p-4`, etc.) guarantee a touch-tap height of at least 44px.
- Playwright E2E test file `tests/e2e/page_marketing_landing_hub.e2e.test.ts` verifies visibility, links, and touch-target sizes of all 5 card controls.
