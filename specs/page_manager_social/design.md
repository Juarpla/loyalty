# Design for Manager Social Content Creation Page

## Files to Change
- `src/app/admin/social/page.tsx` (New file)
- `tests/e2e/page_manager_social.spec.ts` (New file)

## UI Layout and Components
The page at `/admin/social` acts as the View layer coordinating the `useSocialIdeas` hook with the `ContextForm` and `SuggestionsCards` components. 

- **Page Component**: It will be a Client Component (`"use client";`) because it relies on the custom hook to maintain state. Alternatively, it could be a Server Component that wraps a Client Component orchestrator, but for simplicity, we will implement the page as a Client Component, or a thin Server Component containing a dedicated Client Component like `SocialDashboardClient`. Given the architecture, it is best to use a Client Component for the page content, or render the hook-consuming layout inside a Client Component. We will export a default `SocialPage` component marked with `"use client"`.

- **Viewport Adaptations**:
  - The page will use a container with responsive padding (`p-4 md:p-8`).
  - The layout will be a single-column stack on mobile devices (`flex flex-col gap-8`).
  - On larger screens (lg), we can utilize a two-column grid (`lg:grid lg:grid-cols-12 lg:gap-8`) where the form takes the left column (e.g., `lg:col-span-5`) and the suggestions take the right column (`lg:col-span-7`).
  - **Loading State**: When the `useSocialIdeas` hook indicates `loading` is true, the page will render a skeletal loading indicator (e.g., using Tailwind's `animate-pulse` utility with rounded placeholder boxes) in place of the `SuggestionsCards` to visually signal progress.

## Data Flow
1. User visits `/admin/social`.
2. Page mounts and initializes `useSocialIdeas`.
3. The page renders `ContextForm`, passing the context string and control callbacks.
4. When the user submits, `generateIdeas` is triggered, setting `loading` to true.
5. The API responds with an array of `SocialIdea` objects.
6. The `ideas` array state is updated.
7. The page re-renders, displaying the `SuggestionsCards` component below (or next to) the form.

## Next.js Documentation Consulted
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Rejected Alternatives
- **Alternative**: Passing a Server Action to the form instead of using an API route through the `useSocialIdeas` hook.
- **Reason for Rejection**: The application architecture explicitly requires using thin API pass-throughs ("pasamanos") and hooks (`src/hooks/*`) for frontend data fetching to maintain a strict decoupled MVC structure.
