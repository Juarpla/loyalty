import { ClientModel } from "../models/client.model";
import { logger } from "../utils/logger.utils";

export class PromotionsController {
  static async getSegments() {
    logger.info("PromotionsController.getSegments started");

    try {
      const data = await ClientModel.getCustomerSegments();

      return {
        success: true,
        data
      };
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("PromotionsController.getSegments failed", err);

      if (err.message === "DB_CONNECTION_FAILURE") {
        return {
          success: false,
          status: 500,
          error: "DB_CONNECTION_FAILURE"
        };
      }

      return {
        success: false,
        status: 500,
        error: err.message || "Failed to get customer segments"
      };
    }
  }
}
