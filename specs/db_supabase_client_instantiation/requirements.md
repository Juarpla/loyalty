# Requirements

- **R1**: The system MUST export an instance of `SupabaseModelClient` named `supabaseModel` from `src/backend/models/supabase.model.ts`.

- **R2**: `supabaseModel.getStatus()` MUST return an object matching the type `{ initialized: boolean; mode: 'production' | 'offline_simulation' }`.
  - IF both `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` are defined and valid non-empty strings, THEN `initialized` MUST be `true` and `mode` MUST be `'production'`.
  - IF either of the credentials is missing, null, or empty, THEN `initialized` MUST be `false` and `mode` MUST be `'offline_simulation'`.

- **R3**: `supabaseModel.getClient()` MUST return the instantiated `SupabaseClient<Database>` when the client is initialized in `production` mode.
  - IF `supabaseModel.getClient()` is called while in `'offline_simulation'` mode (not initialized), THEN it MUST throw an `Error` with message `"Supabase client is not initialized."`.

- **R4**: `supabaseModel.executeQuery<T>(queryName, mockData)` MUST log the query name via `logger.info` and return a Promise resolving to the provided `mockData` after a simulated latency delay between 50ms and 150ms.

- **R5**: The constructor of `SupabaseModelClient` MUST attempt to instantiate `createClient` using `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - IF the creation fails with an exception, THEN the error MUST be logged via `logger.error`, `isInitialized` MUST be `false`, and `getStatus().mode` MUST be `'offline_simulation'`.

- **R6**: Integration tests in `tests/integration/db_supabase_instantiation.test.ts` MUST verify:
  - Default offline simulation state when environment variables are omitted or mocked as empty.
  - Correct client instantiation and status return when mock Supabase credentials are provided.
  - Throwing of a descriptive exception if `getClient` is called in offline simulation mode.
  - Graceful catch and status downgrade to `'offline_simulation'` if client instantiation fails with an exception.
