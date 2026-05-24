"use client";

import { useState, useCallback } from "react";
import {
  SegmentCards,
  type SegmentCardsProps,
  type CustomerSegmentType,
} from "@/components/promotions/segment-cards.component";
import type { CustomerSegmentationResult } from "@/backend/types/models.type";

const MOCK_POPULATED: CustomerSegmentationResult = {
  segments: [],
  summary: { inactive_30d: 12, high_spender: 8, frequent: 5, unassigned: 0 },
};

const MOCK_EMPTY: CustomerSegmentationResult = {
  segments: [],
  summary: { inactive_30d: 0, high_spender: 0, frequent: 0, unassigned: 0 },
};

const SCENARIOS: Record<string, SegmentCardsProps> = {
  populated: {
    segments: MOCK_POPULATED,
    segmentsLoading: false,
    segmentsError: null,
    onSegmentSelect: () => {},
  },
  loading: {
    segments: null,
    segmentsLoading: true,
    segmentsError: null,
    onSegmentSelect: () => {},
  },
  error: {
    segments: null,
    segmentsLoading: false,
    segmentsError: "Failed to load customer segments. Network error.",
    onSegmentSelect: () => {},
    onRetry: () => {},
  },
  empty: {
    segments: MOCK_EMPTY,
    segmentsLoading: false,
    segmentsError: null,
    onSegmentSelect: () => {},
  },
};

export default function SegmentCardsTestPage() {
  const [scenario, setScenario] = useState<string>("populated");
  const [selectedSegment, setSelectedSegment] = useState<string>("");

  const handleSegmentSelect = useCallback((segment: CustomerSegmentType) => {
    setSelectedSegment(segment);
  }, []);

  const baseProps = SCENARIOS[scenario] ?? SCENARIOS.populated;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <h1 className="text-lg font-bold mb-4">Segment Cards Test Page</h1>

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

      {selectedSegment && (
        <div
          data-testid="selected-segment-display"
          className="mb-4 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-sm text-indigo-300"
        >
          Selected segment: {selectedSegment}
        </div>
      )}

      <div className="max-w-4xl">
        <SegmentCards
          {...baseProps}
          onSegmentSelect={handleSegmentSelect}
        />
      </div>
    </div>
  );
}
