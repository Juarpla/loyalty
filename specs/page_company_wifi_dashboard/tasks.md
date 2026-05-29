# Tasks - page_company_wifi_dashboard (Feature ID: 72)

- [x] **T1 - Create the Custom Hook `use-company-settings.hook.ts`**
  - Implement dynamic settings fetching from `/api/v1/company/[companyId]/wifi` (using `demo-company` as default ID).
  - Manage state flags: `loading`, `saving`, `error`, `success`.
  - Validate SSID, password, titles, and hex color values prior to submission.
  - Expose a `saveSettings` method that executes the POST request.
  - Covers: R3, R4, R5, R7, R10.

- [x] **T2 - Create the color swatch and live preview UI components**
  - Implement a `<ColorSwatch />` component in `src/components/company/color-swatch.component.tsx` rendering a responsive colored block that updates dynamically as brand color hex changes.
  - Integrate a tactile mockup portal preview block displaying customized title, message, and brand color styles.
  - Covers: R6, R8.

- [x] **T3 - Implement the client coordinator views**
  - Create `src/app/admin/company/settings/company-settings.client.tsx` using standard styling, loading skeletons, and success/error status banners.
  - Add text fields for SSID, Password, Welcome Title, Welcome Message, and Brand Color.
  - Ensure all action buttons and input fields have heights >= 44px for touch readability.
  - Covers: R1, R2, R3, R4, R5, R6, R7, R8.

- [x] **T4 - Integrate route pages and navigation**
  - Add page wrapper `src/app/admin/company/settings/page.tsx` rendering `<CompanySettingsClient />`.
  - Extend navigation bars in dashboard, cashier, promotions, and social clients to include a Link pointing to `/admin/company/settings`.
  - Covers: R1, R2.

- [x] **T5 - Add Vitest integration tests for the hook**
  - Create `tests/integration/hook_company_settings.test.tsx` (or `.ts`) asserting successful reads, successful updates, schema validation overrides, loading/saving state toggles, and network/server error handling wrappers.
  - Covers: R10.

- [x] **T6 - Add Playwright E2E verification flows**
  - Create `tests/e2e/page_company_wifi_dashboard.spec.ts`.
  - Assert dashboard accessibility, dynamic fetching, form fields editing, real-time swatch rendering, save submission updates, and responsive viewport sizing down to 375px without horizontal scrolling.
  - Covers: R9.
