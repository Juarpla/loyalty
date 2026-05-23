"use client";

import type { PredictionResult } from "@/backend/types/models.type";

export interface PredictiveCardProps {
  prediction: PredictionResult | null;
}

const SHIFT_CONFIG = {
  increasing: {
    color: "emerald",
    bgDot: "bg-emerald-500",
    textColor: "text-emerald-300",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    label: "Increasing",
    summary:
      "Weekend traffic is trending upward. Expect higher visitor counts.",
  },
  decreasing: {
    color: "red",
    bgDot: "bg-red-500",
    textColor: "text-red-300",
    badgeBg: "bg-red-500/15",
    badgeText: "text-red-400",
    badgeBorder: "border-red-500/30",
    label: "Decreasing",
    summary:
      "Weekend traffic is trending downward. Consider promotional actions.",
  },
  stable: {
    color: "amber",
    bgDot: "bg-amber-500",
    textColor: "text-amber-300",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/30",
    label: "Stable",
    summary: "Weekend traffic remains stable. No significant changes expected.",
  },
} as const;

function SkeletonCard() {
  return (
    <div
      data-testid="predictive-card-skeleton"
      className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg"
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="h-4 bg-zinc-800 rounded w-1/3" />
        </div>
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
        <div className="h-3 bg-zinc-800 rounded w-1/4" />
      </div>
    </div>
  );
}

function InactiveCard({ dataSpanDays }: { dataSpanDays: number }) {
  return (
    <div
      data-testid="predictive-card-inactive"
      className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-zinc-500" />
        <h4 className="text-base font-bold text-zinc-300">Predictive Alert</h4>
      </div>
      <p className="text-sm text-zinc-500">
        Insufficient historical data for predictions. Currently tracking{" "}
        <span className="text-zinc-400 font-medium">{dataSpanDays} days</span>{" "}
        of data. At least 30 days required.
      </p>
    </div>
  );
}

function ActiveCard({ prediction }: { prediction: PredictionResult }) {
  const config = SHIFT_CONFIG[prediction.projectedWeekendShift];

  return (
    <div
      data-testid="predictive-card-active"
      className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg relative overflow-hidden"
    >
      <div
        className={`absolute top-[-20%] right-[-10%] w-[30%] h-[50%] blur-[50px] pointer-events-none rounded-full bg-${config.color}-500/5`}
      />

      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${config.bgDot}`} />
          <h4 className="text-base font-bold text-zinc-100">
            Predictive Alert
          </h4>
          <span
            className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText} border ${config.badgeBorder}`}
            data-testid="shift-badge"
          >
            {config.label}
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Based on {prediction.dataSpanDays} days of historical data
        </p>
      </div>

      <p className={`text-sm ${config.textColor} mt-4`}>{config.summary}</p>

      {prediction.weekendRatios.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800/50">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Latest trend</span>
            <span
              className={`font-medium ${config.textColor}`}
              data-testid="latest-trend"
            >
              {prediction.weekendRatios[prediction.weekendRatios.length - 1]
                .percentageChange > 0
                ? "+"
                : ""}
              {
                prediction.weekendRatios[prediction.weekendRatios.length - 1]
                  .percentageChange
              }
              %
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function PredictiveCardComponent({ prediction }: PredictiveCardProps) {
  if (prediction === null || prediction === undefined) {
    return <SkeletonCard />;
  }

  if (prediction.status === "inactive") {
    return <InactiveCard dataSpanDays={prediction.dataSpanDays} />;
  }

  return <ActiveCard prediction={prediction} />;
}
