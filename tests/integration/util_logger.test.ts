import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { logger } from "../../src/backend/utils/logger.utils";

describe("logger utility integration tests", () => {
  let logSpy: MockInstance;
  let warnSpy: MockInstance;
  let errorSpy: MockInstance;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("R1, R2, R5: logger.info", () => {
    it("R5: SHALL print formatted entry with [INFO], valid ISO timestamp, and message to console.log", () => {
      logger.info("Test info message");

      expect(logSpy).toHaveBeenCalledOnce();
      const callArg = logSpy.mock.calls[0][0] as string;
      
      // Match "[INFO] [2026-05-28T...Z] Test info message"
      expect(callArg).toContain("[INFO]");
      expect(callArg).toContain("Test info message");
      
      const timestampMatch = callArg.match(/\[INFO\] \[(.*?)\]/);
      expect(timestampMatch).not.toBeNull();
      if (timestampMatch) {
        const timestamp = timestampMatch[1];
        expect(isNaN(Date.parse(timestamp))).toBe(false);
      }
    });

    it("R5: SHALL append serialized JSON context if provided", () => {
      const context = { userId: 123, active: true };
      logger.info("Test info with context", context);

      expect(logSpy).toHaveBeenCalledOnce();
      const calls = logSpy.mock.calls[0];
      
      expect(calls[0] as string).toContain("[INFO]");
      expect(calls[0] as string).toContain("Test info with context");
      expect(calls[1] as string).toBe(JSON.stringify(context, null, 2));
    });
  });

  describe("R1, R3, R6: logger.warn", () => {
    it("R6: SHALL print formatted entry with [WARN], valid ISO timestamp, and message to console.warn", () => {
      logger.warn("Test warning message");

      expect(warnSpy).toHaveBeenCalledOnce();
      const callArg = warnSpy.mock.calls[0][0] as string;
      
      expect(callArg).toContain("[WARN]");
      expect(callArg).toContain("Test warning message");
      
      const timestampMatch = callArg.match(/\[WARN\] \[(.*?)\]/);
      expect(timestampMatch).not.toBeNull();
      if (timestampMatch) {
        const timestamp = timestampMatch[1];
        expect(isNaN(Date.parse(timestamp))).toBe(false);
      }
    });

    it("R6: SHALL append serialized JSON context if provided", () => {
      const context = { code: "WARN_CODE", meta: "data" };
      logger.warn("Test warning with context", context);

      expect(warnSpy).toHaveBeenCalledOnce();
      const calls = warnSpy.mock.calls[0];
      
      expect(calls[0] as string).toContain("[WARN]");
      expect(calls[0] as string).toContain("Test warning with context");
      expect(calls[1] as string).toBe(JSON.stringify(context, null, 2));
    });
  });

  describe("R1, R4, R7: logger.error", () => {
    it("R7: SHALL print formatted entry with [ERROR], valid ISO timestamp, and message to console.error", () => {
      logger.error("Test error message");

      expect(errorSpy).toHaveBeenCalledOnce();
      const callArg = errorSpy.mock.calls[0][0] as string;
      
      expect(callArg).toContain("[ERROR]");
      expect(callArg).toContain("Test error message");
      
      const timestampMatch = callArg.match(/\[ERROR\] \[(.*?)\]/);
      expect(timestampMatch).not.toBeNull();
      if (timestampMatch) {
        const timestamp = timestampMatch[1];
        expect(isNaN(Date.parse(timestamp))).toBe(false);
      }
    });

    it("R7: SHALL append raw/serialized error details if provided", () => {
      const errorPayload = new Error("Test Exception");
      logger.error("Test error with details", errorPayload);

      expect(errorSpy).toHaveBeenCalledOnce();
      const calls = errorSpy.mock.calls[0];
      
      expect(calls[0] as string).toContain("[ERROR]");
      expect(calls[0] as string).toContain("Test error with details");
      expect(calls[1]).toBe(errorPayload);
    });
  });

  describe("R5, R6, R7: Null/Undefined handling", () => {
    it("SHALL not pass undefined parameters to console functions", () => {
      logger.info("Message only", undefined);
      expect(logSpy.mock.calls[0].length).toBe(1);

      logger.warn("Message only", undefined);
      expect(warnSpy.mock.calls[0].length).toBe(1);

      logger.error("Message only", undefined);
      expect(errorSpy.mock.calls[0].length).toBe(1);
    });
  });
});
