import { logger } from "../utils/logger.utils";
import {
  AIAnalysisReport,
  SegmentedCustomer,
  GeminiRecoveryPromptResult,
  SocialIdea,
  SOCIAL_POST_LIMITS,
} from "../types/models.type";

/**
 * Isolated AI Integration Service (Gemini API / LLMs)
 */
export class AIService {
  /**
   * Generates actionable optimization insights based on traffic count or customer behavior
   */
  static async analyzeTrafficFlow(trafficCount: number, wifiConns: number): Promise<AIAnalysisReport> {
    logger.info("AIService.analyzeTrafficFlow invoked", { trafficCount, wifiConns });
    
    // Simulate complex AI processing or call to Gemini API
    await new Promise((resolve) => setTimeout(resolve, 150));

    const efficiency = trafficCount > 0 ? Math.round((wifiConns / trafficCount) * 100) : 0;

    return {
      id: `rep-${Math.random().toString(36).substr(2, 9)}`,
      generatedAt: new Date().toISOString(),
      reportDate: new Date().toLocaleDateString(),
      summary: `Analyzed traffic of ${trafficCount} visits with ${wifiConns} successful Wi-Fi connections (${efficiency}% rate).`,
      insights: [
        `Conversion rate is currently at ${efficiency}%.`,
        wifiConns < trafficCount * 0.5 
          ? "Significant conversion drop detected. Wi-Fi portal is underperforming relative to walk-in traffic."
          : "Healthy engagement. Customer interaction with Wi-Fi gate is above targets."
      ],
      recommendations: [
        "Incentivize captive portal usage by offering instant loyalty points on dashboard signup.",
        "Ensure QR codes are placed visibly near checkout and customer lounges."
      ]
    };
  }

  static async generateRecoveryPrompts(
    customers: SegmentedCustomer[],
    options?: { businessName?: string }
  ): Promise<GeminiRecoveryPromptResult[]> {
    logger.info("generateRecoveryPrompts started", { count: customers.length });

    const results: GeminiRecoveryPromptResult[] = [];

    for (const customer of customers) {
      const prompt = AIService.buildRecoveryPrompt(customer, options?.businessName);

      try {
        const rawCopy = await AIService.callGemini(prompt);
        const recoveryCopy = AIService.enforceCharLimit(rawCopy);

        logger.info("generateRecoveryPrompts success", {
          phone_number: customer.phone_number,
          charCount: recoveryCopy.length,
        });

        results.push({
          phone_number: customer.phone_number,
          recoveryCopy,
          generatedAt: new Date().toISOString(),
        });
      } catch (err) {
        logger.error("generateRecoveryPrompts call failed", {
          phone_number: customer.phone_number,
          error: err instanceof Error ? err.message : String(err),
        });

        results.push({
          phone_number: customer.phone_number,
          recoveryCopy: "We miss you! Visit us soon for a special treat.",
          generatedAt: new Date().toISOString(),
        });
      }
    }

    return results;
  }

  static async generateSocialIdeas(context: string): Promise<SocialIdea[]> {
    logger.info("AIService.generateSocialIdeas invoked", { context });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const prompt = `Generate 3 social media post ideas for a local business. Context: ${context}. Return as JSON array with title, body, visualPrompt, and hashtags fields.`;
    const raw = await AIService.callGemini(prompt);

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, 3) as SocialIdea[];
    } catch {
      // fall through to simulated response
    }

    return [
      {
        title: `New Post: ${context}`,
        body: `Check out what's happening at our store! ${context}`,
        visualPrompt: "A photo of our team working on " + context,
        hashtags: ["#localbusiness", "#community", "#shoplocal"],
      },
      {
        title: "Behind the Scenes",
        body: "Get a sneak peek behind the scenes of what makes our business special.",
        visualPrompt: "Behind-the-scenes photo of the team preparing for the day",
        hashtags: ["#behindthescenes", "#smallbusiness", "#familyowned"],
      },
      {
        title: "Customer Spotlight",
        body: "We love our customers! Thanks for being part of our journey.",
        visualPrompt: "Happy customer holding a product with a smile",
        hashtags: ["#customerlove", "#thankyou", "#communityfirst"],
      },
    ];
  }

  static truncateAtWordBoundary(text: string, maxLength: number): string {
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) return trimmed;
    const truncated = trimmed.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace <= 0) return truncated.slice(0, maxLength - 1) + "\u2026";
    return truncated.slice(0, lastSpace) + "\u2026";
  }

  static validateSocialIdea(item: unknown): SocialIdea {
    const obj = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

    const title =
      typeof obj.title === "string" && obj.title.trim()
        ? obj.title.trim()
        : "New Post";

    const body =
      typeof obj.body === "string" && obj.body.trim()
        ? obj.body.trim()
        : "Check out what\u2019s happening at our store!";

    const visualPrompt =
      typeof obj.visualPrompt === "string" && obj.visualPrompt.trim()
        ? obj.visualPrompt.trim()
        : "A photo of our team at work";

    let hashtags: string[];
    if (Array.isArray(obj.hashtags) && obj.hashtags.length > 0) {
      hashtags = obj.hashtags
        .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        .slice(0, SOCIAL_POST_LIMITS.HASHTAGS_MAX)
        .map((t) => AIService.truncateAtWordBoundary(t.trim(), SOCIAL_POST_LIMITS.HASHTAG_MAX_LENGTH));
    } else {
      hashtags = ["#localbusiness", "#shoplocal"];
    }

    return {
      title: AIService.truncateAtWordBoundary(title, SOCIAL_POST_LIMITS.TITLE_MAX),
      body: AIService.truncateAtWordBoundary(body, SOCIAL_POST_LIMITS.BODY_MAX),
      visualPrompt: AIService.truncateAtWordBoundary(visualPrompt, SOCIAL_POST_LIMITS.VISUAL_PROMPT_MAX),
      hashtags,
    };
  }

  static simulateSocialPostFallback(prompt: string): SocialIdea[] {
    const context =
      prompt.length > 60 ? prompt.slice(0, 60) + "..." : prompt;
    return [
      {
        title: `New Post: ${context}`,
        body: `Check out what\u2019s happening at our store! ${context}`,
        visualPrompt: "A photo of our team working on " + context,
        hashtags: ["#localbusiness", "#community", "#shoplocal"],
      },
      {
        title: "Behind the Scenes",
        body: "Get a sneak peek behind the scenes of what makes our business special.",
        visualPrompt: "Behind-the-scenes photo of the team preparing for the day",
        hashtags: ["#behindthescenes", "#smallbusiness", "#familyowned"],
      },
      {
        title: "Customer Spotlight",
        body: "We love our customers! Thanks for being part of our journey.",
        visualPrompt: "Happy customer holding a product with a smile",
        hashtags: ["#customerlove", "#thankyou", "#communityfirst"],
      },
    ];
  }

  static async generateSocialPostSuggestions(
    prompt: string,
  ): Promise<SocialIdea[]> {
    if (!prompt || !prompt.trim()) {
      logger.warn("generateSocialPostSuggestions: empty prompt");
      return [
        {
          title: "New Post",
          body: "Share what makes your business special today!",
          visualPrompt: "A photo of our team at work",
          hashtags: ["#localbusiness", "#shoplocal"],
        },
      ];
    }

    const promptPreview =
      prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt;
    logger.info("generateSocialPostSuggestions started", {
      promptLength: prompt.length,
      preview: promptPreview,
    });

    const fullPrompt = [
      "You are a social media copywriter for a local business.",
      `Generate up to ${SOCIAL_POST_LIMITS.MAX_IDEAS} social media post ideas.`,
      "",
      "For each idea, respond with a JSON object containing these fields:",
      `- "title": string (max ${SOCIAL_POST_LIMITS.TITLE_MAX} characters, attention-grabbing headline)`,
      `- "body": string (max ${SOCIAL_POST_LIMITS.BODY_MAX} characters, the post body text)`,
      `- "visualPrompt": string (max ${SOCIAL_POST_LIMITS.VISUAL_PROMPT_MAX} characters, description of an image to accompany the post)`,
      `- "hashtags": string[] (max ${SOCIAL_POST_LIMITS.HASHTAGS_MAX} tags, each max ${SOCIAL_POST_LIMITS.HASHTAG_MAX_LENGTH} characters)`,
      "",
      "Respond ONLY with a JSON array of objects. No markdown, no code fences, no additional text.",
      "",
      "Business context:",
      prompt,
    ].join("\n");

    let raw: string;
    try {
      raw = await AIService.callGemini(fullPrompt);
    } catch (err) {
      logger.error("generateSocialPostSuggestions: Gemini call failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      return AIService.simulateSocialPostFallback(prompt);
    }

    if (!raw || !raw.trim()) {
      logger.warn("generateSocialPostSuggestions: empty Gemini response");
      return AIService.simulateSocialPostFallback(prompt);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      logger.warn(
        "generateSocialPostSuggestions: malformed JSON response",
      );
      return AIService.simulateSocialPostFallback(prompt);
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      logger.warn(
        "generateSocialPostSuggestions: response is not an array or is empty",
      );
      return AIService.simulateSocialPostFallback(prompt);
    }

    const items = parsed.slice(0, SOCIAL_POST_LIMITS.MAX_IDEAS);
    const ideas: SocialIdea[] = items.map((item: unknown) =>
      AIService.validateSocialIdea(item),
    );

    logger.info("generateSocialPostSuggestions success", {
      count: ideas.length,
    });

    return ideas;
  }

  static buildRecoveryPrompt(customer: SegmentedCustomer, businessName?: string): string {
    const name = customer.name || "Valued Customer";
    const lastVisit = customer.last_transaction_date || "no previous visits";
    const business = businessName || "our store";

    return [
      "You are a customer recovery copywriter for a local business.",
      "Write a short, friendly message to re-engage the customer.",
      "",
      `Customer name: ${name}`,
      `Visit count: ${customer.visit_count}`,
      `Last visit: ${lastVisit}`,
      `Business name: ${business}`,
      "",
      "The message must be warm, personalized, and under 180 characters.",
      "Respond with only the message text, no additional formatting.",
    ].join("\n");
  }

  static async callGemini(prompt: string): Promise<string> {
    if (process.env.GEMINI_API_KEY) {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      if (!response.ok) throw new Error("Gemini API error: " + response.status);
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini returned empty response");
      return text;
    }

    return AIService.simulateGeminiResponse(prompt);
  }

  static simulateGeminiResponse(prompt: string): string {
    const nameMatch = prompt.match(/Customer name: (.+)/);
    const name = nameMatch ? nameMatch[1] : "Valued Customer";
    const businessMatch = prompt.match(/Business name: (.+)/);
    const business = businessMatch ? businessMatch[1] : "our store";

    return `Hey ${name}! We've missed you at ${business}. Stop by today for a special welcome-back treat on us!`;
  }

  static enforceCharLimit(text: string, limit = 180): string {
    const trimmed = text.trim();
    if (trimmed.length <= limit) return trimmed;

    const truncated = trimmed.slice(0, limit);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace === -1) return truncated + "…";
    return truncated.slice(0, lastSpace) + "…";
  }
}
