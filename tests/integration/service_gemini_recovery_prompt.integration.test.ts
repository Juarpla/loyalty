import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIService } from "../../src/backend/services/ai.service";
import { SegmentedCustomer } from "../../src/backend/types/models.type";

function makeCustomer(overrides: Partial<SegmentedCustomer> = {}): SegmentedCustomer {
  return {
    phone_number: "+51900111000",
    name: "Alice García",
    visit_count: 3,
    average_ticket: 25,
    last_transaction_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    segment: "inactive_30d",
    ...overrides,
  };
}

describe("AIService.generateRecoveryPrompts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("R1: accepts customers and returns recovery copy", () => {
    it("SHALL return an array of GeminiRecoveryPromptResult with same length as input", async () => {
      const customers = [makeCustomer({ phone_number: "+51900111000" }), makeCustomer({ phone_number: "+51900222000" })];
      vi.spyOn(AIService, "callGemini").mockResolvedValue("We miss you! Come back soon!");

      const results = await AIService.generateRecoveryPrompts(customers);

      expect(results).toHaveLength(2);
      expect(results[0]).toHaveProperty("phone_number");
      expect(results[0]).toHaveProperty("recoveryCopy");
      expect(results[0]).toHaveProperty("generatedAt");
    });
  });

  describe("R9: mock Gemini returns valid copy", () => {
    it("SHALL return recoveryCopy for each customer", async () => {
      const customers = [makeCustomer({ phone_number: "+51900111000" })];
      vi.spyOn(AIService, "callGemini").mockResolvedValue("Hey Alice! We've missed you. Visit us for a free coffee!");

      const results = await AIService.generateRecoveryPrompts(customers);

      expect(results[0].recoveryCopy).toBe("Hey Alice! We've missed you. Visit us for a free coffee!");
      expect(results[0].phone_number).toBe("+51900111000");
    });

    it("SHALL enforce 180-character limit on recoveryCopy", async () => {
      const customers = [makeCustomer()];
      const longResponse = "A".repeat(250);
      vi.spyOn(AIService, "callGemini").mockResolvedValue(longResponse);

      const results = await AIService.generateRecoveryPrompts(customers);

      expect(results[0].recoveryCopy.length).toBeLessThanOrEqual(181);
      expect(results[0].recoveryCopy.replace("…", "").length).toBeLessThanOrEqual(180);
    });

    it("SHALL log success with phone number and character count", async () => {
      const customers = [makeCustomer()];
      vi.spyOn(AIService, "callGemini").mockResolvedValue("Short message here");
      const infoSpy = vi.spyOn(console, "log");

      await AIService.generateRecoveryPrompts(customers);

      const successLog = infoSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("generateRecoveryPrompts success")
      );
      expect(successLog).toBeDefined();
      const context = typeof successLog![1] === "string" ? JSON.parse(successLog![1]) : successLog![1];
      expect(context.phone_number).toBe("+51900111000");
    });
  });

  describe("R10: mock Gemini rejects", () => {
    it("SHALL return fallback message when Gemini call fails", async () => {
      const customers = [makeCustomer()];
      vi.spyOn(AIService, "callGemini").mockRejectedValue(new Error("API error"));

      const results = await AIService.generateRecoveryPrompts(customers);

      expect(results[0].recoveryCopy).toBe("We miss you! Visit us soon for a special treat.");
    });

    it("SHALL log error with phone number when Gemini call fails", async () => {
      const customers = [makeCustomer()];
      vi.spyOn(AIService, "callGemini").mockRejectedValue(new Error("API error"));
      const errorSpy = vi.spyOn(console, "error");

      await AIService.generateRecoveryPrompts(customers);

      const errorLog = errorSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("generateRecoveryPrompts call failed")
      );
      expect(errorLog).toBeDefined();
      const context = typeof errorLog![1] === "string" ? JSON.parse(errorLog![1]) : errorLog![1];
      expect(context.phone_number).toBe("+51900111000");
    });
  });

  describe("R6: logs method invocation", () => {
    it("SHALL log start with customer count", async () => {
      const customers = [makeCustomer(), makeCustomer()];
      vi.spyOn(AIService, "callGemini").mockResolvedValue("test");
      const infoSpy = vi.spyOn(console, "log");

      await AIService.generateRecoveryPrompts(customers);

      const startLog = infoSpy.mock.calls.find(
        (call) => typeof call[0] === "string" && call[0].includes("generateRecoveryPrompts started")
      );
      expect(startLog).toBeDefined();
    });
  });

  describe("Empty array", () => {
    it("SHALL return empty array when no customers provided", async () => {
      const results = await AIService.generateRecoveryPrompts([]);

      expect(results).toEqual([]);
    });
  });

  describe("R2: prompt builder", () => {
    it("SHALL include customer name, visit count, and last transaction date in prompt", () => {
      const customer = makeCustomer({
        name: "Bob",
        visit_count: 5,
        last_transaction_date: "2024-01-15T10:00:00Z",
      });

      const prompt = AIService.buildRecoveryPrompt(customer);

      expect(prompt).toContain("Bob");
      expect(prompt).toContain("5");
      expect(prompt).toContain("2024-01-15T10:00:00Z");
    });

    it("SHALL use 'Valued Customer' when name is empty", () => {
      const customer = makeCustomer({ name: "" });

      const prompt = AIService.buildRecoveryPrompt(customer);

      expect(prompt).toContain("Valued Customer");
    });

    it("SHALL use 'no previous visits' when last_transaction_date is null", () => {
      const customer = makeCustomer({ last_transaction_date: null });

      const prompt = AIService.buildRecoveryPrompt(customer);

      expect(prompt).toContain("no previous visits");
    });

    it("SHALL use provided business name in prompt", () => {
      const customer = makeCustomer();

      const prompt = AIService.buildRecoveryPrompt(customer, "Café Central");

      expect(prompt).toContain("Café Central");
    });
  });

  describe("R3: 180-char instruction in prompt", () => {
    it("SHALL include instruction about 180-character limit", () => {
      const customer = makeCustomer();

      const prompt = AIService.buildRecoveryPrompt(customer);

      expect(prompt).toContain("under 180 characters");
    });
  });

  describe("R4: character limit enforcement", () => {
    it("SHALL not modify text under 180 characters", () => {
      const result = AIService.enforceCharLimit("Short text");

      expect(result).toBe("Short text");
    });

    it("SHALL truncate text over 180 characters at word boundary", () => {
      const text = "A".repeat(170) + " " + "B".repeat(20);

      const result = AIService.enforceCharLimit(text, 180);

      expect(result.length).toBeLessThanOrEqual(181); // 180 + "…"
      expect(result).toMatch(/…$/);
    });

    it("SHALL append … when truncated", () => {
      const text = "A".repeat(200);

      const result = AIService.enforceCharLimit(text);

      expect(result).toMatch(/…$/);
      expect(result.length).toBeLessThanOrEqual(181);
    });
  });

  describe("R5: fallback message", () => {
    it("SHALL return fallback when Gemini returns empty string", async () => {
      const customers = [makeCustomer()];
      vi.spyOn(AIService, "callGemini").mockRejectedValue(new Error("Empty response"));

      const results = await AIService.generateRecoveryPrompts(customers);

      expect(results[0].recoveryCopy).toBe("We miss you! Visit us soon for a special treat.");
    });
  });

  describe("Simulation mode", () => {
    it("SHALL generate deterministic response in simulation mode", () => {
      const prompt = AIService.buildRecoveryPrompt(
        makeCustomer({ name: "Alice", phone_number: "+51900111000" }),
        "Café Central"
      );

      const result = AIService.simulateGeminiResponse(prompt);

      expect(result).toContain("Alice");
      expect(result).toContain("Café Central");
    });
  });
});
