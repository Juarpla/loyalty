import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { ClientModel } from "../../src/backend/models/client.model";
import { SEGMENTATION_THRESHOLDS } from "../../src/backend/types/models.type";

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

describe("model_customer_segmentation Integration Tests", () => {
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

  it("R7: SEGMENTATION_THRESHOLDS constants match expected values", () => {
    expect(SEGMENTATION_THRESHOLDS.INACTIVE_DAYS).toBe(30);
    expect(SEGMENTATION_THRESHOLDS.FREQUENT_VISIT_COUNT).toBe(5);
    expect(SEGMENTATION_THRESHOLDS.HIGH_SPENDER_MIN_TICKET).toBe(50);
  });

  it("R1,R8: should return CustomerSegmentationResult with segments and summary in offline mode", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const result = await ClientModel.getCustomerSegments();

    expect(result).toBeDefined();
    expect(Array.isArray(result.segments)).toBe(true);
    expect(result.segments.length).toBe(5);
    expect(result.summary).toBeDefined();
    expect(result.summary).toHaveProperty("inactive_30d");
    expect(result.summary).toHaveProperty("frequent");
    expect(result.summary).toHaveProperty("high_spender");
    expect(result.summary).toHaveProperty("unassigned");
  });

  it("R3: should tag customer with no transactions as inactive_30d", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const result = await ClientModel.getCustomerSegments();
    const alice = result.segments.find((s) => s.phone_number === "+51900111000");

    expect(alice).toBeDefined();
    expect(alice!.segment).toBe("inactive_30d");
    expect(alice!.visit_count).toBe(0);
    expect(alice!.average_ticket).toBe(0);
    expect(alice!.last_transaction_date).toBeNull();
    expect(alice!.name).toBe("Alice García");
  });

  it("R4: should tag customer with last transaction > 30 days ago as inactive_30d", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const result = await ClientModel.getCustomerSegments();
    const bob = result.segments.find((s) => s.phone_number === "+51900222000");

    expect(bob).toBeDefined();
    expect(bob!.segment).toBe("inactive_30d");
    expect(bob!.visit_count).toBe(1);
    expect(bob!.average_ticket).toBe(20);
    expect(bob!.last_transaction_date).not.toBeNull();
  });

  it("R5: should tag customer with visit_count >= 5 as frequent", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const result = await ClientModel.getCustomerSegments();
    const charlie = result.segments.find((s) => s.phone_number === "+51900333000");

    expect(charlie).toBeDefined();
    expect(charlie!.segment).toBe("frequent");
    expect(charlie!.visit_count).toBe(5);
    expect(charlie!.average_ticket).toBe(30);
  });

  it("R6: should tag customer with average_ticket >= 50 as high_spender", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const result = await ClientModel.getCustomerSegments();
    const diana = result.segments.find((s) => s.phone_number === "+51900444000");

    expect(diana).toBeDefined();
    expect(diana!.segment).toBe("high_spender");
    expect(diana!.visit_count).toBe(3);
    expect(diana!.average_ticket).toBe(60);
  });

  it("R2: inactive_30d takes priority over frequent and high_spender when customer qualifies for multiple", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    const { createClient } = await import("@supabase/supabase-js");
    const clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    internals.client = clientInstance;

    const originalFrom = clientInstance.from;
    const thirtyFiveDaysAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString();
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

    clientInstance.from = ((table: string) => {
      if (table === "sales_transactions") {
        return {
          select: () => ({
            order: () => Promise.resolve({
              data: [
                { id: "t1", phone_number: "multifl", amount: 60, created_at: thirtyFiveDaysAgo },
                { id: "t2", phone_number: "multifl", amount: 60, created_at: thirtyFiveDaysAgo },
                { id: "t3", phone_number: "multifl", amount: 60, created_at: thirtyFiveDaysAgo },
                { id: "t4", phone_number: "multifl", amount: 60, created_at: thirtyFiveDaysAgo },
                { id: "t5", phone_number: "multifl", amount: 60, created_at: thirtyFiveDaysAgo },
                { id: "t6", phone_number: "multifl", amount: 60, created_at: thirtyFiveDaysAgo },
                { id: "t7", phone_number: "multifr", amount: 60, created_at: fiveDaysAgo },
                { id: "t8", phone_number: "multifr", amount: 60, created_at: fiveDaysAgo },
                { id: "t9", phone_number: "multifr", amount: 60, created_at: fiveDaysAgo },
                { id: "t10", phone_number: "multifr", amount: 60, created_at: fiveDaysAgo },
                { id: "t11", phone_number: "multifr", amount: 60, created_at: fiveDaysAgo },
                { id: "t12", phone_number: "multifr", amount: 60, created_at: fiveDaysAgo },
              ],
              error: null,
            }),
          }),
        } as never;
      }
      if (table === "clients") {
        return {
          select: () => Promise.resolve({
            data: [
              { phone_number: "multifl", name: "Multi Qualifier Old" },
              { phone_number: "multifr", name: "Multi Qualifier Recent" },
            ],
            error: null,
          }),
        } as never;
      }
      return originalFrom.call(clientInstance, table);
    }) as never;

    try {
      const result = await ClientModel.getCustomerSegments();

      const oldCustomer = result.segments.find((s) => s.phone_number === "multifl");
      expect(oldCustomer).toBeDefined();
      expect(oldCustomer!.segment).toBe("inactive_30d");
      expect(oldCustomer!.visit_count).toBe(6);
      expect(oldCustomer!.average_ticket).toBe(60);

      const recentCustomer = result.segments.find((s) => s.phone_number === "multifr");
      expect(recentCustomer).toBeDefined();
      expect(recentCustomer!.segment).toBe("frequent");
      expect(recentCustomer!.visit_count).toBe(6);
      expect(recentCustomer!.average_ticket).toBe(60);
    } finally {
      clientInstance.from = originalFrom;
    }
  });

  it("R9: should return empty segments and zero summary when no customers exist", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    const { createClient } = await import("@supabase/supabase-js");
    const clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    internals.client = clientInstance;

    const originalFrom = clientInstance.from;
    clientInstance.from = ((table: string) => {
      if (table === "sales_transactions") {
        return {
          select: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        } as never;
      }
      if (table === "clients") {
        return {
          select: () => Promise.resolve({ data: [], error: null }),
        } as never;
      }
      return originalFrom.call(clientInstance, table);
    }) as never;

    try {
      const result = await ClientModel.getCustomerSegments();

      expect(result.segments).toEqual([]);
      expect(result.summary.inactive_30d).toBe(0);
      expect(result.summary.frequent).toBe(0);
      expect(result.summary.high_spender).toBe(0);
      expect(result.summary.unassigned).toBe(0);
    } finally {
      clientInstance.from = originalFrom;
    }
  });

  it("R10: should propagate DB_CONNECTION_FAILURE when database is unreachable", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    const { createClient } = await import("@supabase/supabase-js");
    const clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    internals.client = clientInstance;

    const originalFrom = clientInstance.from;
    clientInstance.from = ((table: string) => {
      if (table === "sales_transactions") {
        return {
          select: () => ({
            order: () => Promise.reject(new TypeError("fetch failed")),
          }),
        } as never;
      }
      return originalFrom.call(clientInstance, table);
    }) as never;

    try {
      await expect(ClientModel.getCustomerSegments()).rejects.toThrow("DB_CONNECTION_FAILURE");
    } finally {
      clientInstance.from = originalFrom;
    }
  });
});
