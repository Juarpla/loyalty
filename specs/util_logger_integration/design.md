# Design

## Affected Files

- `src/backend/utils/logger.utils.ts` — **Modify / Audit**. Existing utility file containing standard logging interface. Ensure that implementation details fully satisfy all requirements R1-R7.
- `tests/integration/util_logger.test.ts` — **Create**. Standard integration tests for asserting console method calls, timestamp formatting, context handling, and error logging.

## Public Interface

```typescript
// src/backend/utils/logger.utils.ts

export const logger = {
  info: (message: string, context?: unknown) => void,
  warn: (message: string, context?: unknown) => void,
  error: (message: string, error?: unknown) => void
};
```

### Methods and Parameters

#### `logger.info`
| Name | Type | Description |
|------|------|-------------|
| `message` | `string` | The log message. |
| `context` | `unknown` | Optional metadata or object context to serialize as pretty-printed JSON. |

#### `logger.warn`
| Name | Type | Description |
|------|------|-------------|
| `message` | `string` | The warning message. |
| `context` | `unknown` | Optional metadata or object context to serialize as pretty-printed JSON. |

#### `logger.error`
| Name | Type | Description |
|------|------|-------------|
| `message` | `string` | The error message. |
| `error` | `unknown` | Optional error object or exception structure to log alongside the message. |

## Data Flow

Controllers, services, or models call `logger.info`, `logger.warn`, or `logger.error` directly. The helper gathers the current timestamp, formats the output prefix with correct stream tags (`[INFO]`, `[WARN]`, or `[ERROR]`), serializes any supplementary payload details, and outputs directly to standard output/error stream APIs (`console.log`, `console.warn`, or `console.error`).

```
Backend Component → logger.info("Record saved", payload)
                        ↓
                 [Gather ISO Timestamp]
                        ↓
                 [Format & Stringify]
                        ↓
     console.log("[INFO] [2026-05-28T...] Record saved", JSON.stringify(payload, null, 2))
```

## Error Handling

- **Null/Undefined Inputs**: If optional `context` or `error` arguments are omitted or undefined, they are ignored during printing and do not append additional trailing space.
- **Circular JSON Structures in Context**: If `context` cannot be JSON serialized due to circular references, the utility should gracefully fall back to native string conversion or safely stringify without breaking the application execution.

## Decisions & Alternatives

| Decision | Chosen Approach | Alternative Considered | Rationale |
|----------|-----------------|------------------------|-----------|
| Form Factor | Lightweight decoupled module | Custom winston/pino logger package | A simple, zero-dependency lightweight wrapper is extremely fast, highly predictable, and fits beautifully in Serverless or serverless-adjacent Next.js Edge/Node runtime boundaries. |
| Console Streams | Standard `console.log`, `warn`, and `error` methods | Direct `process.stdout.write` / `process.stderr.write` | Native console streams are compatible with both standard Node.js environments and edge runtime environments (e.g. Vercel, Cloudflare), guaranteeing portability. |
| Serialization | Pretty-printed JSON serialization for context | Flattened single-line serialization | Pretty-printed format provides superior readability in serverless log viewers and local terminal shells during developer iteration. |

## Next.js Docs Consulted

None. This is a decoupled pure Node/TypeScript backend utility helper.
