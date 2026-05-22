"use client";

import { normalizeToPercentages, formatHourLabel } from "./chart.utils";

export interface HourlyChartProps {
  hours: number[];
  peakHour: number;
}

export function HourlyChartComponent({ hours, peakHour }: HourlyChartProps) {
  const percentages = normalizeToPercentages(hours);

  return (
    <div className="w-full">
      <h5 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-400" />
        Hourly Traffic
      </h5>
      <div className="flex items-end justify-between gap-1 h-40 sm:h-48 pt-4 relative border-b border-zinc-800/50">
        {percentages.map((pct, index) => {
          const isPeak = index === peakHour;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full relative"
              data-testid={`hourly-bar-${index}`}
            >
              <div
                style={{ height: `${pct}%` }}
                className={`w-full max-w-[16px] sm:max-w-[20px] rounded-t transition-all duration-300 ${
                  isPeak
                    ? "bg-indigo-400"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              />
              <span className="text-[9px] sm:text-[10px] font-medium text-zinc-500 mt-1.5 truncate w-full text-center">
                {formatHourLabel(index)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
