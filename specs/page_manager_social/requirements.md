# Requirements for Manager Social Content Creation Page

- **R1** - WHEN visiting `/admin/social`, the system MUST render the manager social page layout.
- **R2** - The system MUST use the `useSocialIdeas` hook to manage the form state, loading state, error messages, success messages, and the list of generated ideas.
- **R3** - The system MUST display the `ContextForm` component, passing the necessary state variables (`context`, `loading`, `error`, `successMessage`) and callbacks (`setContext`, `onSubmit` mapped to `generateIdeas`).
- **R4** - IF the `ideas` list from the hook contains items, THEN the system MUST display the `SuggestionsCards` component populated with the generated ideas.
- **R5** - The system MUST apply responsive CSS classes to ensure the form and suggestions layout adapts dynamically across mobile, tablet, and desktop viewports (e.g., stacking on mobile, side-by-side or wide layouts on larger screens).
- **R6** - Playwright E2E tests in `tests/e2e/page_manager_social.spec.ts` MUST verify that the page renders the form, and that layout adaptations apply for different viewports.
- **R7** - WHEN the system is generating ideas (i.e., `loading` is true), it MUST display a skeletal loading indicator to signal progress to the user.
