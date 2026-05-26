# Design

## Affected Files
- `src/backend/models/client.model.ts` (adding new upsert logic)
- `src/backend/types/database.type.ts` (assumed updated or handled via local interface definitions)
- `tests/integration/model_captive_portal_upsert.test.ts` (new integration test)

## Public Interfaces
Add a new static method to `ClientModel`:
```typescript
static async registerPortalLogin(phone_number: string, name?: string): Promise<{
  clientId: string;
  loginId: string;
}>
```

## Data Flow
1. **Offline Mode:** If `supabaseModel.getStatus().mode === "offline_simulation"`, returns mock `clientId` and `loginId` immediately via `supabaseModel.executeQuery()`.
2. **Upsert Client:** Uses Supabase `upsert` on the `clients` table with `onConflict: 'phone_number'`. It provides `phone_number` and `name` (if present). Returns the `id` of the client.
3. **Insert Login Log:** Uses Supabase `insert` on the `wifi_logins` table with `client_id: client.id`. Returns the `id` of the login log.
4. **Output:** Returns an object containing `{ clientId, loginId }`.

## Error Handling
- Wrap operations in try/catch blocks.
- Check the `error` property on Supabase responses.
- If network error (`fetch failed`, `ECONNREFUSED`, `Failed to fetch`, `NetworkError`), throw `Error("DB_CONNECTION_FAILURE")`.
- Else, throw `Error(error.code || "DB_QUERY_ERROR")`.

## Next.js Local Docs Consulted
No Next.js specific docs needed; this is a pure backend data model interacting with the Supabase client.
