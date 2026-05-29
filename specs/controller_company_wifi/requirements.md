# Requirements

- **R1**: WHEN `CompanyController.getWifiSettings(companyId)` is invoked with a non-empty company ID, the system MUST call `CompanyModel.getWifiSettings(companyId)` and return a successful controller packet containing the model result.
- **R2**: IF `CompanyController.getWifiSettings(companyId)` is invoked with an empty or non-string company ID, THEN the system MUST return a 400 validation error packet.
- **R3**: WHEN `CompanyController.upsertWifiSettings(companyId, requestBody)` is invoked with a valid company ID and valid WiFi settings payload, the system MUST sanitize string fields, call `CompanyModel.upsertWifiSettings(...)`, and return a successful controller packet containing the persisted settings.
- **R4**: IF the WiFi settings request body is missing, non-object, or contains an empty `ssid`, THEN the system MUST return a 400 validation error packet.
- **R5**: IF the WiFi settings request body contains a password shorter than 8 characters or longer than 64 characters, THEN the system MUST return a 400 validation error packet.
- **R6**: IF optional branding fields are present with invalid values, THEN the system MUST return a 400 validation error packet.
- **R7**: IF the company model reports `VALIDATION_ERROR`, THEN the system MUST return a 400 validation error packet.
- **R8**: IF the company model reports `DB_CONNECTION_FAILURE`, THEN the system MUST return a 500 error packet with `DB_CONNECTION_FAILURE`.
- **R9**: IF the company model reports any other unexpected error, THEN the system MUST return a 500 error packet.
- **R10**: The system MUST include Vitest integration coverage in `tests/integration/controller_company_wifi.integration.test.ts` for successful reads, successful upserts, request validation, model validation mapping, database failure mapping, and generic error mapping.
