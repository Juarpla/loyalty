# Design

## Affected Files

- `src/backend/models/supabase.model.ts` — **Audit / Refactor**. Existing file contains standard instantiation logic. We need to ensure it strictly conforms to all requirements, handles credential changes dynamically (or has clean hooks for testing), and safely falls back on exceptions.
- `tests/integration/db_supabase_instantiation.test.ts` — **Create**. New integration test suite for verifying default offline simulation mode, mock production mode with custom credentials, exception handling, and simulated execution.

## Public Interface

```typescript
// src/backend/models/supabase.model.ts

import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.type";

export class SupabaseModelClient {
  private isInitialized: boolean;
  private supabaseUrl: string | null;
  private supabaseAnonKey: string | null;
  private client: SupabaseClient<Database> | null;

  constructor();
  
  public getStatus(): { initialized: boolean; mode: "production" | "offline_simulation" };
  
  public getClient(): SupabaseClient<Database>;
  
  public executeQuery<T>(queryName: string, mockData: T): Promise<T>;
}

export const supabaseModel: SupabaseModelClient;
```

## Data Flow & Initialization

```
Startup / Import of supabase.model.ts
                 │
                 ▼
     Read process.env Variables
                 │
        ┌────────┴────────┐
        ▼                 ▼
[Credentials Exist]  [Credentials Missing]
        │                 │
        ▼                 ▼
   createClient()    Set mode = "offline_simulation"
   isInitialized=true     │
        │                 ▼
        │            logger.warn()
        ▼
logger.info()
```

## Error Handling

- **Missing Credentials**: Does not raise an error; log a warning via `logger.warn` explaining that the system is running in offline simulation mode, and set status attributes accordingly.
- **Instantiation Exception**: If `createClient` throws (due to invalid URL or parameters), catch the exception, log it via `logger.error`, set `isInitialized` to `false`, and set status mode to `"offline_simulation"`.

## Decisions & Alternatives

| Decision | Chosen Approach | Alternative Considered | Rationale |
|----------|-----------------|------------------------|-----------|
| Singleton Exports | Exporting `supabaseModel` as a singleton instance | Initializing on every request or exporting class only | Singletons prevent connection pool exhaustion and redundant client initialization overhead. |
| Testability of class | Export the `SupabaseModelClient` class alongside the singleton instance | Export ONLY the singleton | Exporting the class allows integration tests to instantiate clean test instances with custom mock environments/credentials without polluting the shared global module singleton state. |

## Next.js Docs Consulted

- None. Decoupled Node/TypeScript model utility.
