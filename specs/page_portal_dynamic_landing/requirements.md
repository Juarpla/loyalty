# Requirements - page_portal_dynamic_landing (Feature ID: 71)

## Overview

Feature 71 adds a company-specific public portal route at `/portal/[companyId]`. The route must load dynamic WiFi configuration from the existing company WiFi API, render a premium branded landing experience, and preserve the existing captive portal registration and QR workflow for mobile visitors.

## Requirements

- **R1 (Ubiquitous):** The system MUST expose a dynamic App Router page at `src/app/portal/[companyId]/page.tsx` for the public path `/portal/<companyId>`.
- **R2 (Event-driven):** WHEN the dynamic portal page renders, the system MUST await the `companyId` route parameter and request `/api/v1/company/<companyId>/wifi` to retrieve company WiFi settings.
- **R3 (Event-driven):** WHEN company WiFi settings are retrieved successfully, the system MUST render the portal using the returned `ssid`, `wifi_password`, `welcome_title`, `welcome_message`, and `brand_color`.
- **R4 (Unwanted behavior):** IF company WiFi settings cannot be retrieved, THEN the system MUST render a branded fallback portal using default credentials and copy without throwing a route error.
- **R5 (Ubiquitous):** The dynamic portal UI MUST include mobile-first premium CTA content customized with the company welcome copy and SSID before registration.
- **R6 (Event-driven):** WHEN a visitor completes the existing registration flow successfully, the system MUST render `WifiInfoQrComponent` with the same company-specific SSID and password used by the landing state.
- **R7 (Ubiquitous):** The dynamic portal implementation MUST keep browser-only form state inside a Client Component and keep the dynamic page component as a Server Component.
- **R8 (Ubiquitous):** The system MUST include automated verification for the dynamic route, company settings fetch behavior, fallback behavior, customized landing copy, and successful QR rendering.

## Verification Mapping

- **R1:** Verify `src/app/portal/[companyId]/page.tsx` exists and the E2E suite can navigate to `/portal/demo-company`.
- **R2:** E2E test intercepts `/api/v1/company/demo-company/wifi` and asserts the route is requested.
- **R3:** E2E test asserts returned company welcome copy, brand cue, and SSID are visible on the dynamic portal.
- **R4:** E2E test intercepts the settings endpoint with a failure and asserts default portal copy and credentials render.
- **R5:** E2E test at mobile viewport asserts the CTA block and registration controls are visible without horizontal overflow.
- **R6:** E2E test completes registration and asserts `WifiInfoQrComponent` displays the company SSID.
- **R7:** Code review verifies `page.tsx` is a Server Component and interactive form behavior remains in a Client Component.
- **R8:** Existence and passage of `tests/e2e/page_portal_dynamic_landing.spec.ts`; implementer must also run `pnpm test:agent` and `./init.sh`.
