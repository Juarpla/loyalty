# Tasks — test_e2e_portal_onboarding_flow (Feature ID: 51)

Use this executable task list to implement the Playwright E2E tests for the captive portal onboarding flow.

- [x] T1 - Create E2E test structure in `tests/e2e/portal_onboarding_flow.spec.ts`. Define a `test.describe` and add a `beforeEach` hook configuring a mobile viewport size of 375x812 with touch support. Covers: R1, R2.
- [x] T2 - Add test case to assert that page `/portal` is accessible, matches page title `/Connect to WiFi/`, and initial form input components are visible. Covers: R1, R3.
- [x] T3 - Add test case for registration loading state. Intercept POST requests to `/api/v1/portal/register` with a delay, trigger form submission, and assert that the submit button goes into a disabled state showing `"Connecting..."` text. Covers: R4, R5.
- [x] T4 - Add test case for successful onboarding flow. Intercept POST `/api/v1/portal/register` to return a 201 response. Assert that on submission, the registration form is hidden and the WiFi details view displays the SSID `"BusinessWiFi"` and automatic connection instructions. Covers: R4, R6, R7.
- [x] T5 - Implement clipboard verification. Configure clipboard permissions on the browser context. Within the successful onboarding test, trigger a click on the "Copy Password" button, assert visual feedback change, and assert that `navigator.clipboard.readText()` equals `"welcome123"`. Covers: R8.
- [x] T6 - Add test case for error registration flow. Mock POST `/api/v1/portal/register` to return a 400 Bad Request error. Assert that an alert banner with role `"alert"` displays the error message, and the registration input form remains visible and interactable. Covers: R9.
