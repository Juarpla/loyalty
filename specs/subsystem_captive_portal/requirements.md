# Requirements - subsystem_captive_portal (Feature ID: 76)

Feature 76 validates and closes the public guest network captive portal subsystem at `/portal`. The subsystem must expose the existing public onboarding flow, collect a guest name and phone number, submit registration through the portal hook/API path, and reveal usable WiFi credentials with an inline SVG QR code after registration succeeds.

- **R1 (Ubiquitous):** The system MUST expose a public App Router page at `src/app/portal/page.tsx` for the path `/portal` with metadata title matching `Connect to WiFi`.
- **R2 (Ubiquitous):** The `/portal` page MUST render a mobile-first guest onboarding form with required name and phone fields using `data-testid="portal-name-input"` and `data-testid="portal-phone-input"`.
- **R3 (Event-driven):** WHEN the guest submits the onboarding form, the system MUST delegate registration to the portal client state abstraction that posts the entered name and phone to `/api/v1/portal/register`.
- **R4 (State-driven):** WHILE registration is pending, the system MUST disable the submit button and show a connecting state on `data-testid="portal-submit-button"`.
- **R5 (Event-driven):** WHEN registration succeeds, the system MUST hide the registration form and render WiFi credentials through `WifiInfoQrComponent` with an inline SVG QR image.
- **R6 (Ubiquitous):** The WiFi credential view MUST display the network SSID and provide a copy-password action for the guest.
- **R7 (Unwanted behavior):** IF registration fails, THEN the system MUST keep the form visible and render the returned error message in an accessible alert.
- **R8 (Ubiquitous):** The public portal UI MUST remain usable at a 375px mobile viewport with no horizontal overflow and all primary form controls at least 44px tall.
- **R9 (Ubiquitous):** The system MUST include automated verification for route access, form rendering, registration request behavior, loading state, success QR rendering, failed registration, and mobile layout constraints.

## Verification Mapping

- **R1:** Playwright navigates to `/portal` and asserts the document title matches `Connect to WiFi`.
- **R2:** Playwright asserts the name input, phone input, and submit button are visible before registration.
- **R3:** Playwright intercepts `/api/v1/portal/register`, submits the form, and verifies the request payload contains the entered name and phone.
- **R4:** Playwright delays the intercepted registration response and asserts the submit button is disabled with connecting copy.
- **R5:** Playwright returns a successful registration response and asserts the form is hidden while the QR credential view is visible.
- **R6:** Playwright asserts the SSID text and copy-password action are visible in the credential view.
- **R7:** Playwright returns a failed registration response and asserts an accessible alert displays the error while the form remains visible.
- **R8:** Playwright checks a 375px viewport for no horizontal overflow and minimum 44px form control heights.
- **R9:** Passage of `tests/e2e/subsystem_captive_portal.e2e.test.ts`, `pnpm test:agent`, and the final `./init.sh`.
