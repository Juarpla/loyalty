import { ClientModel } from "../models/client.model";
import { logger } from "../utils/logger.utils";

/**
 * Decoupled Traffic HTTP Logic Controller
 * Totally independent of framework-specific HTTP objects.
 */
export class TrafficController {
  /**
   * Retrieves traffic logs and summary analytics
   */
  static async getTrafficOverview() {
    logger.info("TrafficController.getTrafficOverview started");
    try {
      const history = await ClientModel.getTrafficHistory();
      
      const totalCount = history.length;
      const wifiConnections = history.filter(h => h.connectedToWifi).length;

      return {
        success: true,
        summary: {
          totalVisits: totalCount,
          wifiConnections,
          conversionRate: totalCount > 0 ? Math.round((wifiConnections / totalCount) * 100) : 0
        },
        records: history
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to retrieve traffic overview stats";
      logger.error("TrafficController.getTrafficOverview failed", error);
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}
