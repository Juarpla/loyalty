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

describe("TrafficService.isLowTrafficDay", () => {
  // R1+R2: Identify a low-traffic weekday
  describe("R1, R2: low-traffic weekday detection", () => {
    it("SHALL return true when target weekday has historically below-threshold traffic", () => {
      // Monday (weekday=1) has 1 transaction; other days have 10 each
      // Average = (1 + 10*6) / 7 = 61/7 ≈ 8.71
      // Threshold: 8.71 * 0.5 = 4.36
      // Monday count (1) < 4.36 → true
      const transactions: TransactionRecord[] = [
        // Mondays
        makeTransaction("m1", "2024-01-01T10:00:00Z"), // Mon
        // Tuesdays
        makeTransaction("t1", "2024-01-02T10:00:00Z"),
        makeTransaction("t2", "2024-01-02T11:00:00Z"),
        makeTransaction("t3", "2024-01-02T12:00:00Z"),
        makeTransaction("t4", "2024-01-02T13:00:00Z"),
        makeTransaction("t5", "2024-01-02T14:00:00Z"),
        makeTransaction("t6", "2024-01-02T15:00:00Z"),
        makeTransaction("t7", "2024-01-02T16:00:00Z"),
        makeTransaction("t8", "2024-01-02T17:00:00Z"),
        makeTransaction("t9", "2024-01-02T18:00:00Z"),
        makeTransaction("t10", "2024-01-02T19:00:00Z"),
        // Wednesdays
        makeTransaction("w1", "2024-01-03T10:00:00Z"),
        makeTransaction("w2", "2024-01-03T11:00:00Z"),
        makeTransaction("w3", "2024-01-03T12:00:00Z"),
        makeTransaction("w4", "2024-01-03T13:00:00Z"),
        makeTransaction("w5", "2024-01-03T14:00:00Z"),
        makeTransaction("w6", "2024-01-03T15:00:00Z"),
        makeTransaction("w7", "2024-01-03T16:00:00Z"),
        makeTransaction("w8", "2024-01-03T17:00:00Z"),
        makeTransaction("w9", "2024-01-03T18:00:00Z"),
        makeTransaction("w10", "2024-01-03T19:00:00Z"),
        // Thursdays
        makeTransaction("th1", "2024-01-04T10:00:00Z"),
        makeTransaction("th2", "2024-01-04T11:00:00Z"),
        makeTransaction("th3", "2024-01-04T12:00:00Z"),
        makeTransaction("th4", "2024-01-04T13:00:00Z"),
        makeTransaction("th5", "2024-01-04T14:00:00Z"),
        makeTransaction("th6", "2024-01-04T15:00:00Z"),
        makeTransaction("th7", "2024-01-04T16:00:00Z"),
        makeTransaction("th8", "2024-01-04T17:00:00Z"),
        makeTransaction("th9", "2024-01-04T18:00:00Z"),
        makeTransaction("th10", "2024-01-04T19:00:00Z"),
        // Fridays
        makeTransaction("f1", "2024-01-05T10:00:00Z"),
        makeTransaction("f2", "2024-01-05T11:00:00Z"),
        makeTransaction("f3", "2024-01-05T12:00:00Z"),
        makeTransaction("f4", "2024-01-05T13:00:00Z"),
        makeTransaction("f5", "2024-01-05T14:00:00Z"),
        makeTransaction("f6", "2024-01-05T15:00:00Z"),
        makeTransaction("f7", "2024-01-05T16:00:00Z"),
        makeTransaction("f8", "2024-01-05T17:00:00Z"),
        makeTransaction("f9", "2024-01-05T18:00:00Z"),
        makeTransaction("f10", "2024-01-05T19:00:00Z"),
        // Saturdays
        makeTransaction("s1", "2024-01-06T10:00:00Z"),
        makeTransaction("s2", "2024-01-06T11:00:00Z"),
        makeTransaction("s3", "2024-01-06T12:00:00Z"),
        makeTransaction("s4", "2024-01-06T13:00:00Z"),
        makeTransaction("s5", "2024-01-06T14:00:00Z"),
        makeTransaction("s6", "2024-01-06T15:00:00Z"),
        makeTransaction("s7", "2024-01-06T16:00:00Z"),
        makeTransaction("s8", "2024-01-06T17:00:00Z"),
        makeTransaction("s9", "2024-01-06T18:00:00Z"),
        makeTransaction("s10", "2024-01-06T19:00:00Z"),
        // Sundays
        makeTransaction("su1", "2024-01-07T10:00:00Z"),
        makeTransaction("su2", "2024-01-07T11:00:00Z"),
        makeTransaction("su3", "2024-01-07T12:00:00Z"),
        makeTransaction("su4", "2024-01-07T13:00:00Z"),
        makeTransaction("su5", "2024-01-07T14:00:00Z"),
        makeTransaction("su6", "2024-01-07T15:00:00Z"),
        makeTransaction("su7", "2024-01-07T16:00:00Z"),
        makeTransaction("su8", "2024-01-07T17:00:00Z"),
        makeTransaction("su9", "2024-01-07T18:00:00Z"),
        makeTransaction("su10", "2024-01-07T19:00:00Z"),
      ];

      // Query a Monday — should be low traffic
      const mondayDate = new Date("2024-01-01T10:00:00Z");
      const result = TrafficService.isLowTrafficDay(mondayDate, transactions);

      expect(result).toBe(true);
    });
  });

  // R3: Normal-traffic weekday returns false
  describe("R3: normal-traffic weekday", () => {
    it("SHALL return false when target weekday has average or above traffic", () => {
      // All weekdays have exactly 10 transactions each
      // Average = 10, Threshold: 10 * 0.5 = 5
      // Any day with 10 >= 5 → false
      const transactions: TransactionRecord[] = [];
      for (let day = 1; day <= 7; day++) {
        const date = new Date(`2024-01-0${day}T10:00:00Z`);
        for (let i = 0; i < 10; i++) {
          transactions.push(
            makeTransaction(`${day}-${i}`, date.toISOString()),
          );
        }
      }

      // Query any day — should not be low traffic
      const targetDate = new Date("2024-01-01T10:00:00Z"); // Monday
      const result = TrafficService.isLowTrafficDay(targetDate, transactions);

      expect(result).toBe(false);
    });

    it("SHALL return false on a day with more transactions than the threshold cutoff", () => {
      // Tuesday has 15 transactions, rest have 2 each
      // Average = (15 + 2*6) / 7 = 27/7 ≈ 3.86
      // Threshold: 3.86 * 0.5 = 1.93
      // Tuesday (15) >= 1.93 → false
      const transactions: TransactionRecord[] = [
        // Tuesday: 15 transactions
        ...Array.from({ length: 15 }, (_, i) =>
          makeTransaction(`tue-${i}`, "2024-01-02T10:00:00Z"),
        ),
        // Other days: 2 each
        ...Array.from({ length: 2 }, (_, i) =>
          makeTransaction(`mon-${i}`, "2024-01-01T10:00:00Z"),
        ),
        ...Array.from({ length: 2 }, (_, i) =>
          makeTransaction(`wed-${i}`, "2024-01-03T10:00:00Z"),
        ),
        ...Array.from({ length: 2 }, (_, i) =>
          makeTransaction(`thu-${i}`, "2024-01-04T10:00:00Z"),
        ),
        ...Array.from({ length: 2 }, (_, i) =>
          makeTransaction(`fri-${i}`, "2024-01-05T10:00:00Z"),
        ),
        ...Array.from({ length: 2 }, (_, i) =>
          makeTransaction(`sat-${i}`, "2024-01-06T10:00:00Z"),
        ),
        ...Array.from({ length: 2 }, (_, i) =>
          makeTransaction(`sun-${i}`, "2024-01-07T10:00:00Z"),
        ),
      ];

      const tuesdayDate = new Date("2024-01-02T10:00:00Z");
      const result = TrafficService.isLowTrafficDay(tuesdayDate, transactions);

      expect(result).toBe(false);
    });
  });

  // R4: Threshold parameter influences detection
  describe("R4: configurable threshold", () => {
    it("SHALL use a more sensitive threshold (higher value) to detect more low-traffic days", () => {
      // Monday has 5 transactions, others have 10 each
      // Average = (5 + 10*6) / 7 = 65/7 ≈ 9.29
      // With threshold 1.0: 5 < 9.29 * 1.0 = 9.29 → true
      // With default threshold 0.5: 5 < 9.29 * 0.5 = 4.64 → false
      const transactions: TransactionRecord[] = [];
      // Monday: 5
      for (let i = 0; i < 5; i++) {
        transactions.push(
          makeTransaction(`mon-${i}`, "2024-01-01T10:00:00Z"),
        );
      }
      // Other days: 10 each
      for (let day = 2; day <= 7; day++) {
        const date = new Date(`2024-01-0${day}T10:00:00Z`);
        for (let i = 0; i < 10; i++) {
          transactions.push(
            makeTransaction(`${day}-${i}`, date.toISOString()),
          );
        }
      }

      const mondayDate = new Date("2024-01-01T10:00:00Z");

      // With default threshold 0.5, Monday (5) >= 9.29 * 0.5 = 4.64 → false
      const resultDefault = TrafficService.isLowTrafficDay(
        mondayDate,
        transactions,
      );
      expect(resultDefault).toBe(false);

      // With threshold 1.0, Monday (5) < 9.29 * 1.0 = 9.29 → true
      const resultHigh = TrafficService.isLowTrafficDay(
        mondayDate,
        transactions,
        1.0,
      );
      expect(resultHigh).toBe(true);

      // With threshold 0.1, Monday (5) >= 9.29 * 0.1 = 0.93 → false
      const resultLow = TrafficService.isLowTrafficDay(
        mondayDate,
        transactions,
        0.1,
      );
      expect(resultLow).toBe(false);
    });
  });

  // R5: Empty input handling
  describe("R5: empty transaction array", () => {
    it("SHALL return false when no transactions are provided", () => {
      const result = TrafficService.isLowTrafficDay(
        new Date("2024-01-01T10:00:00Z"),
        [],
      );

      expect(result).toBe(false);
    });
  });

  // R6: Invalid timestamp handling
  describe("R6: invalid timestamp handling", () => {
    it("SHALL skip records with unparseable timestamps without throwing", () => {
      // Monday has 1 valid transaction; other days have 10 valid each
      // Plus some invalid timestamps that should be skipped
      const transactions: TransactionRecord[] = [
        // Valid Monday
        makeTransaction("m1", "2024-01-01T10:00:00Z"),
        // Invalid entries
        makeTransaction("bad1", "not-a-date"),
        makeTransaction("bad2", ""),
        makeTransaction("bad3", "invalid"),
        // Valid other days
        ...Array.from({ length: 10 }, (_, i) =>
          makeTransaction(`tue-${i}`, "2024-01-02T10:00:00Z"),
        ),
        ...Array.from({ length: 10 }, (_, i) =>
          makeTransaction(`wed-${i}`, "2024-01-03T10:00:00Z"),
        ),
        ...Array.from({ length: 10 }, (_, i) =>
          makeTransaction(`thu-${i}`, "2024-01-04T10:00:00Z"),
        ),
        ...Array.from({ length: 10 }, (_, i) =>
          makeTransaction(`fri-${i}`, "2024-01-05T10:00:00Z"),
        ),
        ...Array.from({ length: 10 }, (_, i) =>
          makeTransaction(`sat-${i}`, "2024-01-06T10:00:00Z"),
        ),
        ...Array.from({ length: 10 }, (_, i) =>
          makeTransaction(`sun-${i}`, "2024-01-07T10:00:00Z"),
        ),
      ];

      const mondayDate = new Date("2024-01-01T10:00:00Z");
      // Should not throw, invalid records are skipped
      expect(() =>
        TrafficService.isLowTrafficDay(mondayDate, transactions),
      ).not.toThrow();

      // Monday has only 1 valid transaction out of 61 valid ones
      // Average = 61/7 ≈ 8.71, threshold = 8.71 * 0.5 = 4.36
      // Monday count (1) < 4.36 → true (low traffic)
      const result = TrafficService.isLowTrafficDay(mondayDate, transactions);
      expect(result).toBe(true);
    });

    it("SHALL return false when ALL timestamps are invalid", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("bad1", "not-a-date"),
        makeTransaction("bad2", "also-invalid"),
        makeTransaction("bad3", ""),
      ];

      const result = TrafficService.isLowTrafficDay(
        new Date("2024-01-01T10:00:00Z"),
        transactions,
      );

      expect(result).toBe(false);
    });
  });
});
