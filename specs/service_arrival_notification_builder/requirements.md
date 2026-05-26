# Requirements — service_arrival_notification_builder (Feature ID: 52)

## Context

Feature 52 adds a pure backend arrival greeting service for F4 Story 4.2: scanned QR generates a WhatsApp greeting alert. It builds deterministic welcome text and a direct `wa.me` link for a customer who has just registered or logged in through the captive portal.

## Requirements

- **R1 (Ubiquitous):** The system MUST expose an `ArrivalService` class from `src/backend/services/arrival.service.ts` with a static `buildNotification(input)` method.

- **R2 (Event-driven):** WHEN `buildNotification` receives a customer phone number and optional customer name, the system MUST return an arrival notification object containing `phone_number`, normalized `name`, `greetingText`, `whatsappUrl`, and `generatedAt`.

- **R3 (Ubiquitous):** The system MUST personalize `greetingText` with the trimmed customer name when a non-empty name is provided, otherwise it MUST use a generic customer greeting.

- **R4 (Ubiquitous):** The system MUST support an optional `businessName` input and include the trimmed business name in `greetingText`, otherwise it MUST use a deterministic default business label.

- **R5 (Event-driven):** WHEN generating `whatsappUrl`, the system MUST delegate URL formatting to the existing `encodeWhatsAppUrl(phone, text)` helper using the original phone number and generated greeting text.

- **R6 (Unwanted behavior):** IF the customer name or business name contains leading or trailing whitespace, THEN the system MUST trim those values before using them in the returned object or greeting text.

- **R7 (Ubiquitous):** The system MUST define reusable `ArrivalNotificationInput` and `ArrivalNotification` TypeScript interfaces in `src/backend/types/models.type.ts`.

- **R8 (Ubiquitous):** Integration tests in `tests/integration/service_arrival_notification_builder.integration.test.ts` MUST verify personalized greetings, generic fallback greetings, whitespace normalization, generated timestamps, and WhatsApp URL delegation behavior.

## Verification Map

- **R1:** Import `ArrivalService` in the integration test and assert `buildNotification` exists and returns the expected shape.
- **R2:** Test a valid phone/name input and assert all required output fields are present.
- **R3:** Test both named and unnamed customers and assert the greeting text changes deterministically.
- **R4:** Test provided `businessName` and omitted `businessName`.
- **R5:** Mock or spy on `encodeWhatsAppUrl` and assert it receives the original phone number and exact generated greeting text.
- **R6:** Test whitespace-padded name/business inputs.
- **R7:** TypeScript compile and imports from `models.type.ts` verify the interfaces.
- **R8:** `pnpm test` must include and pass the new integration test file.
