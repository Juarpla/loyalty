import { logger } from "../utils/logger.utils";
import { AIAnalysisReport, SegmentedCustomer, GeminiRecoveryPromptResult } from "../types/models.type";

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
