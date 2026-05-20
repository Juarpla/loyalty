import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { SalesModel } from "../../src/backend/models/sales.model";

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

describe("model_sales_query Integration Tests", () => {
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

  it("R4: should return successfully generated mock aggregation in offline/simulation mode", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    // Test with simulated matching number
    const matchRes = await SalesModel.getSalesAggregate("123456789");
    expect(matchRes).toBeDefined();
    expect(matchRes.phone_number).toBe("123456789");
    expect(matchRes.visit_count).toBe(5);
    expect(matchRes.average_ticket).toBe(25.5);

    // Test with non-matching number
    const nonMatchRes = await SalesModel.getSalesAggregate("987654321");
    expect(nonMatchRes).toBeDefined();
    expect(nonMatchRes.phone_number).toBe("987654321");
    expect(nonMatchRes.visit_count).toBe(0);
    expect(nonMatchRes.average_ticket).toBe(0);
  });

  it("R1: should successfully calculate cumulative transaction count and average ticket size when connected", async () => {
    // Restore or re-create client to ensure it's online
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    const { createClient } = await import("@supabase/supabase-js");
    internals.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const testPhone = `+5199977${Date.now()}`;
    
    // Insert two transaction details to test math aggregation
    await SalesModel.insertTransaction(testPhone, 100);
    await SalesModel.insertTransaction(testPhone, 50);

    const res = await SalesModel.getSalesAggregate(testPhone);

    expect(res).toBeDefined();
    expect(res.phone_number).toBe(testPhone);
    expect(res.visit_count).toBe(2);
    expect(res.average_ticket).toBe(75.0);
  });

  it("R2: should return zero count and zero average ticket when no transactions exist for the phone number", async () => {
    // Ensure online
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    const { createClient } = await import("@supabase/supabase-js");
    internals.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Query non-existent phone number
    const nonExistentPhone = `+5100000${Date.now()}`;
    const res = await SalesModel.getSalesAggregate(nonExistentPhone);

    expect(res).toBeDefined();
    expect(res.phone_number).toBe(nonExistentPhone);
    expect(res.visit_count).toBe(0);
    expect(res.average_ticket).toBe(0);
  });

  it("R3: should bubble up 'DB_CONNECTION_FAILURE' when database is unreachable", async () => {
    // Ensure client is online and initialized
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    const { createClient } = await import("@supabase/supabase-js");
    const clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );
    internals.client = clientInstance;

    // Mock clientInstance.from to fail with fetch failed immediately
    const originalFrom = clientInstance.from;
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
    clientInstance.from = ((table: string) => {
      if (table === "sales_transactions") {
        return {
          select: (cols: string) => ({
            eq: (col: string, val: any) => Promise.reject(new TypeError("fetch failed"))
          })
        } as any;
      }
      return originalFrom.call(clientInstance, table);
    }) as any;
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

    try {
      const testPhone = "+51999888777";
      await expect(SalesModel.getSalesAggregate(testPhone)).rejects.toThrow("DB_CONNECTION_FAILURE");
    } finally {
      // Restore original from method
      clientInstance.from = originalFrom;
    }
  });
});
