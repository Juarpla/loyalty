import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SupabaseModelClient, supabaseModel } from "../../src/backend/models/supabase.model";
import { logger } from "../../src/backend/utils/logger.utils";

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn((url: string, key: string) => {
      if (url === "FAIL_TRIGGER") {
        throw new Error("Simulated Instantiation Error");
      }
      return { url, key, mockClient: true } as unknown as SupabaseClient<Database>;
    })
  };
});


describe("db_supabase_client_instantiation Integration Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("R1: Module Export Verification", () => {
    it("should export supabaseModel as an instance of SupabaseModelClient", () => {
      expect(supabaseModel).toBeInstanceOf(SupabaseModelClient);
    });
  });

  describe("R2, R3, R5, R6: Client Instantiation and Fallbacks", () => {
    it("R2, R6: should load in offline simulation mode if credentials are empty", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const testInstance = new SupabaseModelClient();
      const status = testInstance.getStatus();

      expect(status.initialized).toBe(false);
      expect(status.mode).toBe("offline_simulation");
    });

    it("R2, R6: should initialize in production mode if credentials exist", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "example-anon-key";

      const testInstance = new SupabaseModelClient();
      const status = testInstance.getStatus();

      expect(status.initialized).toBe(true);
      expect(status.mode).toBe("production");

      const client = testInstance.getClient();
      expect(client).toBeDefined();
      expect((client as unknown as { url: string }).url).toBe("https://example.supabase.co");

    });

    it("R3, R6: should throw when getClient is invoked in offline simulation mode", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const testInstance = new SupabaseModelClient();
      expect(() => testInstance.getClient()).toThrow("Supabase client is not initialized.");
    });

    it("R5, R6: should log error and fallback to offline simulation if createClient throws an exception", () => {
      const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});

      process.env.NEXT_PUBLIC_SUPABASE_URL = "FAIL_TRIGGER";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "any-key";

      const testInstance = new SupabaseModelClient();
      const status = testInstance.getStatus();

      expect(status.initialized).toBe(false);
      expect(status.mode).toBe("offline_simulation");
      expect(errorSpy).toHaveBeenCalled();
      expect(() => testInstance.getClient()).toThrow("Supabase client is not initialized.");
    });
  });

  describe("R4, R6: Simulated Execution Helper", () => {
    it("R4: should log query using logger.info and resolve with mockData", async () => {
      const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => {});
      const testInstance = new SupabaseModelClient();

      const mockData = { id: 1, name: "Test" };
      const startTime = Date.now();
      const result = await testInstance.executeQuery("testQuery", mockData);
      const endTime = Date.now();

      expect(result).toEqual(mockData);
      expect(infoSpy).toHaveBeenCalledWith("Database Executing Query: [testQuery]");
      
      const duration = endTime - startTime;
      // We expect the delay to be in the [50ms, 150ms] range. Let's verify it took at least 45ms.
      expect(duration).toBeGreaterThanOrEqual(45);
    });
  });
});
