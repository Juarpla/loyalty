# Requirements - controller_arrival_notifications (Feature ID: 53)

## Context

Feature 53 adds the backend controller action for F4 Story 4.2: scanned QR generates a `wa.me` greeting alert. Feature 52 already provides `ArrivalService.buildNotification(input)` for deterministic greeting text and WhatsApp link formatting. This feature coordinates recent captive portal login records, transforms them into arrival notifications, and returns a stable controller response for the future API route.

## Requirements

- **R1 (Ubiquitous):** The system MUST expose an `ArrivalController` class from `src/backend/controllers/arrival.controller.ts` with a static `getNotifications()` method.

- **R2 (Event-driven):** WHEN `ArrivalController.getNotifications()` is invoked, the system MUST log the invocation and fetch recent portal arrival records through the backend model layer.

- **R3 (Event-driven):** WHEN recent portal arrival records resolve successfully, the system MUST return `{ success: true, data: { notifications, summary } }`.

- **R4 (Ubiquitous):** The system MUST format every returned arrival record by delegating to `ArrivalService.buildNotification()` with the record `phone_number`, optional `name`, and optional business name.

- **R5 (Ubiquitous):** The system MUST include each notification with the greeting fields from `ArrivalService` plus arrival metadata containing `clientId`, `loginId`, and `arrivedAt`.

- **R6 (Ubiquitous):** The system MUST include summary metrics containing `total`, `named`, `anonymous`, `generatedAt`, and `latestArrivalAt`.

- **R7 (Unwanted behavior):** IF no recent portal arrival records exist, THEN the system MUST return an empty `notifications` array and zeroed summary counts without treating the condition as an error.

- **R8 (Unwanted behavior):** IF the model layer throws `DB_CONNECTION_FAILURE`, THEN the system MUST return `{ success: false, status: 500, error: "DB_CONNECTION_FAILURE" }`.

- **R9 (Unwanted behavior):** IF the model layer throws any other error, THEN the system MUST log the exception and return `{ success: false, status: 500, error: <message or "Failed to get arrival notifications"> }`.

- **R10 (Ubiquitous):** The system MUST define reusable TypeScript interfaces for recent arrival records, enriched arrival notifications, summary metrics, and controller responses in `src/backend/types/models.type.ts`.

- **R11 (Ubiquitous):** Integration tests in `tests/integration/controller_arrival_notifications.integration.test.ts` MUST verify success formatting, empty-state behavior, summary metrics, service delegation, `DB_CONNECTION_FAILURE` mapping, and generic error mapping.

## Verification Map

- **R1:** Import `ArrivalController` in the integration test and assert `getNotifications` returns the documented envelope.
- **R2:** Spy on the model read method and logger invocation.
- **R3:** Mock model rows and assert the success response shape.
- **R4:** Spy on `ArrivalService.buildNotification` and assert one call per model row.
- **R5:** Assert each notification includes `clientId`, `loginId`, `arrivedAt`, `phone_number`, `name`, `greetingText`, `whatsappUrl`, and `generatedAt`.
- **R6:** Assert summary metrics for mixed named and anonymous arrivals.
- **R7:** Mock an empty model result and assert empty notifications plus zeroed counts.
- **R8:** Mock `DB_CONNECTION_FAILURE` and assert the exact error envelope.
- **R9:** Mock a generic thrown error and assert logging plus fallback error envelope behavior.
- **R10:** TypeScript compilation and imports from `models.type.ts` verify the shared interfaces.
- **R11:** `pnpm test` must include and pass the new integration test file.
