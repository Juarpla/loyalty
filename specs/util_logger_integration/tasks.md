# Tasks

- [x] T1 - Audit and verify `src/backend/utils/logger.utils.ts` implementation to ensure it meets requirements R1-R7, implementing any required improvements. Covers: R1, R2, R3, R4, R5, R6, R7.

- [x] T2 - Create integration tests in `tests/integration/util_logger.test.ts` using Vitest to assert correct console routing, tag inclusion, ISO timestamp formats, context appending, and exception states. Covers: R8.

  Test cases must include:
  - `logger.info` outputs formatted tag `[INFO]`, valid ISO timestamp, and message. (R2, R5, R8)
  - `logger.info` appends serialized JSON context if provided. (R2, R5, R8)
  - `logger.warn` outputs formatted tag `[WARN]`, valid ISO timestamp, and message. (R3, R6, R8)
  - `logger.warn` appends serialized JSON context if provided. (R3, R6, R8)
  - `logger.error` outputs formatted tag `[ERROR]`, valid ISO timestamp, and message. (R4, R7, R8)
  - `logger.error` appends raw/serialized error details if provided. (R4, R7, R8)
  - Handle null/undefined values gracefully without extra formatting spaces. (R5, R6, R7, R8)
