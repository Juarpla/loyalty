import { AIService } from "../services/ai.service";
import { logger } from "../utils/logger.utils";

export class SocialController {
  static async handleSocialIdeas(context: string) {
    logger.info("SocialController.handleSocialIdeas started", { context });

    if (!context || context.length < 3) {
      return {
        success: false,
        status: 400,
        error: "Context must be at least 3 characters long",
      };
    }

    try {
      const ideas = await AIService.generateSocialIdeas(context);

      return {
        success: true,
        data: { ideas },
      };
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("SocialController.handleSocialIdeas failed", err);

      return {
        success: false,
        status: 500,
        error: "Internal server error",
      };
    }
  }
}
