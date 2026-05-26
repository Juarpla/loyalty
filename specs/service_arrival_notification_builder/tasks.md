# Tasks — service_arrival_notification_builder (Feature ID: 52)

- [x] T1 - Add `ArrivalNotificationInput` and `ArrivalNotification` interfaces to `src/backend/types/models.type.ts`. Covers: R2, R7.
- [x] T2 - Create `src/backend/services/arrival.service.ts` exporting `ArrivalService.buildNotification(input)`. Covers: R1, R2.
- [x] T3 - Implement deterministic greeting text personalization, generic customer fallback, default business label, and whitespace normalization. Covers: R3, R4, R6.
- [x] T4 - Generate `whatsappUrl` by delegating to `encodeWhatsAppUrl(input.phone_number, greetingText)` without duplicating URL encoding logic. Covers: R5.
- [x] T5 - Create `tests/integration/service_arrival_notification_builder.integration.test.ts` covering personalized output, generic fallback output, whitespace normalization, timestamp validity, and WhatsApp URL behavior. Covers: R1, R2, R3, R4, R5, R6, R8.
- [x] T6 - Run `pnpm test`, `pnpm lint`, and `./init.sh --quick`; document verification in the implementation handoff. Covers: R8.
