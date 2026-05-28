# Requirements

- **R1**: WHEN `CompanyModel.getWifiSettings(companyId)` is invoked with a valid company ID, the system MUST return the matching company WiFi settings record containing `company_id`, `ssid`, `wifi_password`, `welcome_title`, `welcome_message`, and `brand_color`.
- **R2**: IF `CompanyModel.getWifiSettings(companyId)` is invoked with an empty or missing company ID, THEN the system MUST throw a `VALIDATION_ERROR`.
- **R3**: IF `CompanyModel.getWifiSettings(companyId)` is invoked for a company without WiFi settings, THEN the system MUST return `null`.
- **R4**: WHEN `CompanyModel.upsertWifiSettings(input)` is invoked with valid company WiFi settings, the system MUST upsert one `company_wifi_settings` row for the target `company_id` and return the persisted settings record.
- **R5**: IF `CompanyModel.upsertWifiSettings(input)` is invoked without `company_id`, `ssid`, or `wifi_password`, THEN the system MUST throw a `VALIDATION_ERROR`.
- **R6**: IF the database client reports a network or connection failure during either read or upsert, THEN the system MUST throw `DB_CONNECTION_FAILURE`.
- **R7**: The system MUST include integration tests in `tests/integration/model_company_wifi_settings.integration.test.ts` and `tests/integration/model_company_wifi_settings.test.ts` covering read, null read, upsert, validation errors, and database failure mapping.
