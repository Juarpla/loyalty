import { AIService } from "../services/ai.service";
import { ClientModel } from "../models/client.model";
import { logger } from "../utils/logger.utils";

/**
 * Decoupled AI Operations HTTP Logic Controller
 * Integrates database metrics and LLM generation.
 */
export class AIController {
  /**
   * Generates cognitive business insights using Gemini LLMs
   */
  static async generateInsights() {
    logger.info("AIController.generateInsights started");
    try {
      // Gather raw metric values from our models
      const history = await ClientModel.getTrafficHistory();
      const totalVisits = history.length;
      const wifiConns = history.filter(h => h.connectedToWifi).length;

      // Invoke Pure Business logic service
      const aiReport = await AIService.analyzeTrafficFlow(totalVisits, wifiConns);

      return {
        success: true,
        report: aiReport
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to trigger AI insight pipelines";
      logger.error("AIController.generateInsights failed", error);
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}
