import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import ws from "ws";
import { MilestoneService } from "../../src/backend/services/milestone.service";
import { ClientModel } from "../../src/backend/models/client.model";
import { supabaseModel } from "../../src/backend/models/supabase.model";
import { MILESTONE_THRESHOLD } from "../../src/backend/types/models.type";

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

describe("service_visit_milestone_counter Integration Tests", () => {
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

  it("R1, R3: should expose MilestoneService with evaluateMilestone static method and export MILESTONE_THRESHOLD = 10", async () => {
    expect(MilestoneService.evaluateMilestone).toBeTypeOf("function");
    expect(MILESTONE_THRESHOLD).toBe(10);
  });

  it("R5: should parse suffix count in offline simulation mode and default to 10 if not present", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const count5 = await ClientModel.getWifiLoginCount("cli-count-5");
    expect(count5).toBe(5);

    const count15 = await ClientModel.getWifiLoginCount("cli-count-15");
    expect(count15).toBe(15);

    const countDefault = await ClientModel.getWifiLoginCount("cli-001");
    expect(countDefault).toBe(10);
  });

  it("R6: should throw INVALID_CLIENT_ID if clientId is empty or whitespace", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    await expect(ClientModel.getWifiLoginCount("")).rejects.toThrow("INVALID_CLIENT_ID");
    await expect(ClientModel.getWifiLoginCount("   ")).rejects.toThrow("INVALID_CLIENT_ID");
    await expect(MilestoneService.evaluateMilestone("")).rejects.toThrow("INVALID_CLIENT_ID");
    await expect(MilestoneService.evaluateMilestone("   ")).rejects.toThrow("INVALID_CLIENT_ID");
  });

  it("R2, R4: should invoke ClientModel.getWifiLoginCount and return isMilestone true if and only if visitCount is exactly 10", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = false;
    internals.client = null;

    const spy = vi.spyOn(ClientModel, "getWifiLoginCount");

    const evaluation9 = await MilestoneService.evaluateMilestone("cli-count-9");
    expect(spy).toHaveBeenCalledWith("cli-count-9");
    expect(evaluation9.visitCount).toBe(9);
    expect(evaluation9.isMilestone).toBe(false);

    const evaluation10 = await MilestoneService.evaluateMilestone("cli-count-10");
    expect(spy).toHaveBeenCalledWith("cli-count-10");
    expect(evaluation10.visitCount).toBe(10);
    expect(evaluation10.isMilestone).toBe(true);

    const evaluation11 = await MilestoneService.evaluateMilestone("cli-count-11");
    expect(spy).toHaveBeenCalledWith("cli-count-11");
    expect(evaluation11.visitCount).toBe(11);
    expect(evaluation11.isMilestone).toBe(false);

    spy.mockRestore();
  });

  it("R7: should bubble up 'DB_CONNECTION_FAILURE' when database query fails due to network connection", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    const fakeClient = {
      from: () => ({
        select: () => ({
          eq: () => Promise.reject(new Error("fetch failed"))
        })
      })
    };
    const spy = vi.spyOn(supabaseModel, "getClient").mockReturnValue(fakeClient as unknown as ReturnType<typeof supabaseModel.getClient>);

    await expect(ClientModel.getWifiLoginCount("cli-001")).rejects.toThrow("DB_CONNECTION_FAILURE");
    spy.mockRestore();
  });

  it("R7: should bubble up 'DB_QUERY_ERROR' on database execution or schema error", async () => {
    const internals = supabaseModel as unknown as SupabaseModelClientInternals;
    internals.isInitialized = true;

    const fakeClient = {
      from: () => ({
        select: () => ({
          eq: () => Promise.resolve({ count: null, error: { message: "Table not found", code: "P0001" } })
        })
      })
    };
    const spy = vi.spyOn(supabaseModel, "getClient").mockReturnValue(fakeClient as unknown as ReturnType<typeof supabaseModel.getClient>);

    await expect(ClientModel.getWifiLoginCount("cli-001")).rejects.toThrow("DB_QUERY_ERROR");
    spy.mockRestore();
  });
});

