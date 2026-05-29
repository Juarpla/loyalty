# Requirements - page_company_wifi_dashboard (Feature ID: 72)

- **R1**: The management view MUST be accessible under the Next.js App Router path `src/app/admin/company/settings/page.tsx` as a server component page that renders a client component coordinator `src/app/admin/company/settings/company-settings.client.tsx`.
- **R2**: The dashboard view MUST utilize a hardcoded fallback or simulated context `demo-company` as the active `companyId` when fetching and updating settings, to bypass user authentication context in this version.
- **R3**: WHEN the dashboard panel is loaded, the client coordinator MUST trigger a GET request to `/api/v1/company/[companyId]/wifi` via a custom client hook `src/hooks/use-company-settings.hook.ts` and set a skeletal loading state until the data resolves.
- **R4**: IF the GET fetch returns a successful settings object, THEN the form inputs (SSID, password, welcome title, welcome message, brand color) MUST be prefilled with the fetched database settings.
- **R5**: The client settings panel MUST render a custom input form with validation logic conforming to:
  - `SSID`: Required, non-empty string.
  - `WiFi Password`: Required, string between 8 and 64 characters.
  - `Welcome Title`: Optional string up to 80 characters.
  - `Welcome Message`: Optional string up to 240 characters.
  - `Brand Color`: Optional string matching hex pattern `/^#[0-9a-fA-F]{6}$/`.
- **R6**: WHEN the user modifies the `Brand Color` input, the form MUST render a visual color swatch reflecting the selected hex value in real time.
- **R7**: WHEN the user clicks the save trigger, the client coordinator MUST execute a POST request to `/api/v1/company/[companyId]/wifi` with the updated JSON payload, managing loading/saving states and displaying success or error banners.
- **R8**: The layout MUST be fluidly responsive across small mobile viewports (375px wide) to large desktop screens, conforming to Tailwind CSS guidelines, featuring target actions >= 44px, and preventing horizontal layout overflow.
- **R9**: The system MUST include Playwright E2E verification in `tests/e2e/page_company_wifi_dashboard.spec.ts` asserting dashboard renders, visual color swatch updates, form submission behavior, network-error handlings, and mobile viewport responsive sizing.
- **R10**: The system MUST include Vitest integration verification in `tests/integration/hook_company_settings.test.tsx` (or `.ts`) checking the custom hook's network fetch lifecycle, local state mutations, validation enforcements, and error handlings.
