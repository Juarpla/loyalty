import { describe, it, expect } from "vitest";
import { TrafficService } from "../../src/backend/services/traffic.service";
import { TransactionRecord } from "../../src/backend/types/models.type";

function makeTransaction(
  id: string,
  createdAt: string,
  amount = 100,
): TransactionRecord {
  return {
    id,
    phone_number: "+525512345678",
    amount,
    created_at: createdAt,
  };
}

describe("TrafficService.computeDistribution", () => {
  // R1: 24-hour bucket compilation
  describe("R1: hourly distribution", () => {
    it("SHALL compile transaction frequencies into exactly 24 hour buckets", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-15T08:30:00Z"),
        makeTransaction("2", "2024-01-15T08:45:00Z"),
        makeTransaction("3", "2024-01-15T14:00:00Z"),
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.hours).toHaveLength(24);
      expect(result.hours[8]).toBe(2);
      expect(result.hours[14]).toBe(1);
      expect(result.hours[0]).toBe(0);
      expect(result.hours[23]).toBe(0);
    });

    it("SHALL correctly bucket transactions at midnight and 11pm", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-15T00:00:00Z"),
        makeTransaction("2", "2024-01-15T23:59:00Z"),
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.hours[0]).toBe(1);
      expect(result.hours[23]).toBe(1);
    });
  });

  // R2: 7-day weekday bucket compilation (0=Sunday through 6=Saturday)
  describe("R2: weekday distribution", () => {
    it("SHALL compile transaction frequencies into exactly 7 weekday buckets", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-14T10:00:00Z"), // Sunday
        makeTransaction("2", "2024-01-15T10:00:00Z"), // Monday
        makeTransaction("3", "2024-01-15T12:00:00Z"), // Monday
        makeTransaction("4", "2024-01-20T10:00:00Z"), // Saturday
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.weekdays).toHaveLength(7);
      expect(result.weekdays[0]).toBe(1); // Sunday
      expect(result.weekdays[1]).toBe(2); // Monday
      expect(result.weekdays[6]).toBe(1); // Saturday
      expect(result.weekdays[2]).toBe(0); // Tuesday
    });
  });

  // R3: Invalid timestamps are skipped
  describe("R3: invalid timestamp handling", () => {
    it("SHALL skip records with unparseable timestamps without throwing", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-15T10:00:00Z"),
        makeTransaction("2", "not-a-date"),
        makeTransaction("3", "2024-01-15T14:00:00Z"),
        makeTransaction("4", ""),
        makeTransaction("5", "invalid"),
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.totalTransactions).toBe(2);
      expect(result.hours[10]).toBe(1);
      expect(result.hours[14]).toBe(1);
    });

    it("SHALL handle all-invalid timestamps returning zeroed buckets", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "bad"),
        makeTransaction("2", "worse"),
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.totalTransactions).toBe(0);
      expect(result.hours).toEqual(new Array(24).fill(0));
      expect(result.weekdays).toEqual(new Array(7).fill(0));
    });
  });

  // R4: Empty dataset returns zeroed buckets
  describe("R4: empty input handling", () => {
    it("SHALL return zeroed buckets for empty input array", () => {
      const result = TrafficService.computeDistribution([]);

      expect(result.hours).toHaveLength(24);
      expect(result.weekdays).toHaveLength(7);
      expect(result.hours).toEqual(new Array(24).fill(0));
      expect(result.weekdays).toEqual(new Array(7).fill(0));
      expect(result.peakHour).toBe(0);
      expect(result.peakWeekday).toBe(0);
      expect(result.totalTransactions).toBe(0);
    });
  });

  // R5: Peak hour and weekday identification with tie-breaking
  describe("R5: peak identification", () => {
    it("SHALL identify the hour with the highest transaction count", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-15T09:00:00Z"),
        makeTransaction("2", "2024-01-15T09:30:00Z"),
        makeTransaction("3", "2024-01-15T09:45:00Z"),
        makeTransaction("4", "2024-01-15T14:00:00Z"),
        makeTransaction("5", "2024-01-15T14:30:00Z"),
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.peakHour).toBe(9);
      expect(result.peakWeekday).toBe(1); // Monday
    });

    it("SHALL identify the weekday with the highest transaction count", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-14T10:00:00Z"), // Sunday
        makeTransaction("2", "2024-01-16T10:00:00Z"), // Tuesday
        makeTransaction("3", "2024-01-16T11:00:00Z"), // Tuesday
        makeTransaction("4", "2024-01-16T12:00:00Z"), // Tuesday
        makeTransaction("5", "2024-01-18T10:00:00Z"), // Thursday
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.peakWeekday).toBe(2); // Tuesday
    });

    it("SHALL use lowest-index tie-breaking for peak hour", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-15T10:00:00Z"),
        makeTransaction("2", "2024-01-15T14:00:00Z"),
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.peakHour).toBe(10); // 10 < 14, lower index wins
    });

    it("SHALL use lowest-index tie-breaking for peak weekday", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("1", "2024-01-14T10:00:00Z"), // Sunday (0)
        makeTransaction("2", "2024-01-20T10:00:00Z"), // Saturday (6)
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.peakWeekday).toBe(0); // Sunday < Saturday, lower index wins
    });
  });

  // R6: Analytical correctness with realistic dataset
  describe("R6: analytical correctness", () => {
    it("SHALL produce correct distribution for a realistic week of data", () => {
      // Simulate a busy coffee shop: morning rush (8-9am) and lunch (12-1pm)
      // Busiest day: Wednesday
      const transactions: TransactionRecord[] = [
        // Monday (2024-01-15)
        makeTransaction("m1", "2024-01-15T08:00:00Z"),
        makeTransaction("m2", "2024-01-15T08:30:00Z"),
        makeTransaction("m3", "2024-01-15T12:00:00Z"),
        // Tuesday (2024-01-16)
        makeTransaction("t1", "2024-01-16T08:00:00Z"),
        makeTransaction("t2", "2024-01-16T09:00:00Z"),
        makeTransaction("t3", "2024-01-16T12:00:00Z"),
        makeTransaction("t4", "2024-01-16T12:30:00Z"),
        // Wednesday (2024-01-17) — busiest day
        makeTransaction("w1", "2024-01-17T08:00:00Z"),
        makeTransaction("w2", "2024-01-17T08:15:00Z"),
        makeTransaction("w3", "2024-01-17T08:30:00Z"),
        makeTransaction("w4", "2024-01-17T09:00:00Z"),
        makeTransaction("w5", "2024-01-17T12:00:00Z"),
        makeTransaction("w6", "2024-01-17T12:30:00Z"),
        makeTransaction("w7", "2024-01-17T12:45:00Z"),
        // Thursday (2024-01-18)
        makeTransaction("th1", "2024-01-18T08:00:00Z"),
        makeTransaction("th2", "2024-01-18T12:00:00Z"),
        // Friday (2024-01-19)
        makeTransaction("f1", "2024-01-19T08:00:00Z"),
        makeTransaction("f2", "2024-01-19T12:00:00Z"),
      ];

      const result = TrafficService.computeDistribution(transactions);

      expect(result.totalTransactions).toBe(18);

      // Hour distribution: 8am = 8, 9am = 2, 12pm = 8
      expect(result.hours[8]).toBe(8);
      expect(result.hours[9]).toBe(2);
      expect(result.hours[12]).toBe(8);
      expect(result.peakHour).toBe(8); // 8 ties with 12, lower index wins

      // Weekday distribution: Wed(3) = 7 transactions
      expect(result.weekdays[1]).toBe(3); // Monday
      expect(result.weekdays[2]).toBe(4); // Tuesday
      expect(result.weekdays[3]).toBe(7); // Wednesday
      expect(result.weekdays[4]).toBe(2); // Thursday
      expect(result.weekdays[5]).toBe(2); // Friday
      expect(result.peakWeekday).toBe(3); // Wednesday
    });
  });
});
