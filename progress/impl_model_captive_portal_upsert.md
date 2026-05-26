# Implementation Handoff: model_captive_portal_upsert

## Summary of behavior delivered
Added `registerPortalLogin` to `ClientModel` to upsert clients and insert a new session log into `wifi_logins` table using the `phone_number` as the unique identifier. It handles network failures, throws specific codes like `DB_CONNECTION_FAILURE`, and falls back to mock data when `offline_simulation` is active.
Fixed a TypeScript build error caused by casting `Error` to `Record<string, unknown>`.

## Files changed
- `src/backend/models/client.model.ts` (added `registerPortalLogin` method)
- `specs/model_captive_portal_upsert/tasks.md` (checked off tasks)
- `tests/integration/model_captive_portal_upsert.integration.test.ts` (new integration test)

## Commands run and results
- `pnpm test tests/integration/model_captive_portal_upsert.integration.test.ts` (Passed: 100%)
- `pnpm test` (Passed all suites)
- `./init.sh --quick` (Passed, [OK] harness ready)

## Traceability
- R1, R2, R3 -> `tests/integration/model_captive_portal_upsert.integration.test.ts`: "R1, R2, R3: should successfully upsert client and insert login details when connected"
- R4 -> `tests/integration/model_captive_portal_upsert.integration.test.ts`: "R4: should bubble up 'DB_CONNECTION_FAILURE' when database is unreachable"
- R5 -> `tests/integration/model_captive_portal_upsert.integration.test.ts`: "R5: should return simulated mock IDs when operating in offline_simulation mode"

## E2E Gate
Skipped. Change is not broad; it only affects a single backend database model class (`ClientModel`) and does not modify API routes or UI components.
