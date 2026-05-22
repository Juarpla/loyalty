import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { SalesModel } from "../../src/backend/models/sales.model";
import { GET } from "../../src/app/api/v1/sales/metrics/route";

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

describe("api_traffic_metrics_route Integration Tests", () => {
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

  it("R1, R2, R3: should return 200 OK with success payload containing distribution data", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const res = await GET();
    expect(res).toBeDefined();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data).toHaveProperty("hours");
    expect(data.data).toHaveProperty("weekdays");
    expect(data.data).toHaveProperty("peakHour");
    expect(data.data).toHaveProperty("peakWeekday");
    expect(data.data).toHaveProperty("totalTransactions");
  });

  it("R1, R2: should delegate to TrafficController.getMetrics and return valid response structure", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const res = await GET();
    expect(res).toBeDefined();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data.hours)).toBe(true);
    expect(data.data.hours).toHaveLength(24);
    expect(Array.isArray(data.data.weekdays)).toBe(true);
    expect(data.data.weekdays).toHaveLength(7);
  });

  it("R4: should map DB_CONNECTION_FAILURE error to 500 status code", async () => {
    // Force online mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    // Mock SalesModel.getAllTransactions to simulate database connection failure
    const originalGetAll = SalesModel.getAllTransactions;
    SalesModel.getAllTransactions = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

    try {
      const res = await GET();
      expect(res).toBeDefined();
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("DB_CONNECTION_FAILURE");
    } finally {
      SalesModel.getAllTransactions = originalGetAll;
    }
  });

  it("R4: should map other controller errors to 500 status code", async () => {
    // Force online mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    // Mock SalesModel.getAllTransactions to simulate a generic error
    const originalGetAll = SalesModel.getAllTransactions;
    SalesModel.getAllTransactions = () => Promise.reject(new Error("UNEXPECTED_ERROR"));

    try {
      const res = await GET();
      expect(res).toBeDefined();
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    } finally {
      SalesModel.getAllTransactions = originalGetAll;
    }
  });
});