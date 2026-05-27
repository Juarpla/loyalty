# Requirements - component_manager_arrivals_feed (Feature ID: 56)

Feature 56 introduces the manager-facing Arrivals Feed UI component to render live captive portal arrivals and facilitate direct-to-WhatsApp greetings. The component is powered by the reactive hook from Feature 55 (`useArrivals()`).

## Requirements

- **R1 (Ubiquitous):** The system MUST expose an `ArrivalsFeedComponent` custom React component from `src/components/dashboard/arrivals-feed.component.tsx` accepting `notifications`, `summary`, `loading`, `error`, and `onRefresh` props.

- **R2 (State-driven):** WHILE `loading` is true, the system MUST render a skeleton view with at least 3 loading skeletons (`data-testid="arrivals-feed-skeleton"` and children `data-testid="arrivals-feed-skeleton-item"`).

- **R3 (Unwanted behavior):** IF `error` is a non-null string, THEN the system MUST display an error banner containing the error message and a retry button (`data-testid="arrivals-feed-error"`, `data-testid="error-message"`, and `data-testid="retry-button"`).

- **R4 (State-driven):** WHILE `loading` is false, `error` is null, and `notifications` is empty, the system MUST display an empty state banner with informational text (`data-testid="arrivals-feed-empty"`).

- **R5 (State-driven):** WHEN rendering active notifications (`loading === false` and `error === null` and `notifications` has elements), the system MUST render the feed container (`data-testid="arrivals-feed-populated"`) containing:
  - Summary stats panel at the top (`data-testid="arrivals-summary"`) displaying total count, named count, anonymous count, and latest arrival time.
  - A scrollable list of card elements (`data-testid="arrival-card-[loginId]"` or matching the item login ID):
    - For each item, display the client name (or "Cliente Anónimo" if the name is empty) (`data-testid="arrival-name"`).
    - For each item, display the masked or standard phone number (`data-testid="arrival-phone"`).
    - For each item, display the formatted timestamp (`data-testid="arrival-time"`).
    - For each item, display the greeting message preview (`data-testid="arrival-greeting"`).
    - For each item, display a prominent green WhatsApp action link/button (`data-testid="whatsapp-link"`) with `href` pointing to the prefilled `whatsappUrl`, `target="_blank"`, and `rel="noopener noreferrer"`.

- **R6 (Ubiquitous):** The component MUST support a manual refresh trigger button (`data-testid="refresh-button"`) that invokes the `onRefresh` callback prop.

- **R7 (Ubiquitous):** Playwright E2E tests in `tests/e2e/component_manager_arrivals_feed.spec.ts` MUST verify skeleton states, error banners with retry triggers, empty states, summary analytics counts, feed cards, anonymous placeholders, and WhatsApp action link properties on a dedicated test route `/test/arrivals-feed`.

## Verification Mapping

- **R1:** Verify that the component compiles and mounts with the specified TypeScript props interface.
- **R2:** Assert that the component renders a skeleton element containing at least three skeleton items when `loading` is set to `true`.
- **R3:** Assert that the component displays the exact error message and fires the `onRefresh` callback when the retry button is clicked during error states.
- **R4:** Assert that the empty state is displayed with an informational banner when the notifications array is empty and loading is false.
- **R5:** Assert that the summary stats display counts correctly, and each card renders name/anonymous, phone, arrivedAt, greeting, and a green WhatsApp link with correct `href`, `target`, and `rel` attributes.
- **R6:** Assert that clicking the header refresh button triggers the `onRefresh` callback.
- **R7:** Run E2E tests in `tests/e2e/component_manager_arrivals_feed.spec.ts` on the `/test/arrivals-feed` route to verify all visual states, layouts, and interactions.
