"use client";

import { normalizeToPercentages, formatWeekdayLabel } from "./chart.utils";

export interface WeekdayChartProps {
  weekdays: number[];
  peakWeekday: number;
}

export function WeekdayChartComponent({
  weekdays,
  peakWeekday,
}: WeekdayChartProps) {
  const percentages = normalizeToPercentages(weekdays);

  return (
    <div className="w-full">
      <h5 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-400" />
        Weekday Traffic
      </h5>
      <div className="flex items-end justify-between gap-2 h-40 sm:h-48 pt-4 relative border-b border-zinc-800/50">
        {percentages.map((pct, index) => {
          const isPeak = index === peakWeekday;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full relative"
              data-testid={`weekday-bar-${index}`}
            >
              <div
                style={{ height: `${pct}%` }}
                className={`w-full max-w-[40px] sm:max-w-[56px] rounded-t transition-all duration-300 ${
                  isPeak
                    ? "bg-purple-400"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              />
              <span className="text-[10px] sm:text-xs font-medium text-zinc-500 mt-2">
                {formatWeekdayLabel(index)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
