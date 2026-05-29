# Tasks

- [x] T1 - Add `src/backend/controllers/company.controller.ts` with `CompanyController.getWifiSettings` and `CompanyController.upsertWifiSettings` contracts. Covers: R1, R3.
- [x] T2 - Implement company ID, request body, SSID, password, and optional branding validation with sanitized model input. Covers: R2, R3, R4, R5, R6.
- [x] T3 - Map model and unexpected errors into controller response packets. Covers: R7, R8, R9.
- [x] T4 - Add Vitest integration tests in `tests/integration/controller_company_wifi.integration.test.ts` covering successful flows, validations, and error mappings. Covers: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10.
- [x] T5 - Run `pnpm test:agent` and `./init.sh`, then write `progress/impl_controller_company_wifi.md` with traceability and E2E gate outcome. Covers: R10.
