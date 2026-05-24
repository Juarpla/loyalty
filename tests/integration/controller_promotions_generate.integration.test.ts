import { describe, it, expect, beforeAll, vi } from "vitest";
import { ClientModel } from "../../src/backend/models/client.model";
import { AIService } from "../../src/backend/services/ai.service";
import { PromotionsController } from "../../src/backend/controllers/promotions.controller";
import { logger } from "../../src/backend/utils/logger.utils";
import type { CustomerSegmentationResult, GeminiRecoveryPromptResult, SegmentedCustomer } from "../../src/backend/types/models.type";

beforeAll(() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
  }
});

const createInactiveCustomer = (phone: string, name: string): SegmentedCustomer => ({
  phone_number: phone,
  name,
  visit_count: 3,
  average_ticket: 25,
  last_transaction_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  segment: "inactive_30d",
});

const createActiveCustomer = (phone: string, name: string): SegmentedCustomer => ({
  phone_number: phone,
  name,
  visit_count: 8,
  average_ticket: 60,
  last_transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  segment: "frequent",
});

const mockSegmentationResult = (customers: SegmentedCustomer[]): CustomerSegmentationResult => ({
  segments: customers,
  summary: { inactive_30d: customers.filter((c) => c.segment === "inactive_30d").length, frequent: 0, high_spender: 0, unassigned: 0 },
});

const FALLBACK_DISCOUNT = "¡Te extrañamos! Visítanos y obtén un 15% de descuento en tu próxima compra.";

describe("controller_promotions_generate Integration Tests", () => {
  describe("T10: successful generation flow (R10)", () => {
    it("R10: should return success: true with non-empty campaigns when AIService resolves", async () => {
      const mockInactive = [createInactiveCustomer("+521234567890", "Juan Pérez")];
      const originalGetSegments = ClientModel.getCustomerSegments;
      const originalGeneratePrompts = AIService.generateRecoveryPrompts;

      ClientModel.getCustomerSegments = () => Promise.resolve(mockSegmentationResult(mockInactive));

      const mockPromptResult: GeminiRecoveryPromptResult[] = [
        { phone_number: "+521234567890", recoveryCopy: "¡Hola Juan! Te tenemos una oferta especial.", generatedAt: new Date().toISOString() },
      ];
      AIService.generateRecoveryPrompts = () => Promise.resolve(mockPromptResult);

      try {
        const res = await PromotionsController.generate();

        expect(res).toBeDefined();
        expect(res.success).toBe(true);
        expect(res.data).toBeDefined();
        expect(res.data!.campaigns).toHaveLength(1);
        expect(res.data!.campaigns[0].phone_number).toBe("+521234567890");
        expect(res.data!.campaigns[0].recoveryCopy).toBe("¡Hola Juan! Te tenemos una oferta especial.");
      } finally {
        ClientModel.getCustomerSegments = originalGetSegments;
        AIService.generateRecoveryPrompts = originalGeneratePrompts;
      }
    });
  });

  describe("T11: AIService rejection fallback (R11)", () => {
    it("R11: should inject fallback discount campaigns when AIService rejects", async () => {
      const mockInactive = [
        createInactiveCustomer("+521234567890", "Juan Pérez"),
        createInactiveCustomer("+521234567891", "María García"),
      ];
      const originalGetSegments = ClientModel.getCustomerSegments;
      const originalGeneratePrompts = AIService.generateRecoveryPrompts;

      ClientModel.getCustomerSegments = () => Promise.resolve(mockSegmentationResult(mockInactive));
      AIService.generateRecoveryPrompts = () => Promise.reject(new Error("Gemini API rate limit exceeded"));

      try {
        const res = await PromotionsController.generate();

        expect(res).toBeDefined();
        expect(res.success).toBe(true);
        expect(res.data).toBeDefined();
        expect(res.data!.campaigns).toHaveLength(2);
        for (const campaign of res.data!.campaigns) {
          expect(campaign.recoveryCopy).toBe(FALLBACK_DISCOUNT);
        }
        expect(res.data!.campaigns[0].phone_number).toBe("+521234567890");
        expect(res.data!.campaigns[1].phone_number).toBe("+521234567891");
      } finally {
        ClientModel.getCustomerSegments = originalGetSegments;
        AIService.generateRecoveryPrompts = originalGeneratePrompts;
      }
    });
  });

  describe("T12: zero inactive customers (R12)", () => {
    it("R12: should return empty campaigns and NOT call AIService when no inactive_30d customers exist", async () => {
      const mockActive = [createActiveCustomer("+521234567890", "Ana López")];
      const originalGetSegments = ClientModel.getCustomerSegments;
      const originalGeneratePrompts = AIService.generateRecoveryPrompts;

      ClientModel.getCustomerSegments = () => Promise.resolve(mockSegmentationResult(mockActive));

      let aiServiceCalled = false;
      AIService.generateRecoveryPrompts = () => {
        aiServiceCalled = true;
        return Promise.resolve([]);
      };

      try {
        const res = await PromotionsController.generate();

        expect(res).toBeDefined();
        expect(res.success).toBe(true);
        expect(res.data).toBeDefined();
        expect(res.data!.campaigns).toEqual([]);
        expect(aiServiceCalled).toBe(false);
      } finally {
        ClientModel.getCustomerSegments = originalGetSegments;
        AIService.generateRecoveryPrompts = originalGeneratePrompts;
      }
    });
  });

  describe("T13: DB_CONNECTION_FAILURE (R9)", () => {
    it("R9: should return { success: false, status: 500, error: 'DB_CONNECTION_FAILURE' }", async () => {
      const originalGetSegments = ClientModel.getCustomerSegments;
      ClientModel.getCustomerSegments = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

      try {
        const res = await PromotionsController.generate();

        expect(res).toBeDefined();
        expect(res.success).toBe(false);
        expect(res.status).toBe(500);
        expect(res.error).toBe("DB_CONNECTION_FAILURE");
      } finally {
        ClientModel.getCustomerSegments = originalGetSegments;
      }
    });
  });

  describe("T14: generic error from ClientModel (R8, R9)", () => {
    it("R8/R9: should propagate generic error with status 500", async () => {
      const originalGetSegments = ClientModel.getCustomerSegments;
      ClientModel.getCustomerSegments = () => Promise.reject(new Error("UNEXPECTED_DB_ERROR"));

      try {
        const res = await PromotionsController.generate();

        expect(res).toBeDefined();
        expect(res.success).toBe(false);
        expect(res.status).toBe(500);
        expect(res.error).toBe("UNEXPECTED_DB_ERROR");
      } finally {
        ClientModel.getCustomerSegments = originalGetSegments;
      }
    });
  });

  describe("T15: logger spy tests (R7, R8)", () => {
    it("R7: should log 'PromotionsController.generate started' via logger.info", async () => {
      const mockSegments: CustomerSegmentationResult = {
        segments: [],
        summary: { inactive_30d: 0, frequent: 0, high_spender: 0, unassigned: 0 },
      };
      const originalGetSegments = ClientModel.getCustomerSegments;
      ClientModel.getCustomerSegments = () => Promise.resolve(mockSegments);

      const infoSpy = vi.spyOn(logger, "info");

      try {
        await PromotionsController.generate();

        expect(infoSpy).toHaveBeenCalledWith("PromotionsController.generate started");
      } finally {
        infoSpy.mockRestore();
        ClientModel.getCustomerSegments = originalGetSegments;
      }
    });

    it("R8: should log error via logger.error when AIService fails", async () => {
      const mockInactive = [createInactiveCustomer("+521234567890", "Juan Pérez")];
      const originalGetSegments = ClientModel.getCustomerSegments;
      const originalGeneratePrompts = AIService.generateRecoveryPrompts;

      ClientModel.getCustomerSegments = () => Promise.resolve(mockSegmentationResult(mockInactive));
      AIService.generateRecoveryPrompts = () => Promise.reject(new Error("Gemini API error"));

      const errorSpy = vi.spyOn(logger, "error");

      try {
        await PromotionsController.generate();

        expect(errorSpy).toHaveBeenCalledWith(
          "PromotionsController.generate AIService failed",
          expect.any(Error)
        );
      } finally {
        errorSpy.mockRestore();
        ClientModel.getCustomerSegments = originalGetSegments;
        AIService.generateRecoveryPrompts = originalGeneratePrompts;
      }
    });

    it("R8: should log error via logger.error when ClientModel fails", async () => {
      const originalGetSegments = ClientModel.getCustomerSegments;
      ClientModel.getCustomerSegments = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

      const errorSpy = vi.spyOn(logger, "error");

      try {
        await PromotionsController.generate();

        expect(errorSpy).toHaveBeenCalledWith(
          "PromotionsController.generate failed",
          expect.any(Error)
        );
      } finally {
        errorSpy.mockRestore();
        ClientModel.getCustomerSegments = originalGetSegments;
      }
    });
  });
});
