import { describe, it, expect, vi } from "vitest";
import { decorate } from "../../src/backend/services/social-prompt.decorator";
import { TrafficService } from "../../src/backend/services/traffic.service";

function makeTransaction(createdAt: string) {
  return {
    id: "1",
    phone_number: "+525512345678",
    amount: 100,
    created_at: createdAt,
  };
}

const SAMPLE_PROMPT = "Generate 3 social media post ideas";

describe("decorate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("R3: should append flash sale text when isLowTrafficDay returns true", () => {
    vi.spyOn(TrafficService, "isLowTrafficDay").mockReturnValue(true);

    const transactions = [makeTransaction("2024-01-01T10:00:00Z")];
    const result = decorate(SAMPLE_PROMPT, transactions, new Date("2024-01-01"));

    expect(result).toContain("[Oferta Relámpago]");
    expect(result).toContain(SAMPLE_PROMPT);
  });

  it("R4: should return prompt unchanged when isLowTrafficDay returns false", () => {
    vi.spyOn(TrafficService, "isLowTrafficDay").mockReturnValue(false);

    const transactions = [makeTransaction("2024-01-01T10:00:00Z")];
    const result = decorate(SAMPLE_PROMPT, transactions, new Date("2024-01-01"));

    expect(result).toBe(SAMPLE_PROMPT);
  });

  it("R5: should return prompt unchanged and not call isLowTrafficDay when transactions are empty", () => {
    const spy = vi.spyOn(TrafficService, "isLowTrafficDay");

    const result = decorate(SAMPLE_PROMPT, [], new Date("2024-01-01"));

    expect(result).toBe(SAMPLE_PROMPT);
    expect(spy).not.toHaveBeenCalled();
  });

  it("R6: should default date to new Date() when not provided", () => {
    vi.spyOn(TrafficService, "isLowTrafficDay").mockReturnValue(true);

    const transactions = [makeTransaction("2024-01-01T10:00:00Z")];
    const result = decorate(SAMPLE_PROMPT, transactions);

    expect(result).toContain("[Oferta Relámpago]");
  });
});
