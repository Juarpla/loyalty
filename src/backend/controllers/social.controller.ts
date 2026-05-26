import { AIService } from "../services/ai.service";
import { logger } from "../utils/logger.utils";
import { decorate } from "../services/social-prompt.decorator";
import type { TransactionRecord } from "../types/models.type";

export class SocialController {
  static async handleSocialIdeas(context: string, transactions: TransactionRecord[] = []) {
    logger.info("SocialController.handleSocialIdeas started", { context });

    if (!context || context.length < 3) {
      return {
        success: false,
        status: 400,
        error: "Context must be at least 3 characters long",
      };
    }

    const basePrompt = `Generate social media posts for: ${context}`;
    const decoratedPrompt = decorate(basePrompt, transactions);

    const ideas = await AIService.generateSocialPostSuggestions(decoratedPrompt);

    return {
      success: true,
      data: { ideas },
    };
  }
}
