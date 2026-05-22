"use client";

import type { TrafficDistribution } from "@/backend/types/models.type";
import { HourlyChartComponent } from "./hourly-chart.component";
import { WeekdayChartComponent } from "./weekday-chart.component";

export interface TrafficChartProps {
  data: TrafficDistribution | null;
  loading: boolean;
  error: string | null;
}

export function TrafficChartComponent({
  data,
  loading,
  error,
}: TrafficChartProps) {
  if (error) {
    return (
      <div
        role="alert"
        data-testid="traffic-chart-error"
        className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg"
      >
        <div className="rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        data-testid="traffic-chart-skeleton"
        className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg"
      >
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-zinc-800 rounded w-1/3" />
          <div className="flex items-end justify-between gap-1 h-40 sm:h-48 border-b border-zinc-800/50 pt-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full gap-1"
              >
                <div
                  className="w-full max-w-[16px] sm:max-w-[20px] bg-zinc-800 rounded-t"
                  style={{ height: `${((i % 5) + 3) * 10}%` }}
                />
                <div className="h-2 w-4 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
          <div className="h-4 bg-zinc-800 rounded w-1/4" />
          <div className="flex items-end justify-between gap-2 h-40 sm:h-48 border-b border-zinc-800/50 pt-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full gap-1"
              >
                <div
                  className="w-full max-w-[40px] sm:max-w-[56px] bg-zinc-800 rounded-t"
                  style={{ height: `${((i % 4) + 4) * 10}%` }}
                />
                <div className="h-2 w-6 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg text-sm text-zinc-500">
        No traffic data available.
      </div>
    );
  }

  return (
    <div
      data-testid="traffic-chart"
      className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[50%] bg-indigo-500/5 blur-[50px] pointer-events-none rounded-full" />

      <div className="mb-2">
        <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          Traffic Analytics
        </h4>
        <p className="text-xs text-zinc-500">
          Peak hours and popular weekdays based on transaction volume
        </p>
      </div>

      <div className="flex flex-col gap-8 mt-6">
        <HourlyChartComponent hours={data.hours} peakHour={data.peakHour} />
        <WeekdayChartComponent
          weekdays={data.weekdays}
          peakWeekday={data.peakWeekday}
        />
      </div>
    </div>
  );
}
