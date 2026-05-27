import { ClientModel } from "../models/client.model";
import { ArrivalService } from "../services/arrival.service";
import type {
  ArrivalControllerResponse,
  ArrivalNotificationInput,
  ArrivalNotificationWithMeta,
  ArrivalNotificationsSummary,
  PortalArrivalRecord,
} from "../types/models.type";
import { logger } from "../utils/logger.utils";

export class ArrivalController {
  static async getNotifications(): Promise<ArrivalControllerResponse> {
    logger.info("ArrivalController.getNotifications started");

    try {
      const arrivals = await ClientModel.getRecentPortalArrivals();
      const notifications = arrivals.map((arrival) =>
        buildArrivalNotification(arrival)
      );
      const summary = buildSummary(notifications);

      return {
        success: true,
        data: {
          notifications,
          summary,
        },
      };
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("ArrivalController.getNotifications failed", err);

      if (err.message === "DB_CONNECTION_FAILURE") {
        return {
          success: false,
          status: 500,
          error: "DB_CONNECTION_FAILURE",
        };
      }

      return {
        success: false,
        status: 500,
        error: err.message || "Failed to get arrival notifications",
      };
    }
  }
}

function buildArrivalNotification(
  arrival: PortalArrivalRecord,
): ArrivalNotificationWithMeta {
  const input: ArrivalNotificationInput = arrival.name === null
    ? { phone_number: arrival.phone_number }
    : { phone_number: arrival.phone_number, name: arrival.name };
  const notification = ArrivalService.buildNotification(input);

  return {
    ...notification,
    clientId: arrival.clientId,
    loginId: arrival.loginId,
    arrivedAt: arrival.arrivedAt,
  };
}

function buildSummary(
  notifications: ArrivalNotificationWithMeta[],
): ArrivalNotificationsSummary {
  const total = notifications.length;
  const named = notifications.filter((notification) => (
    notification.name.trim().length > 0
  )).length;

  return {
    total,
    named,
    anonymous: total - named,
    generatedAt: new Date().toISOString(),
    latestArrivalAt: notifications[0]?.arrivedAt ?? null,
  };
}
