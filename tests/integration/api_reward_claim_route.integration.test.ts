import { describe, it, expect, beforeAll, afterAll, vi, afterEach } from "vitest";
import ws from "ws";
import { POST } from "../../src/app/api/v1/rewards/claim/route";
import { MilestoneService } from "../../src/backend/services/milestone.service";
import { ClientModel } from "../../src/backend/models/client.model";
import { supabaseModel } from "../../src/backend/models/supabase.model";

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

afterEach(() => {
  vi.restoreAllMocks();
});

interface SupabaseModelClientInternals {
  isInitialized: boolean;
  client: unknown;
}

describe("api_reward_claim_route Integration Tests", () => {
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

  it("R1, R2: should process a valid reward claim, resetting wifi login count, and returning 200 OK", async () => {
    vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
      clientId: "cli-count-10",
      visitCount: 10,
      isMilestone: true
    });
    const resetSpy = vi.spyOn(ClientModel, "resetWifiLoginCount").mockResolvedValue();

    const requestPayload = {
      clientId: "cli-count-10"
    };

    const req = new Request("http://localhost/api/v1/rewards/claim", {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const res = await POST(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual({ message: "Reward claimed successfully" });
    expect(resetSpy).toHaveBeenCalledWith("cli-count-10");
  });

  it("R3: should reject malformed JSON input with 400 Bad Request", async () => {
    const req = new Request("http://localhost/api/v1/rewards/claim", {
      method: "POST",
      body: "not-a-valid-json-payload-string",
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

  it("R4: should propagate validation failure from the controller with status 400", async () => {
    vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
      clientId: "cli-count-5",
      visitCount: 5,
      isMilestone: false
    });

    const requestPayload = {
      clientId: "cli-count-5"
    };

    const req = new Request("http://localhost/api/v1/rewards/claim", {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const res = await POST(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed: Milestone not reached");
  });

  it("R5: should bubble database connection failure correctly as status 500", async () => {
    vi.spyOn(MilestoneService, "evaluateMilestone").mockResolvedValue({
      clientId: "cli-count-10",
      visitCount: 10,
      isMilestone: true
    });
    vi.spyOn(ClientModel, "resetWifiLoginCount").mockRejectedValue(new Error("DB_CONNECTION_FAILURE"));

    const requestPayload = {
      clientId: "cli-count-10"
    };

    const req = new Request("http://localhost/api/v1/rewards/claim", {
      method: "POST",
      body: JSON.stringify(requestPayload),
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
  });
});
