import { describe, it, expect, beforeAll, afterAll } from "vitest";
import ws from "ws";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { ClientModel } from "../../src/backend/models/client.model";

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

describe("model_captive_portal_upsert Integration Tests", () => {
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

  it("R5: should return simulated mock IDs when operating in offline_simulation mode", async () => {
    // Force offline mode
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const res = await ClientModel.registerPortalLogin("+123456789", "Alice");

    expect(res).toBeDefined();
    expect(res.clientId).toContain("cli-");
    expect(res.loginId).toContain("log-");
  });

  it("R1, R2, R3: should successfully upsert client and insert login details when connected", async () => {
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

    const testPhone = "+51999888123";
    const testName = "Test User " + Date.now();

    const res = await ClientModel.registerPortalLogin(testPhone, testName);

    expect(res).toBeDefined();
    expect(res.clientId).toBeDefined();
    expect(res.loginId).toBeDefined();

    // Verify updating name on existing client (R2)
    const testNewName = "Updated User " + Date.now();
    const res2 = await ClientModel.registerPortalLogin(testPhone, testNewName);
    
    expect(res2).toBeDefined();
    expect(res2.clientId).toBe(res.clientId); // Should be the exact same client ID
    expect(res2.loginId).not.toBe(res.loginId); // Should be a different login ID
  });

  it("R4: should bubble up 'DB_CONNECTION_FAILURE' when database is unreachable", async () => {
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

    const testPhone = "+51999888123";
    
    await expect(ClientModel.registerPortalLogin(testPhone)).rejects.toThrow("DB_CONNECTION_FAILURE");
  });
});
