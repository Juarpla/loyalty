# Requirements — test_e2e_portal_onboarding_flow (Feature ID: 51)

## 1. Feature Description

Implements a comprehensive Playwright E2E test suite in `tests/e2e/portal_onboarding_flow.spec.ts` that validates the complete user onboarding journey in the Captive Portal. This covers routing to `/portal`, layout scaling at mobile viewports, form field validation and touch interactions, mock API registration flow with successful/failed states, dynamic view transitions to the WiFi QR code display component, and verification of the copy-to-clipboard functionality for WiFi credentials.

---

## 2. Requirements Specification (EARS-style)

- **R1 (Ubiquitous):** The E2E test suite MUST target the path `/portal` to verify page accessibility and check that the browser title contains `"Connect to WiFi"`.

- **R2 (Ubiquitous):** The E2E test suite MUST execute within a mobile viewport (e.g., width 375px, height 667px or 812px) with touch event simulation enabled to guarantee mobile layout compatibility and viewport containment.

- **R3 (Ubiquitous):** The E2E test suite MUST assert that the initial landing state displays a visible name input (`[data-testid="portal-name-input"]`), phone input (`[data-testid="portal-phone-input"]`), and submit button (`[data-testid="portal-submit-button"]`).

- **R4 (Event-driven):** WHEN form inputs are populated and the submit button is tapped, the test suite MUST mock the POST endpoint `/api/v1/portal/register` returning a successful `201 Created` response.

- **R5 (State-driven):** WHILE a registration request is in progress (simulated via api delay), the test suite MUST verify that the submit button becomes disabled and shows a loading state/spinner.

- **R6 (State-driven):** WHILE in the successful registration state, the test suite MUST assert that the registration form is hidden and the WiFi details and QR view component (`WifiInfoQrComponent`) is rendered.

- **R7 (Ubiquitous):** The E2E test suite MUST assert that the QR view displays the correct SSID (defaulting to `"BusinessWiFi"` or as configured) and that the "Copy Password" button is visible and clickable.

- **R8 (Event-driven):** WHEN the "Copy Password" button is clicked, the test suite MUST verify that the button text updates to show visual feedback (e.g. `"Copied Password!"` or `"Copied!"`) and that the clipboard content is successfully updated to match the configured password (defaulting to `"welcome123"`).

- **R9 (Event-driven):** IF the mock API returns a `400 Bad Request` or other server errors, THEN the test suite MUST verify that a visible error banner with `role="alert"` displays a descriptive error message and the registration form remains visible.

---

## 3. Verification Plan

- **R1:** Assert that `page.goto('/portal')` resolves successfully and that `page.title()` matches the regex `/Connect to WiFi/`.
- **R2:** Verify that `page.setViewportSize({ width: 375, height: 812 })` or `test.use({ viewport: { width: 375, height: 812 }, hasTouch: true })` is used.
- **R3:** Assert that inputs for name and phone and the submit button are present and visible in the initial DOM.
- **R4:** Intercept `/api/v1/portal/register` using Playwright's `page.route` to return a 201 status JSON payload.
- **R5:** Introduce a delay in the mock handler, trigger submit, and check that the submit button selector has the `disabled` attribute and shows "Connecting..." text.
- **R6:** Assert that the form fields and submit buttons are `.not.toBeVisible()` or hidden after a successful 201 API response.
- **R7:** Verify that the element containing SSID text `"BusinessWiFi"` is visible, and the SVG representing the QR code exists.
- **R8:** Request browser context permissions `['clipboard-read', 'clipboard-write']`, simulate clicking the copy button, assert the button text updates, and evaluate `navigator.clipboard.readText()` to verify it equals `"welcome123"`.
- **R9:** Intercept `/api/v1/portal/register` to return a 400 error status, click submit, assert that the locator `[role="alert"]` is visible and contains the mock error message, and check that the name input remains visible.
