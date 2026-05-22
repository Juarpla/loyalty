import { SalesModel } from "../models/sales.model";
import { TrafficService } from "../services/traffic.service";
import { logger } from "../utils/logger.utils";
import { TransactionRecord } from "../types/models.type";

/**
 * Decoupled Traffic Metrics HTTP Logic Controller
 * Totally independent of framework-specific HTTP request/response objects.
 */
export class TrafficController {
  /**
   * Compiles traffic distribution metrics from all transaction records.
   * Fetches all transactions, computes distribution via TrafficService, and returns formatted result.
   */
  static async getMetrics() {
    logger.info("TrafficController.getMetrics started");

    try {
      // R1: Fetch all transaction records from database model layer
      const transactions: TransactionRecord[] = await SalesModel.getAllTransactions();

      // R2: Invoke TrafficService.computeDistribution with fetched transactions
      const distribution = TrafficService.computeDistribution(transactions);

      // R3: Return success payload with distribution object
      return {
        success: true,
        data: distribution
      };
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("TrafficController.getMetrics failed", err);

      // R4: DB connection failure
      if (err.message === "DB_CONNECTION_FAILURE") {
        return {
          success: false,
          status: 500,
          error: "DB_CONNECTION_FAILURE"
        };
      }

      // R5: Any other exception
      return {
        success: false,
        status: 500,
        error: err.message || "Failed to compile traffic metrics"
      };
    }
  }

  /**
   * Alias for getMetrics — kept for backward compatibility with existing API routes.
   */
  static async getTrafficOverview() {
    return TrafficController.getMetrics();
  }
}