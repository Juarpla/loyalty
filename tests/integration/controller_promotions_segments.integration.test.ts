import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { ClientModel } from "../../src/backend/models/client.model";
import { PromotionsController } from "../../src/backend/controllers/promotions.controller";
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

interface SupabaseModelClientInternals {
  isInitialized: boolean;
  client: unknown;
}

describe("controller_promotions_segments Integration Tests", () => {
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

  it("R2: should return success response with data containing segments and summary", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const res = await PromotionsController.getSegments();

    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data).toHaveProperty("segments");
    expect(res.data).toHaveProperty("summary");
    expect(Array.isArray(res.data.segments)).toBe(true);
    expect(typeof res.data.summary).toBe("object");
  });

  it("R3: should return status 500 with DB_CONNECTION_FAILURE error", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    const originalGetSegments = ClientModel.getCustomerSegments;
    ClientModel.getCustomerSegments = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

    try {
      const res = await PromotionsController.getSegments();

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("DB_CONNECTION_FAILURE");
    } finally {
      ClientModel.getCustomerSegments = originalGetSegments;
    }
  });

  it("R4: should return status 500 with generic error message", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    const originalGetSegments = ClientModel.getCustomerSegments;
    ClientModel.getCustomerSegments = () => Promise.reject(new Error("UNEXPECTED_ERROR"));

    try {
      const res = await PromotionsController.getSegments();

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("UNEXPECTED_ERROR");
    } finally {
      ClientModel.getCustomerSegments = originalGetSegments;
    }
  });

  it("R1: should log invocation via logger.info", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const infoSpy = vi.spyOn(logger, "info");

    try {
      await PromotionsController.getSegments();

      expect(infoSpy).toHaveBeenCalledWith("PromotionsController.getSegments started");
    } finally {
      infoSpy.mockRestore();
    }
  });

  it("R6: should log error via logger.error when exception occurs", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    const originalGetSegments = ClientModel.getCustomerSegments;
    ClientModel.getCustomerSegments = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

    const errorSpy = vi.spyOn(logger, "error");

    try {
      await PromotionsController.getSegments();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        "PromotionsController.getSegments failed",
        expect.any(Error)
      );
    } finally {
      errorSpy.mockRestore();
      ClientModel.getCustomerSegments = originalGetSegments;
    }
  });
});
