import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { SalesModel } from "../../src/backend/models/sales.model";
import { TrafficController } from "../../src/backend/controllers/traffic.controller";

// Ensure global WebSocket is available in older Node.js versions
if (typeof global.WebSocket === "undefined") {
  global.WebSocket = ws as unknown as typeof global.WebSocket;
}

// Setup environment variables for local Supabase test before any imports or runs
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

describe("controller_traffic_metrics Integration Tests", () => {
  let originalIsInitialized: boolean;
  let originalClient: unknown;

  beforeAll(() => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    originalIsInitialized = internals.isInitialized;
    originalClient = internals.client;
  });

  afterAll(() => {
    // Restore original status
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = originalIsInitialized;
    internals.client = originalClient;
  });

  it("R1, R2, R3: should return success payload with distribution object in offline/simulation mode", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const res = await TrafficController.getMetrics();

    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();

    // R3: Verify distribution object has required fields
    const distribution = res.data;
    expect(distribution).toHaveProperty("hours");
    expect(distribution).toHaveProperty("weekdays");
    expect(distribution).toHaveProperty("peakHour");
    expect(distribution).toHaveProperty("peakWeekday");
    expect(distribution).toHaveProperty("totalTransactions");

    // Verify hours is an array of 24
    expect(Array.isArray(distribution.hours)).toBe(true);
    expect(distribution.hours).toHaveLength(24);

    // Verify weekdays is an array of 7
    expect(Array.isArray(distribution.weekdays)).toBe(true);
    expect(distribution.weekdays).toHaveLength(7);

    // Verify peak hour is 0-23
    expect(distribution.peakHour).toBeGreaterThanOrEqual(0);
    expect(distribution.peakHour).toBeLessThanOrEqual(23);

    // Verify peak weekday is 0-6
    expect(distribution.peakWeekday).toBeGreaterThanOrEqual(0);
    expect(distribution.peakWeekday).toBeLessThanOrEqual(6);
  });

  it("R1, R2, R3: should successfully compute distribution from mock transaction data", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const res = await TrafficController.getMetrics();

    expect(res.success).toBe(true);
    expect(res.data?.totalTransactions).toBeGreaterThan(0);

    // Verify hours array contains numeric values
    for (const count of res.data!.hours) {
      expect(typeof count).toBe("number");
    }

    // Verify weekdays array contains numeric values
    for (const count of res.data!.weekdays) {
      expect(typeof count).toBe("number");
    }
  });

  it("R4: should catch DB_CONNECTION_FAILURE and return status 500 error packet", async () => {
    // Force online mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    // Mock SalesModel.getAllTransactions to simulate database connection exception
    const originalGetAll = SalesModel.getAllTransactions;
    SalesModel.getAllTransactions = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

    try {
      const res = await TrafficController.getMetrics();

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("DB_CONNECTION_FAILURE");
    } finally {
      // Always restore original method
      SalesModel.getAllTransactions = originalGetAll;
    }
  });

  it("R5: should catch other exceptions and return descriptive error packet", async () => {
    // Force online mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    // Mock SalesModel.getAllTransactions to simulate generic error
    const originalGetAll = SalesModel.getAllTransactions;
    SalesModel.getAllTransactions = () => Promise.reject(new Error("UNEXPECTED_DB_ERROR"));

    try {
      const res = await TrafficController.getMetrics();

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("UNEXPECTED_DB_ERROR");
    } finally {
      // Always restore original method
      SalesModel.getAllTransactions = originalGetAll;
    }
  });

  it("R1: should call SalesModel.getAllTransactions when compiling metrics", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    // Spy on the method by temporarily replacing it
    let callCount = 0;
    const originalGetAll = SalesModel.getAllTransactions;
    SalesModel.getAllTransactions = async () => {
      callCount++;
      return originalGetAll.call(SalesModel);
    };

    try {
      const res = await TrafficController.getMetrics();

      expect(callCount).toBe(1);
      expect(res.success).toBe(true);
    } finally {
      SalesModel.getAllTransactions = originalGetAll;
    }
  });
});