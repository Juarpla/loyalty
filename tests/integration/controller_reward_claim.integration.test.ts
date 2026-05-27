import { describe, it, expect, beforeAll, afterAll, vi, afterEach } from "vitest";
import ws from "ws";
import { MilestoneController } from "../../src/backend/controllers/milestone.controller";
import { MilestoneService } from "../../src/backend/services/milestone.service";
import { ClientModel } from "../../src/backend/models/client.model";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { logger } from "../../src/backend/utils/logger.utils";

if (typeof global.WebSocket === "undefined") {
  global.WebSocket = ws as unknown as typeof global.WebSocket;
}

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

interface SupabaseModelClientInternals {
  isInitialized: boolean;
  client: unknown;
}

describe("controller_reward_claim Integration Tests", () => {
  let originalIsInitialized: boolean;
  let originalClient: unknown;

  beforeAll(() => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    originalIsInitialized = internals.isInitialized;
    originalClient = internals.client;
  });

  afterAll(() => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = originalIsInitialized;
    internals.client = originalClient;
  });

  describe("R1: Expose claimReward", () => {
    it("should export MilestoneController and static method claimReward", () => {
      expect(MilestoneController).toBeDefined();
      expect(MilestoneController.claimReward).toBeTypeOf("function");
    });
  });

  describe("R2, R3: Input Validation Rules", () => {
    it("R2: should return 400 when reqBody is null or undefined", async () => {
      const res1 = await MilestoneController.claimReward(null);
      expect(res1.success).toBe(false);
      expect(res1.status).toBe(400);
      expect(res1.error).toBe("Request body is required");

      const res2 = await MilestoneController.claimReward(undefined);
      expect(res2.success).toBe(false);
      expect(res2.status).toBe(400);
      expect(res2.error).toBe("Request body is required");
    });

    it("R2: should return 400 when reqBody is not an object", async () => {
      const res = await MilestoneController.claimReward("invalid-body");
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Request body is required");
    });

    it("R3: should return 400 when clientId is missing", async () => {
      const res = await MilestoneController.claimReward({});
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Validation failed: Client ID is required");
    });

    it("R3: should return 400 when clientId is not a string", async () => {
      const res = await MilestoneController.claimReward({ clientId: 123 });
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Validation failed: Client ID is required");
    });

    it("R3: should return 400 when clientId contains only whitespace", async () => {
      const res = await MilestoneController.claimReward({ clientId: "   " });
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Validation failed: Client ID is required");
    });

    it("R3: should support snake_case client_id as a fallback", async () => {
      vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
        clientId: "cli-001",
        visitCount: 10,
        isMilestone: true
      });
      vi.spyOn(ClientModel, "resetWifiLoginCount").mockResolvedValue();

      const res = await MilestoneController.claimReward({ client_id: "cli-001" });
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
    });
  });

  describe("R4, R5: Milestone Eligibility", () => {
    it("R4, R5: should reject claim with 400 if client has not reached milestone threshold", async () => {
      vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
        clientId: "cli-count-5",
        visitCount: 5,
        isMilestone: false
      });

      const res = await MilestoneController.claimReward({ clientId: "cli-count-5" });
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Validation failed: Milestone not reached");
      expect(MilestoneService.evaluateMilestone).toHaveBeenCalledWith("cli-count-5");
    });
  });

  describe("R6, R7, R8: Successful Claims Processing", () => {
    it("R6, R7: should trigger claim audit logging, invoke resetWifiLoginCount, and return success", async () => {
      vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
        clientId: "cli-count-10",
        visitCount: 10,
        isMilestone: true
      });
      const resetSpy = vi.spyOn(ClientModel, "resetWifiLoginCount").mockResolvedValue();
      const loggerSpy = vi.spyOn(logger, "info");

      const res = await MilestoneController.claimReward({ clientId: "cli-count-10" });
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: "Reward claimed successfully" });
      expect(resetSpy).toHaveBeenCalledWith("cli-count-10");
      expect(loggerSpy).toHaveBeenCalledWith("Reward claimed successfully", expect.any(Object));
    });

    it("R8: should run resetWifiLoginCount successfully in offline simulation mode", async () => {
      const internals = supabaseModel as unknown as SupabaseModelClientInternals;
      internals.isInitialized = false;
      internals.client = null;

      await expect(ClientModel.resetWifiLoginCount("cli-count-10")).resolves.not.toThrow();
    });

    it("R7: should throw INVALID_CLIENT_ID if clientId is empty or whitespace in resetWifiLoginCount", async () => {
      await expect(ClientModel.resetWifiLoginCount("")).rejects.toThrow("INVALID_CLIENT_ID");
      await expect(ClientModel.resetWifiLoginCount("   ")).rejects.toThrow("INVALID_CLIENT_ID");
    });
  });

  describe("R9, R10: Database Error Wrapping and Mapping", () => {
    it("R9: should handle DB_CONNECTION_FAILURE and return 500", async () => {
      vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
        clientId: "cli-count-10",
        visitCount: 10,
        isMilestone: true
      });
      vi.spyOn(ClientModel, "resetWifiLoginCount").mockRejectedValue(new Error("DB_CONNECTION_FAILURE"));

      const res = await MilestoneController.claimReward({ clientId: "cli-count-10" });
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("DB_CONNECTION_FAILURE");
    });

    it("R10: should handle general query execution errors and return 500", async () => {
      vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
        clientId: "cli-count-10",
        visitCount: 10,
        isMilestone: true
      });
      vi.spyOn(ClientModel, "resetWifiLoginCount").mockRejectedValue(new Error("Table wifi_logins not found"));

      const res = await MilestoneController.claimReward({ clientId: "cli-count-10" });
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("Internal Server Error");
    });
  });
});
