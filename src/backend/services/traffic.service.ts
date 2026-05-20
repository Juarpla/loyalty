import { TransactionRecord, TrafficDistribution } from "../types/models.type";

const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

/**
 * Pure backend service computing hourly and weekday transaction distributions.
 * No database or HTTP dependencies — receives input, returns computed output.
 */
export class TrafficService {
  /**
   * Computes traffic distribution from an array of transaction records.
   * Groups transactions by hour (0-23) and weekday (0=Sunday through 6=Saturday).
   * Invalid timestamps are silently skipped. Empty input returns zeroed buckets.
   * Tie-breaking for peak hour/weekday: lowest index wins.
   */
  static computeDistribution(
    transactions: TransactionRecord[],
  ): TrafficDistribution {
    const hours = new Array(HOURS_IN_DAY).fill(0) as number[];
    const weekdays = new Array(DAYS_IN_WEEK).fill(0) as number[];
    let totalTransactions = 0;

    for (const tx of transactions) {
      const date = new Date(tx.created_at);
      if (isNaN(date.getTime())) {
        continue;
      }

      const hour = date.getUTCHours();
      const weekday = date.getUTCDay();

      hours[hour]++;
      weekdays[weekday]++;
      totalTransactions++;
    }

    const peakHour = findPeakIndex(hours);
    const peakWeekday = findPeakIndex(weekdays);

    return {
      hours,
      weekdays,
      peakHour,
      peakWeekday,
      totalTransactions,
    };
  }
}

/**
 * Returns the index of the highest value in the array.
 * When values tie, the lowest index wins (deterministic, no extra logic).
 */
function findPeakIndex(buckets: number[]): number {
  let peakIndex = 0;
  let peakValue = buckets[0];

  for (let i = 1; i < buckets.length; i++) {
    if (buckets[i] > peakValue) {
      peakValue = buckets[i];
      peakIndex = i;
    }
  }

  return peakIndex;
}
