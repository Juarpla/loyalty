import { describe, it, expect } from "vitest";
import {
  normalizeToPercentages,
  findPeakIndex,
  formatHourLabel,
  formatWeekdayLabel,
} from "../../src/components/traffic/chart.utils";

describe("component_traffic_charts Integration Tests", () => {
  describe("R1, R2, R10: normalizeToPercentages", () => {
    it("R1: SHALL scale values to percentages relative to the maximum", () => {
      const values = [10, 20, 30, 40, 50];
      const result = normalizeToPercentages(values);
      expect(result).toEqual([20, 40, 60, 80, 100]);
    });

    it("R1: SHALL return all zeros when the maximum is zero", () => {
      const values = [0, 0, 0];
      const result = normalizeToPercentages(values);
      expect(result).toEqual([0, 0, 0]);
    });

    it("R1: SHALL handle a single value returning [100]", () => {
      const values = [42];
      const result = normalizeToPercentages(values);
      expect(result).toEqual([100]);
    });

    it("R1: SHALL handle 24-hour distribution arrays", () => {
      const values = new Array(24).fill(0);
      values[8] = 15;
      values[12] = 30;
      values[18] = 10;
      const result = normalizeToPercentages(values);
      expect(result).toHaveLength(24);
      expect(result[8]).toBe(50);
      expect(result[12]).toBe(100);
      expect(result[18]).toBeCloseTo(33.33, 2);
    });
  });

  describe("R3, R4, R10: findPeakIndex", () => {
    it("R3: SHALL return the index of the highest value", () => {
      const values = [5, 10, 3, 8];
      expect(findPeakIndex(values)).toBe(1);
    });

    it("R3: SHALL use lowest-index tie-breaking", () => {
      const values = [10, 10, 10];
      expect(findPeakIndex(values)).toBe(0);
    });

    it("R4: SHALL return 0 for a single-element array", () => {
      expect(findPeakIndex([42])).toBe(0);
    });

    it("R3: SHALL return -1 for an empty array", () => {
      expect(findPeakIndex([])).toBe(-1);
    });

    it("R3: SHALL correctly identify peak hour in 24-hour data", () => {
      const hours = new Array(24).fill(0);
      hours[14] = 50;
      hours[8] = 30;
      expect(findPeakIndex(hours)).toBe(14);
    });

    it("R4: SHALL correctly identify peak weekday in 7-day data", () => {
      const weekdays = [5, 10, 15, 20, 12, 8, 3];
      expect(findPeakIndex(weekdays)).toBe(3);
    });
  });

  describe("R1, R2, R10: formatHourLabel", () => {
    it("R1: SHALL format midnight as 0h", () => {
      expect(formatHourLabel(0)).toBe("0h");
    });

    it("R1: SHALL format noon as 12h", () => {
      expect(formatHourLabel(12)).toBe("12h");
    });

    it("R1: SHALL format 23 as 23h", () => {
      expect(formatHourLabel(23)).toBe("23h");
    });
  });

  describe("R1, R2, R10: formatWeekdayLabel", () => {
    it("R2: SHALL map 0 to Sun", () => {
      expect(formatWeekdayLabel(0)).toBe("Sun");
    });

    it("R2: SHALL map 6 to Sat", () => {
      expect(formatWeekdayLabel(6)).toBe("Sat");
    });

    it("R2: SHALL map 3 to Wed", () => {
      expect(formatWeekdayLabel(3)).toBe("Wed");
    });

    it("R2: SHALL return empty string for out-of-range index", () => {
      expect(formatWeekdayLabel(7)).toBe("");
    });
  });
});
