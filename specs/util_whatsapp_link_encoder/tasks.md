# Tasks

- [x] T1 - Create `src/backend/utils/whatsapp.utils.ts` with `encodeWhatsAppUrl` function. Covers: R1, R2, R4, R5, R6, R7.

- [x] T2 - Write integration tests in `tests/integration/util_whatsapp_link_encoder.test.ts`. Covers: R1, R2, R3, R4, R5, R6, R7.

  Test cases must include:
  - Basic URL construction with valid phone and text (R1, R2)
  - Blank spaces encoded as `%20` (R3)
  - Non-digit characters stripped from phone (R4)
  - Special characters in text (R5)
  - Empty phone after sanitization (R6)
  - Empty text message (R7)
