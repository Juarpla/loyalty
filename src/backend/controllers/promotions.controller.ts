import { ClientModel } from "../models/client.model";
import { AIService } from "../services/ai.service";
import { logger } from "../utils/logger.utils";
import type { GeminiRecoveryPromptResult } from "../types/models.type";

export class PromotionsController {
  static async generate() {
    logger.info("PromotionsController.generate started");

    try {
      const { segments } = await ClientModel.getCustomerSegments();
      const inactiveCustomers = segments.filter((s) => s.segment === "inactive_30d");

      if (inactiveCustomers.length === 0) {
        return { success: true, data: { campaigns: [] as GeminiRecoveryPromptResult[] } };
      }

      try {
        const prompts = await AIService.generateRecoveryPrompts(inactiveCustomers);
        return { success: true, data: { campaigns: prompts } };
      } catch (error: unknown) {
        const err = error as Error;
        logger.error("PromotionsController.generate AIService failed", err);

        const FALLBACK_DISCOUNT = "¡Te extrañamos! Visítanos y obtén un 15% de descuento en tu próxima compra.";
        const fallbackCampaigns: GeminiRecoveryPromptResult[] = inactiveCustomers.map((c) => ({
          phone_number: c.phone_number,
          recoveryCopy: FALLBACK_DISCOUNT,
          generatedAt: new Date().toISOString(),
        }));

        return { success: true, data: { campaigns: fallbackCampaigns } };
      }
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("PromotionsController.generate failed", err);

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
        error: err.message || "Failed to generate campaigns"
      };
    }
  }

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
