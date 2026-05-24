import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { ClientModel } from "../../src/backend/models/client.model";
import { PromotionsController } from "../../src/backend/controllers/promotions.controller";
import { GET } from "../../src/app/api/v1/promotions/segments/route";

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

describe("api_promotions_segments_route Integration Tests", () => {
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

  it("R4: should return 200 OK with success payload containing segments and summary", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const res = await GET();
    expect(res).toBeDefined();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data).toHaveProperty("segments");
    expect(data.data).toHaveProperty("summary");
  });

  it("R5: should map controller error to correct status code", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    const originalGetSegments = ClientModel.getCustomerSegments;
    ClientModel.getCustomerSegments = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

    try {
      const res = await GET();
      expect(res).toBeDefined();
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("DB_CONNECTION_FAILURE");
    } finally {
      ClientModel.getCustomerSegments = originalGetSegments;
    }
  });

  it("R6: should return 500 with INTERNAL_SERVER_ERROR on unexpected exception", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const originalGetSegments = PromotionsController.getSegments;
    PromotionsController.getSegments = () => Promise.reject(new Error("UNEXPECTED_CRASH"));

    try {
      const res = await GET();
      expect(res).toBeDefined();
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("INTERNAL_SERVER_ERROR");
    } finally {
      PromotionsController.getSegments = originalGetSegments;
    }
  });
});
