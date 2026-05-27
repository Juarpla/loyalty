# Tasks - controller_arrival_notifications (Feature ID: 53)

- [x] **T1:** Add arrival notification types to `src/backend/types/models.type.ts`, including `PortalArrivalRecord`, `ArrivalNotificationWithMeta`, `ArrivalNotificationsSummary`, `ArrivalNotificationsResult`, and `ArrivalControllerResponse`. Covers: R5, R6, R10.

- [x] **T2:** Add `ClientModel.getRecentPortalArrivals(limit = 10)` in `src/backend/models/client.model.ts`, with offline simulation rows, Supabase joined `wifi_logins` + `clients` reads, newest-first ordering, and existing database error mapping. Covers: R2, R7, R8, R9.

- [x] **T3:** Create `src/backend/controllers/arrival.controller.ts` with `ArrivalController.getNotifications()` that logs invocation, calls the model read method, delegates each row to `ArrivalService.buildNotification`, enriches notifications with arrival metadata, computes summary metrics, and returns the success envelope. Covers: R1, R2, R3, R4, R5, R6, R7.

- [x] **T4:** Implement controller error handling that logs caught exceptions and maps `DB_CONNECTION_FAILURE` and generic errors into the documented response envelopes. Covers: R8, R9.

- [x] **T5:** Add `tests/integration/controller_arrival_notifications.integration.test.ts` to verify successful formatting, empty-state behavior, summary metrics, service delegation, metadata preservation, `DB_CONNECTION_FAILURE` mapping, and generic error mapping. Covers: R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11.
