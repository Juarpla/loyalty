import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";
import { registerPortalClient } from "../../src/backend/controllers/portal.controller";
import { ClientModel } from "../../src/backend/models/client.model";

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

describe("controller_portal_register Integration Tests", () => {
  describe("Validation Rules", () => {
    it("R1, R2, R3: should return 400 when body is missing", async () => {
      const res = await registerPortalClient(null);

      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toBe("Request body is required");
    });

    it("R1, R3: should return 400 when name is missing or empty", async () => {
      const res = await registerPortalClient({ phone: "+51999888777" });

      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toContain("Validation failed: Name");
    });

    it("R1, R3: should return 400 when name is less than 2 characters", async () => {
      const res = await registerPortalClient({ name: "A", phone: "+51999888777" });

      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toContain("Validation failed: Name");
    });

    it("R1, R2: should return 400 when phone is missing", async () => {
      const res = await registerPortalClient({ name: "John Doe" });

      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toContain("Validation failed: Invalid phone");
    });

    it("R1, R2: should return 400 when phone is invalid", async () => {
      const res = await registerPortalClient({ name: "John Doe", phone: "abc" });

      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toContain("Validation failed: Invalid phone");
    });

    it("R1, R2: should return 400 when phone is too short", async () => {
      const res = await registerPortalClient({ name: "John Doe", phone: "123" });

      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.error).toContain("Validation failed: Invalid phone");
    });
  });

  describe("Successful Parsing and Processing", () => {
    it("R4: should invoke ClientModel.registerPortalLogin when validation succeeds", async () => {
      const mockResult = {
        clientId: "cli-123",
        loginId: "log-456",
      };

      vi.spyOn(ClientModel, "registerPortalLogin").mockResolvedValue(mockResult);

      const res = await registerPortalClient({
        name: "Jane Doe",
        phone: "+51987654321",
      });

      expect(res.success).toBe(true);
      expect(res.data).toEqual(mockResult);
      expect(ClientModel.registerPortalLogin).toHaveBeenCalledWith("+51987654321", "Jane Doe");
    });

    it("R4: should propagate internal server error from model properly", async () => {
      vi.spyOn(ClientModel, "registerPortalLogin").mockRejectedValue(new Error("Database error"));

      const res = await registerPortalClient({
        name: "Jane Doe",
        phone: "+51987654321",
      });

      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("Internal Server Error");
    });

    it("R4: should propagate DB connection failures correctly", async () => {
      vi.spyOn(ClientModel, "registerPortalLogin").mockRejectedValue(new Error("DB_CONNECTION_FAILURE"));

      const res = await registerPortalClient({
        name: "Jane Doe",
        phone: "+51987654321",
      });

      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.error).toBe("DB_CONNECTION_FAILURE");
    });
  });
});
