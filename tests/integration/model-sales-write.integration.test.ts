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

describe("model_sales_insert Integration Tests", () => {
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

  it("R4: should return successfully generated mock record in offline/simulation mode", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const phone = "123456789";
    const amount = 100.50;

    const res = await SalesModel.insertTransaction(phone, amount);

    expect(res).toBeDefined();
    expect(res.id).toContain("txn-");
    expect(res.phone_number).toBe(phone);
    expect(res.amount).toBe(amount);
    expect(res.created_at).toBeDefined();
  });

  it("R1, R2: should successfully insert transaction details into local database when connected", async () => {
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

    const testPhone = "+51999888777";
    const testAmount = 55.80;

    const res = await SalesModel.insertTransaction(testPhone, testAmount);

    expect(res).toBeDefined();
    expect(res.id).toBeDefined(); // should be a real uuid
    expect(res.phone_number).toBe(testPhone);
    expect(res.amount).toBe(testAmount);
    expect(res.created_at).toBeDefined();
  });

  it("R3: should bubble up 'DB_CONNECTION_FAILURE' when database is unreachable", async () => {
    // Temporarily point to an unreachable client/port
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;
    const { createClient } = await import("@supabase/supabase-js");
    internals.client = createClient(
      "http://127.0.0.1:11111", // unreachable port
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const testPhone = "+51999888777";
    const testAmount = 10.00;

    await expect(SalesModel.insertTransaction(testPhone, testAmount)).rejects.toThrow("DB_CONNECTION_FAILURE");
  });
});
