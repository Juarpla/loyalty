"use client";

import { Clock, TrendingUp, Users, AlertCircle, Info } from "lucide-react";
import type { CustomerSegmentationResult } from "@/backend/types/models.type";

export type CustomerSegmentType = "inactive_30d" | "high_spender" | "frequent";

export interface SegmentCardsProps {
  segments: CustomerSegmentationResult | null;
  segmentsLoading: boolean;
  segmentsError: string | null;
  onSegmentSelect: (segment: CustomerSegmentType) => void;
  onRetry?: () => void;
}

const SEGMENT_CONFIG = {
  inactive_30d: {
    label: "Inactive 30 Days",
    icon: Clock,
    bgAccent: "bg-amber-500/20",
    textAccent: "text-amber-400",
    borderAccent: "border-amber-500/30",
    buttonBg: "bg-amber-500 hover:bg-amber-600",
    testId: "segment-card-inactive_30d",
  },
  high_spender: {
    label: "High Spender",
    icon: TrendingUp,
    bgAccent: "bg-emerald-500/20",
    textAccent: "text-emerald-400",
    borderAccent: "border-emerald-500/30",
    buttonBg: "bg-emerald-500 hover:bg-emerald-600",
    testId: "segment-card-high_spender",
  },
  frequent: {
    label: "Frequent",
    icon: Users,
    bgAccent: "bg-blue-500/20",
    textAccent: "text-blue-400",
    borderAccent: "border-blue-500/30",
    buttonBg: "bg-blue-500 hover:bg-blue-600",
    testId: "segment-card-frequent",
  },
} as const;

type SegmentKey = keyof typeof SEGMENT_CONFIG;

function SkeletonCard() {
  return (
    <div
      data-testid="segment-cards-skeleton-child"
      className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg"
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-zinc-800" />
          <div className="h-5 bg-zinc-800 rounded w-1/2" />
        </div>
        <div className="h-9 bg-zinc-800 rounded w-1/4" />
        <div className="h-11 bg-zinc-800 rounded w-full rounded-xl" />
      </div>
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      data-testid="segment-cards-error"
      className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 backdrop-blur-md shadow-lg"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-300 mb-1">Error</p>
          <p className="text-sm text-red-400/80" data-testid="error-message">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              data-testid="retry-button"
              className="mt-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors border border-red-500/20"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      data-testid="segment-cards-empty"
      className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg"
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-zinc-300 mb-1">
            No customer segments available
          </p>
          <p className="text-sm text-zinc-500">
            Segments will populate once customers start making purchases.
          </p>
        </div>
      </div>
    </div>
  );
}

function SegmentCard({
  type,
  count,
  onSelect,
}: {
  type: SegmentKey;
  count: number;
  onSelect: (segment: CustomerSegmentType) => void;
}) {
  const config = SEGMENT_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      data-testid={config.testId}
      className={`rounded-2xl bg-zinc-900/60 border ${config.borderAccent} p-6 backdrop-blur-md shadow-lg relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${config.bgAccent}`}
      />
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${config.textAccent}`} />
        <h3 className={`text-base font-bold ${config.textAccent}`}>
          {config.label}
        </h3>
      </div>
      <p className="text-3xl font-bold text-zinc-100 mb-1">{count}</p>
      <p className="text-xs text-zinc-500 mb-4">
        {count === 1 ? "customer" : "customers"}
      </p>
      <button
        onClick={() => onSelect(type)}
        data-testid={`select-${type}`}
        className={`w-full mt-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-colors ${config.buttonBg}`}
      >
        Generate Campaign
      </button>
    </div>
  );
}

export function SegmentCards({
  segments,
  segmentsLoading,
  segmentsError,
  onSegmentSelect,
  onRetry,
}: SegmentCardsProps) {
  if (segmentsLoading) {
    return (
      <div data-testid="segment-cards-loading">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (segmentsError) {
    return <ErrorBanner message={segmentsError} onRetry={onRetry} />;
  }

  if (
    segments &&
    segments.summary.inactive_30d === 0 &&
    segments.summary.high_spender === 0 &&
    segments.summary.frequent === 0
  ) {
    return <EmptyState />;
  }

  const activeSegments = (Object.keys(SEGMENT_CONFIG) as SegmentKey[]).filter(
    (key) => (segments?.summary[key] ?? 0) > 0,
  );

  return (
    <div
      data-testid="segment-cards-populated"
      className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3"
    >
      {activeSegments.map((key) => (
        <SegmentCard
          key={key}
          type={key}
          count={segments!.summary[key]}
          onSelect={onSegmentSelect}
        />
      ))}
    </div>
  );
}
