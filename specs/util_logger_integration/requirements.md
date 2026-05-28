# Requirements

- **R1**: The system MUST export a constant named `logger` from `src/backend/utils/logger.utils.ts` that exposes three methods: `info`, `warn`, and `error`.

- **R2**: The `info` method MUST accept a `message: string` parameter and an optional `context?: unknown` parameter.

- **R3**: The `warn` method MUST accept a `message: string` parameter and an optional `context?: unknown` parameter.

- **R4**: The `error` method MUST accept a `message: string` parameter and an optional `error?: unknown` parameter.

- **R5**: WHEN `logger.info(message, context)` is invoked, the system MUST print a formatted entry to the standard output using `console.log` conforming to:
  `[INFO] [<ISO_TIMESTAMP>] <message>`
  where `<ISO_TIMESTAMP>` is a valid ISO 8601 timestamp string (e.g. `YYYY-MM-DDTHH:mm:ss.sssZ`).
  IF `context` is provided and is not undefined, THEN the system MUST append a JSON-formatted representation of the `context` (e.g. pretty-printed with 2 spaces or stringified) to the log message.

- **R6**: WHEN `logger.warn(message, context)` is invoked, the system MUST print a formatted entry to the standard error/warning stream using `console.warn` conforming to:
  `[WARN] [<ISO_TIMESTAMP>] <message>`
  where `<ISO_TIMESTAMP>` is a valid ISO 8601 timestamp string.
  IF `context` is provided and is not undefined, THEN the system MUST append a JSON-formatted representation of the `context` to the log message.

- **R7**: WHEN `logger.error(message, error)` is invoked, the system MUST print a formatted entry to the error stream using `console.error` conforming to:
  `[ERROR] [<ISO_TIMESTAMP>] <message>`
  where `<ISO_TIMESTAMP>` is a valid ISO 8601 timestamp string.
  IF `error` is provided and is not undefined, THEN the system MUST append the error (either serialized or string representation) to the log message.

- **R8**: Integration tests in `tests/integration/util_logger.test.ts` MUST assert the formatted output, tags (`[INFO]`, `[WARN]`, `[ERROR]`), presence of a valid timestamp, and context/error appending by spying on `console.log`, `console.warn`, and `console.error`.
