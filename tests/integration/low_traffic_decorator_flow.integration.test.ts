import { describe, it, expect } from "vitest";
import { decorate } from "../../src/backend/services/social-prompt.decorator";
import { TransactionRecord } from "../../src/backend/types/models.type";

/**
 * Helper to build a TransactionRecord for tests.
 */
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

const TEST_PROMPT = "Create a social media post about our weekend specials.";

/**
 * Builds a transaction array where one weekday has historically low traffic.
 * Monday (weekday=1) has 1 transaction; Tuesday-Sunday have 10 each.
 * Average = (1 + 10*6) / 7 = 61/7 ≈ 8.71
 * Threshold = 8.71 * 0.5 = 4.36
 * Monday count (1) < 4.36 → low traffic
 */
function buildLowTrafficMondays(): TransactionRecord[] {
  const transactions: TransactionRecord[] = [];

  // Monday: 1 transaction
  transactions.push(makeTransaction("m1", "2024-01-01T10:00:00Z"));

  // Tuesday through Sunday: 10 each
  const weekdays = [
    { id: "tue", date: "2024-01-02" },
    { id: "wed", date: "2024-01-03" },
    { id: "thu", date: "2024-01-04" },
    { id: "fri", date: "2024-01-05" },
    { id: "sat", date: "2024-01-06" },
    { id: "sun", date: "2024-01-07" },
  ];

  for (const day of weekdays) {
    for (let i = 0; i < 10; i++) {
      transactions.push(
        makeTransaction(`${day.id}-${i}`, `${day.date}T10:00:00Z`),
      );
    }
  }

  return transactions;
}

/**
 * Builds an evenly-distributed transaction array.
 * All weekdays have exactly 10 transactions.
 * Average = 10, Threshold = 10 * 0.5 = 5
 * Any day with 10 >= 5 → not low traffic
 */
function buildEvenTraffic(): TransactionRecord[] {
  const transactions: TransactionRecord[] = [];
  const dates = [
    "2024-01-01", // Mon
    "2024-01-02", // Tue
    "2024-01-03", // Wed
    "2024-01-04", // Thu
    "2024-01-05", // Fri
    "2024-01-06", // Sat
    "2024-01-07", // Sun
  ];

  for (const date of dates) {
    for (let i = 0; i < 10; i++) {
      transactions.push(
        makeTransaction(`${date}-${i}`, `${date}T10:00:00Z`),
      );
    }
  }

  return transactions;
}

const FLASH_SALE_MARKER = "[Oferta Relámpago]";

describe("social-prompt.decorator decorate()", () => {
  // =========================================================================
  // R1: Low-traffic weekday → flash sale text is appended
  // =========================================================================
  describe("R1: low-traffic day injects flash sale text", () => {
    it("R1: SHALL append flash sale injection when target weekday is low-traffic", () => {
      const transactions = buildLowTrafficMondays();
      const mondayDate = new Date("2024-01-01T10:00:00Z");

      const result = decorate(TEST_PROMPT, transactions, mondayDate);

      expect(result).toContain(TEST_PROMPT);
      expect(result).toContain(FLASH_SALE_MARKER);
      expect(result.length).toBeGreaterThan(TEST_PROMPT.length);
    });

    it("R1: SHALL include urgency phrases in the appended injection text", () => {
      const transactions = buildLowTrafficMondays();
      const mondayDate = new Date("2024-01-01T10:00:00Z");

      const result = decorate(TEST_PROMPT, transactions, mondayDate);

      // The injection text should contain flash sale language
      expect(result).toContain("flash sale");
      expect(result).toContain("limited-time");
    });
  });

  // =========================================================================
  // R2: Normal-traffic weekday → prompt unchanged
  // =========================================================================
  describe("R2: normal-traffic weekday returns prompt unchanged", () => {
    it("R2: SHALL return prompt unchanged when target weekday has average traffic", () => {
      const transactions = buildEvenTraffic();
      const mondayDate = new Date("2024-01-01T10:00:00Z");

      const result = decorate(TEST_PROMPT, transactions, mondayDate);

      expect(result).toBe(TEST_PROMPT);
    });

    it("R2: SHALL return prompt unchanged when target weekday has above-average traffic", () => {
      // Build data where Tuesday has more traffic than other days
      const transactions: TransactionRecord[] = [];

      // Monday: 2 transactions
      for (let i = 0; i < 2; i++) {
        transactions.push(
          makeTransaction(`mon-${i}`, "2024-01-01T10:00:00Z"),
        );
      }
      // Tuesday: 15 transactions (way above average)
      for (let i = 0; i < 15; i++) {
        transactions.push(
          makeTransaction(`tue-${i}`, "2024-01-02T10:00:00Z"),
        );
      }
      // Rest: 2 each
      const restDays = [
        { id: "wed", date: "2024-01-03" },
        { id: "thu", date: "2024-01-04" },
        { id: "fri", date: "2024-01-05" },
        { id: "sat", date: "2024-01-06" },
        { id: "sun", date: "2024-01-07" },
      ];
      for (const day of restDays) {
        for (let i = 0; i < 2; i++) {
          transactions.push(
            makeTransaction(`${day.id}-${i}`, `${day.date}T10:00:00Z`),
          );
        }
      }

      const tuesdayDate = new Date("2024-01-02T10:00:00Z");
      const result = decorate(TEST_PROMPT, transactions, tuesdayDate);

      expect(result).toBe(TEST_PROMPT);
    });
  });

  // =========================================================================
  // R3: Empty transactions array → prompt unchanged
  // =========================================================================
  describe("R3: empty transactions returns prompt unchanged", () => {
    it("R3: SHALL return prompt unchanged when transactions array is empty", () => {
      const result = decorate(TEST_PROMPT, []);

      expect(result).toBe(TEST_PROMPT);
    });

    it("R3: SHALL return prompt unchanged even with an explicit date and empty transactions", () => {
      const result = decorate(
        TEST_PROMPT,
        [],
        new Date("2024-01-01T10:00:00Z"),
      );

      expect(result).toBe(TEST_PROMPT);
    });
  });

  // =========================================================================
  // R4: Custom date parameter routes traffic analysis correctly
  // =========================================================================
  describe("R4: custom date parameter routes traffic analysis", () => {
    it("R4: SHALL use provided date to evaluate traffic and append flash sale on low-traffic day", () => {
      const transactions = buildLowTrafficMondays();

      // Explicit Monday date — should detect low traffic
      const mondayDate = new Date("2024-01-01T10:00:00Z");
      const result = decorate(TEST_PROMPT, transactions, mondayDate);

      expect(result).toContain(FLASH_SALE_MARKER);
    });

    it("R4: SHALL return prompt unchanged when provided date is a normal-traffic day", () => {
      const transactions = buildLowTrafficMondays();

      // Tuesday has 10 transactions — not low traffic
      const tuesdayDate = new Date("2024-01-02T10:00:00Z");
      const result = decorate(TEST_PROMPT, transactions, tuesdayDate);

      expect(result).toBe(TEST_PROMPT);
    });
  });

  // =========================================================================
  // R5: All-invalid timestamps → prompt unchanged
  // =========================================================================
  describe("R5: all-invalid timestamps returns prompt unchanged", () => {
    it("R5: SHALL return prompt unchanged when all created_at values are unparseable", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("bad1", "not-a-date"),
        makeTransaction("bad2", ""),
        makeTransaction("bad3", "invalid-date-string"),
      ];

      const result = decorate(TEST_PROMPT, transactions);

      expect(result).toBe(TEST_PROMPT);
    });

    it("R5: SHALL NOT throw when transactions contain unparseable timestamps", () => {
      const transactions: TransactionRecord[] = [
        makeTransaction("bad1", "not-a-date"),
      ];

      expect(() =>
        decorate(TEST_PROMPT, transactions),
      ).not.toThrow();
    });
  });
});
