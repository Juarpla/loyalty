import {
  TransactionRecord,
  PredictionResult,
  WeekVisitCount,
  WeekendRatio,
} from "../types/models.type";

const MIN_DATA_SPAN_DAYS = 30;
const SHIFT_THRESHOLD_PERCENT = 5;

/**
 * Pure backend service computing week-over-week visit ratios
 * and weekend alert projections. No database or HTTP dependencies —
 * receives input, returns computed output.
 */
export class PredictionService {
  /**
   * Predicts weekend traffic shifts based on historical transaction data.
   * Returns an active prediction with projections when data spans >= 30 days,
   * or an inactive result when data is insufficient.
   */
  static predict(transactions: TransactionRecord[]): PredictionResult {
    // R7: Empty dataset returns inactive immediately
    if (transactions.length === 0) {
      return {
        status: "inactive",
        dataSpanDays: 0,
        weekVisits: [],
        weekendRatios: [],
        projectedWeekendShift: "stable",
      };
    }

    // Filter out invalid timestamps (R6)
    const validTransactions = transactions.filter((tx) => {
      const date = new Date(tx.created_at);
      return !isNaN(date.getTime());
    });

    // R7: All invalid timestamps => treat as empty
    if (validTransactions.length === 0) {
      return {
        status: "inactive",
        dataSpanDays: 0,
        weekVisits: [],
        weekendRatios: [],
        projectedWeekendShift: "stable",
      };
    }

    // R5: Compute data span in days
    const timestamps = validTransactions.map(
      (tx) => new Date(tx.created_at).getTime(),
    );
    const earliest = Math.min(...timestamps);
    const latest = Math.max(...timestamps);
    const dataSpanDays = Math.floor(
      (latest - earliest) / (1000 * 60 * 60 * 24),
    );

    // R2: Data span < 30 days returns inactive
    if (dataSpanDays < MIN_DATA_SPAN_DAYS) {
      return {
        status: "inactive",
        dataSpanDays,
        weekVisits: [],
        weekendRatios: [],
        projectedWeekendShift: "stable",
      };
    }

    // R3: Group transactions by ISO calendar week
    const weekMap = new Map<string, TransactionRecord[]>();

    for (const tx of validTransactions) {
      const date = new Date(tx.created_at);
      const isoWeek = getISOWeek(date);
      const key = `${isoWeek.year}-W${String(isoWeek.week).padStart(2, "0")}`;

      if (!weekMap.has(key)) {
        weekMap.set(key, []);
      }
      weekMap.get(key)!.push(tx);
    }

    // Sort weeks chronologically
    const sortedWeekKeys = Array.from(weekMap.keys()).sort();

    // R3: Build WeekVisitCount entries
    const weekVisits: WeekVisitCount[] = sortedWeekKeys.map((key) => {
      const weekTxs = weekMap.get(key)!;
      let weekendVisits = 0;

      for (const tx of weekTxs) {
        const date = new Date(tx.created_at);
        const day = date.getUTCDay();
        // Saturday = 6, Sunday = 0
        if (day === 0 || day === 6) {
          weekendVisits++;
        }
      }

      const weekDates = weekTxs.map(
        (tx) => new Date(tx.created_at).getTime(),
      );
      const weekStart = new Date(Math.min(...weekDates));
      const weekEnd = new Date(Math.max(...weekDates));

      return {
        weekLabel: key,
        weekStart: weekStart.toISOString().split("T")[0],
        weekEnd: weekEnd.toISOString().split("T")[0],
        totalVisits: weekTxs.length,
        weekendVisits,
      };
    });

    // R4: Compute consecutive weekend visit ratios
    const weekendRatios: WeekendRatio[] = [];

    for (let i = 1; i < weekVisits.length; i++) {
      const current = weekVisits[i];
      const previous = weekVisits[i - 1];

      let visitRatio: number;
      let percentageChange: number;

      if (previous.weekendVisits === 0) {
        // R4: Division by zero => record 0
        visitRatio = 0;
        percentageChange = 0;
      } else {
        visitRatio = current.weekendVisits / previous.weekendVisits;
        percentageChange =
          Math.round(
            ((current.weekendVisits - previous.weekendVisits) /
              previous.weekendVisits) *
              100 *
              100,
          ) / 100;
      }

      weekendRatios.push({
        currentWeek: current.weekLabel,
        previousWeek: previous.weekLabel,
        visitRatio,
        percentageChange,
      });
    }

    // R8: Determine projected weekend shift direction
    let projectedWeekendShift: "increasing" | "decreasing" | "stable" =
      "stable";

    if (weekendRatios.length >= 2) {
      const latestRatio = weekendRatios[weekendRatios.length - 1];
      if (latestRatio.percentageChange > SHIFT_THRESHOLD_PERCENT) {
        projectedWeekendShift = "increasing";
      } else if (latestRatio.percentageChange < -SHIFT_THRESHOLD_PERCENT) {
        projectedWeekendShift = "decreasing";
      }
    }

    // R1: Active prediction result
    return {
      status: "active",
      dataSpanDays,
      weekVisits,
      weekendRatios,
      projectedWeekendShift,
    };
  }
}

/**
 * Computes the ISO 8601 year and week number for a given date.
 * ISO weeks start on Monday. Week 1 contains the year's first Thursday.
 */
function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  // Set to nearest Thursday (ISO week numbering)
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { year: d.getUTCFullYear(), week: weekNumber };
}