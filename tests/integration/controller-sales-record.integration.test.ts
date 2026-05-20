import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { SalesModel } from "../../src/backend/models/sales.model";
import { SalesController } from "../../src/backend/controllers/sales.controller";

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

describe("controller_sales_record Integration Tests", () => {
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

  it("R1, R3: should reject missing or invalid phone numbers with 400 validation error packet", async () => {
    // Missing phone number
    const res1 = await SalesController.recordTransaction({ amount: 100 } as { phone_number?: unknown; phoneNumber?: unknown; amount?: unknown });
    expect(res1).toBeDefined();
    expect(res1.success).toBe(false);
    expect(res1.status).toBe(400);
    expect(res1.error).toBe("Phone number is required");

    // Non-string phone number
    const res2 = await SalesController.recordTransaction({ phone_number: 123456789, amount: 100 } as { phone_number?: unknown; phoneNumber?: unknown; amount?: unknown });
    expect(res2.success).toBe(false);
    expect(res2.status).toBe(400);
    expect(res2.error).toBe("Invalid phone number format");

    // Malformed Peruvian format (too short)
    const res3 = await SalesController.recordTransaction({ phone_number: "+51999888", amount: 100 });
    expect(res3.success).toBe(false);
    expect(res3.status).toBe(400);
    expect(res3.error).toBe("Invalid phone number format");

    // Malformed Peruvian format (too long)
    const res4 = await SalesController.recordTransaction({ phone_number: "+519998887777", amount: 100 });
    expect(res4.success).toBe(false);
    expect(res4.status).toBe(400);
    expect(res4.error).toBe("Invalid phone number format");

    // Invalid E.164 (no plus prefix)
    const res5 = await SalesController.recordTransaction({ phone_number: "51999888777", amount: 100 });
    expect(res5.success).toBe(false);
    expect(res5.status).toBe(400);
    expect(res5.error).toBe("Invalid phone number format");
  });

  it("R2, R3: should reject missing, non-numeric, or negative/zero amounts with 400 validation error packet", async () => {
    const validPhone = "+51999888777";

    // Missing amount
    const res1 = await SalesController.recordTransaction({ phone_number: validPhone });
    expect(res1.success).toBe(false);
    expect(res1.status).toBe(400);
    expect(res1.error).toBe("Amount is required");

    // Non-numeric amount
    const res2 = await SalesController.recordTransaction({ phone_number: validPhone, amount: "abc" });
    expect(res2.success).toBe(false);
    expect(res2.status).toBe(400);
    expect(res2.error).toBe("Amount must be a strictly positive number");

    // Boolean amount
    const res3 = await SalesController.recordTransaction({ phone_number: validPhone, amount: true });
    expect(res3.success).toBe(false);
    expect(res3.status).toBe(400);
    expect(res3.error).toBe("Amount must be a strictly positive number");

    // Zero amount
    const res4 = await SalesController.recordTransaction({ phone_number: validPhone, amount: 0 });
    expect(res4.success).toBe(false);
    expect(res4.status).toBe(400);
    expect(res4.error).toBe("Amount must be a strictly positive number");

    // Negative amount
    const res5 = await SalesController.recordTransaction({ phone_number: validPhone, amount: -15.5 });
    expect(res5.success).toBe(false);
    expect(res5.status).toBe(400);
    expect(res5.error).toBe("Amount must be a strictly positive number");
  });

  it("R4: should return successfully generated mock record in offline/simulation mode", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const phone = "+51999888777";
    const amount = 85.5;

    const res = await SalesController.recordTransaction({ phone_number: phone, amount });

    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.id).toContain("txn-");
    expect(res.data?.phone_number).toBe(phone);
    expect(res.data?.amount).toBe(amount);
  });

  it("R4: should successfully insert transaction details into local database when connected", async () => {
    // Restore client to ensure it's online
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

    const testPhone = `+519${Math.floor(10000000 + Math.random() * 90000000)}`;
    const amount = 120.0;

    const res = await SalesController.recordTransaction({ phone_number: testPhone, amount });

    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.id).toBeDefined();
    expect(res.data?.phone_number).toBe(testPhone);
    expect(res.data?.amount).toBe(amount);
  });

  it("R5: should catch DB connection failures and map them to a status 500 error packet", async () => {
    // Force online mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    // Mock SalesModel.insertTransaction to simulate database connection exception
    const originalInsert = SalesModel.insertTransaction;
    SalesModel.insertTransaction = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

    try {
      const phone = "+51999888777";
      const amount = 50.0;

      const res = await SalesController.recordTransaction({ phone_number: phone, amount });

      expect(res).toBeDefined();
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("DB_CONNECTION_FAILURE");
    } finally {
      // Always restore original method
      SalesModel.insertTransaction = originalInsert;
    }
  });
});
