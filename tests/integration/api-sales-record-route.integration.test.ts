import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { SalesModel } from "../../src/backend/models/sales.model";
import { POST } from "../../src/app/api/v1/sales/record/route";

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

describe("api_sales_record_route Integration Tests", () => {
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

  it("R1, R2, R4: should process a valid request, insert into DB, and return 201 Created", async () => {
    // Restore online mode
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
    const payload = {
      phone_number: testPhone,
      amount: 150.0
    };

    const req = new Request("http://localhost/api/v1/sales/record", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const res = await POST(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.phone_number).toBe(testPhone);
    expect(data.data.amount).toBe(150.0);
  });

  it("R3: should reject malformed JSON input with 400 Bad Request", async () => {
    const req = new Request("http://localhost/api/v1/sales/record", {
      method: "POST",
      body: "not-a-json-payload{",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const res = await POST(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid JSON payload");
  });

  it("R5: should bubble validation errors with controller response status", async () => {
    const payload = {
      phone_number: "+5199988", // malformed phone
      amount: -10.0 // negative amount
    };

    const req = new Request("http://localhost/api/v1/sales/record", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const res = await POST(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it("R5: should bubble database connection failures as 500 Internal Server Error", async () => {
    // Force online mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    // Mock SalesModel.insertTransaction to simulate database connection exception
    const originalInsert = SalesModel.insertTransaction;
    SalesModel.insertTransaction = () => Promise.reject(new Error("DB_CONNECTION_FAILURE"));

    try {
      const payload = {
        phone_number: "+51999888777",
        amount: 45.0
      };

      const req = new Request("http://localhost/api/v1/sales/record", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const res = await POST(req);
      expect(res).toBeDefined();
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("DB_CONNECTION_FAILURE");
    } finally {
      // Restore original insert function
      SalesModel.insertTransaction = originalInsert;
    }
  });
});
