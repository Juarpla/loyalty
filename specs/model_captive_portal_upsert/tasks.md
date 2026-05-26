# Tasks

- [x] T1 - Implement `registerPortalLogin` in `ClientModel` (`src/backend/models/client.model.ts`) with offline simulation fallback. Covers: R5.
- [x] T2 - Implement Supabase `upsert` logic for the `clients` table within `registerPortalLogin`. Covers: R1, R2.
- [x] T3 - Implement Supabase `insert` logic for the `wifi_logins` table within `registerPortalLogin`. Covers: R3.
- [x] T4 - Add robust error handling (catching network failures and query errors) to `registerPortalLogin`. Covers: R4.
- [x] T5 - Create integration tests in `tests/integration/model_captive_portal_upsert.test.ts` using `hygen test new` to assert upsert logic, offline simulation, and error throwing. Covers: R1, R2, R3, R4, R5.
