import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIService } from "../../src/backend/services/ai.service";

beforeEach(() => {
  vi.restoreAllMocks();
});

const validJsonResponse = JSON.stringify([
  {
    title: "Summer Sale Extravaganza",
    body: "Come visit us for amazing summer deals on all our products! Don't miss out on these limited-time offers available only this weekend.",
    visualPrompt: "Sunny storefront with colorful summer decorations and sale signs",
    hashtags: ["#summerSale", "#shoplocal", "#deals"],
  },
  {
    title: "New Collection Launch",
    body: "We just launched our newest collection. Be the first to check it out and enjoy exclusive launch discounts.",
    visualPrompt: "Elegant display of new products with soft lighting",
    hashtags: ["#newCollection", "#exclusive", "#launch", "#musthave"],
  },
]);

const overLimitResponse = JSON.stringify([
  {
    title: "A".repeat(100),
    body: "B".repeat(350),
    visualPrompt: "C".repeat(250),
    hashtags: ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"],
  },
]);

const missingFieldsResponse = JSON.stringify([
  {
    title: "Valid Title",
    body: "",
    visualPrompt: null,
    hashtags: [],
  },
  {
    title: "Second Post",
    body: "Has valid body",
    visualPrompt: "Has valid prompt",
    hashtags: ["#test"],
  },
]);

const partialMissingResponse = JSON.stringify([
  {},
  {
    title: "Only Title",
    body: "Some body text",
    visualPrompt: "Some visual prompt",
    hashtags: ["#tag"],
  },
]);

const moreThanThreeResponse = JSON.stringify([
  { title: "Post 1", body: "Body 1", visualPrompt: "Visual 1", hashtags: ["#a"] },
  { title: "Post 2", body: "Body 2", visualPrompt: "Visual 2", hashtags: ["#b"] },
  { title: "Post 3", body: "Body 3", visualPrompt: "Visual 3", hashtags: ["#c"] },
  { title: "Post 4", body: "Body 4", visualPrompt: "Visual 4", hashtags: ["#d"] },
  { title: "Post 5", body: "Body 5", visualPrompt: "Visual 5", hashtags: ["#e"] },
]);

describe("AIService.generateSocialPostSuggestions", () => {
  describe("R3, R12: Valid Gemini JSON response", () => {
    it("R3: SHALL return correctly shaped SocialIdea[] when Gemini returns valid JSON", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue(validJsonResponse);

      const ideas = await AIService.generateSocialPostSuggestions("coffee shop promotion");

      expect(Array.isArray(ideas)).toBe(true);
      expect(ideas).toHaveLength(2);
      expect(ideas[0]).toHaveProperty("title");
      expect(ideas[0]).toHaveProperty("body");
      expect(ideas[0]).toHaveProperty("visualPrompt");
      expect(ideas[0]).toHaveProperty("hashtags");
      expect(typeof ideas[0].title).toBe("string");
      expect(typeof ideas[0].body).toBe("string");
      expect(typeof ideas[0].visualPrompt).toBe("string");
      expect(Array.isArray(ideas[0].hashtags)).toBe(true);
      expect(ideas[0].title).toBe("Summer Sale Extravaganza");
      expect(ideas[0].hashtags).toEqual(["#summerSale", "#shoplocal", "#deals"]);
    });
  });

  describe("R3: Response with more than 3 items", () => {
    it("R3: SHALL return only first 3 items when Gemini returns more than 3", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue(moreThanThreeResponse);

      const ideas = await AIService.generateSocialPostSuggestions("test context");

      expect(ideas).toHaveLength(3);
      expect(ideas[0].title).toBe("Post 1");
      expect(ideas[2].title).toBe("Post 3");
    });
  });

  describe("R6, R12: Malformed JSON fallback", () => {
    it("R6: SHALL return simulated SocialIdea[] when Gemini returns malformed JSON", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue("not valid json at all");

      const ideas = await AIService.generateSocialPostSuggestions("pizza shop");

      expect(Array.isArray(ideas)).toBe(true);
      expect(ideas).toHaveLength(3);
      expect(ideas[0].title).toContain("pizza shop");
      expect(ideas[0].hashtags).toContain("#localbusiness");
    });

    it("R6: SHALL log warning on malformed JSON", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue("{{broken json");
      const warnSpy = vi.spyOn(console, "warn");

      await AIService.generateSocialPostSuggestions("test");

      const warnLog = warnSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("malformed JSON response"),
      );
      expect(warnLog).toBeDefined();
    });

    it("R6: SHALL return simulated response when Gemini returns empty string", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue("");

      const ideas = await AIService.generateSocialPostSuggestions("bakery");

      expect(Array.isArray(ideas)).toBe(true);
      expect(ideas).toHaveLength(3);
    });
  });

  describe("R7, R12: Gemini API error fallback", () => {
    it("R7: SHALL return simulated SocialIdea[] when Gemini throws", async () => {
      vi.spyOn(AIService, "callGemini").mockRejectedValue(new Error("Network timeout"));

      const ideas = await AIService.generateSocialPostSuggestions("bookstore");

      expect(ideas).toHaveLength(3);
      expect(ideas[0].title).toContain("bookstore");
    });

    it("R7: SHALL log error when Gemini call fails", async () => {
      vi.spyOn(AIService, "callGemini").mockRejectedValue(new Error("API error 503"));
      const errorSpy = vi.spyOn(console, "error");

      await AIService.generateSocialPostSuggestions("test");

      const errorLog = errorSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("Gemini call failed"),
      );
      expect(errorLog).toBeDefined();
    });
  });

  describe("R4, R12: Missing fields filled with defaults", () => {
    it("R4: SHALL fill missing body and visualPrompt with defaults", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue(missingFieldsResponse);

      const ideas = await AIService.generateSocialPostSuggestions("test context");

      expect(ideas).toHaveLength(2);
      expect(ideas[0].title).toBe("Valid Title");
      expect(ideas[0].body).toBe("Check out what\u2019s happening at our store!");
      expect(ideas[0].visualPrompt).toBe("A photo of our team at work");
      expect(ideas[0].hashtags).toEqual(["#localbusiness", "#shoplocal"]);
    });

    it("R4: SHALL fill completely empty object with all defaults", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue(partialMissingResponse);

      const ideas = await AIService.generateSocialPostSuggestions("test");

      expect(ideas).toHaveLength(2);
      expect(ideas[0].title).toBe("New Post");
      expect(ideas[0].body).toBe("Check out what\u2019s happening at our store!");
      expect(ideas[0].visualPrompt).toBe("A photo of our team at work");
      expect(ideas[0].hashtags).toEqual(["#localbusiness", "#shoplocal"]);
    });
  });

  describe("R5, R12: Character limit enforcement", () => {
    it("R5: SHALL truncate over-limit fields at word boundary", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue(overLimitResponse);

      const ideas = await AIService.generateSocialPostSuggestions("test");

      expect(ideas).toHaveLength(1);
      expect(ideas[0].title.length).toBeLessThanOrEqual(81);
      expect(ideas[0].body.length).toBeLessThanOrEqual(281);
      expect(ideas[0].visualPrompt.length).toBeLessThanOrEqual(201);
      expect(ideas[0].hashtags.length).toBeLessThanOrEqual(5);
      ideas[0].hashtags.forEach((tag) => {
        expect(tag.length).toBeLessThanOrEqual(30);
      });
    });
  });

  describe("R8, R12: Empty prompt handling", () => {
    it("R8: SHALL return single default idea when prompt is empty string", async () => {
      const ideas = await AIService.generateSocialPostSuggestions("");

      expect(ideas).toHaveLength(1);
      expect(ideas[0].body).toBe("Share what makes your business special today!");
    });

    it("R8: SHALL return single default idea when prompt is whitespace", async () => {
      const ideas = await AIService.generateSocialPostSuggestions("   ");

      expect(ideas).toHaveLength(1);
      expect(ideas[0].body).toBe("Share what makes your business special today!");
    });

    it("R8: SHALL log warning on empty prompt", async () => {
      const warnSpy = vi.spyOn(console, "warn");

      await AIService.generateSocialPostSuggestions("");

      const warnLog = warnSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("empty prompt"),
      );
      expect(warnLog).toBeDefined();
    });
  });

  describe("R9: Logs method invocation", () => {
    it("R9: SHALL log at start with prompt length and preview", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue(validJsonResponse);
      const infoSpy = vi.spyOn(console, "log");

      await AIService.generateSocialPostSuggestions("test promotion");

      const startLog = infoSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("generateSocialPostSuggestions started"),
      );
      expect(startLog).toBeDefined();
      expect(startLog![1]).toContain("test promotion");
    });
  });

  describe("R10: Logs success", () => {
    it("R10: SHALL log count of returned ideas on success", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue(validJsonResponse);
      const infoSpy = vi.spyOn(console, "log");

      await AIService.generateSocialPostSuggestions("test promotion");

      const successLog = infoSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("generateSocialPostSuggestions success"),
      );
      expect(successLog).toBeDefined();
    });
  });

  describe("R11: Logs per-response failure", () => {
    it("R11: SHALL log warning when JSON parse fails", async () => {
      vi.spyOn(AIService, "callGemini").mockResolvedValue("not json");
      const warnSpy = vi.spyOn(console, "warn");

      await AIService.generateSocialPostSuggestions("test");

      const warnLog = warnSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("malformed JSON"),
      );
      expect(warnLog).toBeDefined();
    });
  });

  describe("ValidateSocialIdea: word-boundary truncation", () => {
    it("SHALL preserve text under the limit", () => {
      const result = AIService.truncateAtWordBoundary("Short text", 80);
      expect(result).toBe("Short text");
    });

    it("SHALL truncate at word boundary when over limit", () => {
      const text = "A ".repeat(50) + "B".repeat(20);
      const result = AIService.truncateAtWordBoundary(text, 80);
      expect(result.length).toBeLessThanOrEqual(81);
      expect(result).toMatch(/\u2026$/);
    });
  });
});
