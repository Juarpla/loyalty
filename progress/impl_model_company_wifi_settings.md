# Feature Implementation: Company WiFi Settings Database Model Layer (Feature 68)

Implemented the backend model layer for reading and upserting per-company WiFi portal settings.

## Summary

- Added `CompanyModel.getWifiSettings(companyId)` in `src/backend/models/company.model.ts`.
- Added `CompanyModel.upsertWifiSettings(input)` in `src/backend/models/company.model.ts`.
- Added `CompanyWifiSettings` and `UpsertCompanyWifiSettingsInput` in `src/backend/types/company.type.ts`.
- Added integration tests in both required locations:
  - `tests/integration/model_company_wifi_settings.integration.test.ts`
  - `tests/integration/model_company_wifi_settings.test.ts`

## Behavior Delivered

- Reads `company_wifi_settings` by `company_id` and returns the public settings shape.
- Returns `null` when a company has no WiFi settings.
- Upserts settings using `company_id` as the conflict target.
- Preserves database defaults for optional branding fields when omitted.
- Throws `VALIDATION_ERROR` for missing required inputs.
- Maps Supabase network and connection failures to `DB_CONNECTION_FAILURE`.
- Supports offline simulation mode with deterministic mock settings.

## Verification Results

- `pnpm exec vitest run tests/integration/model_company_wifi_settings.integration.test.ts`: 6/6 tests passed.
- `pnpm db:lint`: passed with no schema errors.
- `pnpm test:agent`: 39 files, 293 tests passed.
- `pnpm lint`: passed.
- `./init.sh`: full harness passed with 39 files, 293 tests, lint, and production build green.

## Traceability

- R1 -> `tests/integration/model_company_wifi_settings.integration.test.ts`: "R1, R7: should return persisted company WiFi settings for a valid company ID"
- R2 -> `tests/integration/model_company_wifi_settings.integration.test.ts`: "R2, R7: should throw VALIDATION_ERROR when reading with an empty company ID"
- R3 -> `tests/integration/model_company_wifi_settings.integration.test.ts`: "R3, R7: should return null when a company has no WiFi settings"
- R4 -> `tests/integration/model_company_wifi_settings.integration.test.ts`: "R4, R7: should upsert company WiFi settings using company_id as conflict target"
- R5 -> `tests/integration/model_company_wifi_settings.integration.test.ts`: "R5, R7: should throw VALIDATION_ERROR when upsert input is missing required fields"
- R6 -> `tests/integration/model_company_wifi_settings.integration.test.ts`: "R6, R7: should throw DB_CONNECTION_FAILURE when read or upsert cannot reach the database"
- R7 -> `tests/integration/model_company_wifi_settings.integration.test.ts` and `tests/integration/model_company_wifi_settings.test.ts`

## E2E Gate

Human decision: not required. This feature is a backend database model layer only and does not touch UI, routes, or cross-layer user flows. Playwright E2E tests are not applicable.
