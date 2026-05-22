/**
 * Pure helper functions for traffic chart rendering.
 */

export function normalizeToPercentages(values: number[]): number[] {
  const max = Math.max(...values);
  if (max === 0) {
    return values.map(() => 0);
  }
  return values.map((v) => (v / max) * 100);
}

export function findPeakIndex(values: number[]): number {
  if (values.length === 0) {
    return -1;
  }

  let peakIndex = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[peakIndex]) {
      peakIndex = i;
    }
  }
  return peakIndex;
}

export function formatHourLabel(hour: number): string {
  return `${hour}h`;
}

export function formatWeekdayLabel(index: number): string {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return labels[index] ?? "";
}
