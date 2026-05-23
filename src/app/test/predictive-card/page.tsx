"use client";

import { useState } from "react";
import {
  PredictiveCardComponent,
  type PredictiveCardProps,
} from "@/components/dashboard/predictive-card.component";
import type { PredictionResult } from "@/backend/types/models.type";

const MOCK_ACTIVE_INCREASING: PredictionResult = {
  status: "active",
  dataSpanDays: 45,
  weekVisits: [
    {
      weekLabel: "2026-W01",
      weekStart: "2026-01-05",
      weekEnd: "2026-01-11",
      totalVisits: 20,
      weekendVisits: 8,
    },
    {
      weekLabel: "2026-W02",
      weekStart: "2026-01-12",
      weekEnd: "2026-01-18",
      totalVisits: 25,
      weekendVisits: 12,
    },
  ],
  weekendRatios: [
    {
      currentWeek: "2026-W02",
      previousWeek: "2026-W01",
      visitRatio: 1.5,
      percentageChange: 50,
    },
  ],
  projectedWeekendShift: "increasing",
};

const MOCK_ACTIVE_DECREASING: PredictionResult = {
  status: "active",
  dataSpanDays: 60,
  weekVisits: [
    {
      weekLabel: "2026-W01",
      weekStart: "2026-01-05",
      weekEnd: "2026-01-11",
      totalVisits: 30,
      weekendVisits: 15,
    },
    {
      weekLabel: "2026-W02",
      weekStart: "2026-01-12",
      weekEnd: "2026-01-18",
      totalVisits: 20,
      weekendVisits: 8,
    },
  ],
  weekendRatios: [
    {
      currentWeek: "2026-W02",
      previousWeek: "2026-W01",
      visitRatio: 0.53,
      percentageChange: -46.67,
    },
  ],
  projectedWeekendShift: "decreasing",
};

const MOCK_ACTIVE_STABLE: PredictionResult = {
  status: "active",
  dataSpanDays: 50,
  weekVisits: [
    {
      weekLabel: "2026-W01",
      weekStart: "2026-01-05",
      weekEnd: "2026-01-11",
      totalVisits: 20,
      weekendVisits: 10,
    },
    {
      weekLabel: "2026-W02",
      weekStart: "2026-01-12",
      weekEnd: "2026-01-18",
      totalVisits: 21,
      weekendVisits: 10,
    },
  ],
  weekendRatios: [
    {
      currentWeek: "2026-W02",
      previousWeek: "2026-W01",
      visitRatio: 1.0,
      percentageChange: 0,
    },
  ],
  projectedWeekendShift: "stable",
};

const MOCK_INACTIVE: PredictionResult = {
  status: "inactive",
  dataSpanDays: 15,
  weekVisits: [],
  weekendRatios: [],
  projectedWeekendShift: "stable",
};

const SCENARIOS: Record<string, PredictiveCardProps> = {
  increasing: { prediction: MOCK_ACTIVE_INCREASING },
  decreasing: { prediction: MOCK_ACTIVE_DECREASING },
  stable: { prediction: MOCK_ACTIVE_STABLE },
  inactive: { prediction: MOCK_INACTIVE },
  loading: { prediction: null },
};

export default function PredictiveCardTestPage() {
  const [scenario, setScenario] = useState<string>("increasing");
  const props = SCENARIOS[scenario] ?? SCENARIOS.loading;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <h1 className="text-lg font-bold mb-4">Predictive Card Test Page</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(SCENARIOS).map((key) => (
          <button
            key={key}
            onClick={() => setScenario(key)}
            data-testid={`scenario-${key}`}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              scenario === key
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="max-w-lg">
        <PredictiveCardComponent {...props} />
      </div>
    </div>
  );
}
