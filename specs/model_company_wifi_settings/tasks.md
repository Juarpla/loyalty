# Tasks

- [x] T1 - Create the company WiFi model types and `CompanyModel.getWifiSettings(companyId)` read method with validation, null handling, and DB connection error mapping. Covers: R1, R2, R3, R6.
- [x] T2 - Implement `CompanyModel.upsertWifiSettings(input)` using `company_id` as the conflict target and returning the persisted WiFi settings record. Covers: R4, R5, R6.
- [x] T3 - Add integration tests in `tests/integration/model_company_wifi_settings.integration.test.ts` and `tests/integration/model_company_wifi_settings.test.ts` covering read, null read, upsert create/update, validation failures, and DB connection failures. Covers: R1, R2, R3, R4, R5, R6, R7.
- [x] T4 - Run `pnpm db:lint`, `pnpm test:agent`, and `./init.sh`, then document verification, traceability, and the E2E gate result in `progress/impl_model_company_wifi_settings.md`. Covers: R7.
