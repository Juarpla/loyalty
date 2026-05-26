import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";
import { AIService } from "../../src/backend/services/ai.service";
import { SocialController } from "../../src/backend/controllers/social.controller";
import type { SocialIdea } from "../../src/backend/types/models.type";

beforeAll(() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockIdeas: SocialIdea[] = [
  {
    title: "Summer Sale",
    body: "Come get our summer deals!",
    visualPrompt: "A sunny storefront",
    hashtags: ["#summer", "#sale"],
  },
  {
    title: "New Arrivals",
    body: "Check out what's new this week.",
    visualPrompt: "New products on display",
    hashtags: ["#new", "#arrivals"],
  },
];

describe("controller_social_ideas Integration Tests", () => {
  describe("R1, R2: Input validation", () => {
    it("R1, R2: should return 400 when context is null", async () => {
      const res = await SocialController.handleSocialIdeas(null as unknown as string);

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Context must be at least 3 characters long");
    });

    it("R1, R2: should return 400 when context is empty string", async () => {
      const res = await SocialController.handleSocialIdeas("");

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Context must be at least 3 characters long");
    });

    it("R1, R2: should return 400 when context is shorter than 3 characters", async () => {
      const res = await SocialController.handleSocialIdeas("ab");

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Context must be at least 3 characters long");
    });
  });

  describe("R3: successful generation", () => {
    it("R3: should return 200 with ideas when context is valid", async () => {
      vi.spyOn(AIService, "generateSocialPostSuggestions").mockResolvedValue(mockIdeas);

      const res = await SocialController.handleSocialIdeas("coffee shop promotion");

      expect(res).toBeDefined();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data!.ideas).toHaveLength(2);
      expect(res.data!.ideas[0].title).toBe("Summer Sale");
      expect(res.data!.ideas[0].hashtags).toEqual(["#summer", "#sale"]);
    });

    it("R5: should accept a valid context string of 3+ characters", async () => {
      vi.spyOn(AIService, "generateSocialPostSuggestions").mockResolvedValue(mockIdeas);

      const res = await SocialController.handleSocialIdeas("cafe");

      expect(res).toBeDefined();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data!.ideas).toHaveLength(2);
    });
  });
});
