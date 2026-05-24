"use client";

import Link from "next/link";
import { Sparkles, CheckCircle, AlertCircle, Clock } from "lucide-react";

import { useCampaigns } from "@/hooks/use-campaigns.hook";
import { SegmentCards } from "@/components/promotions/segment-cards.component";

function CampaignSkeleton() {
  return (
    <div
      data-testid="campaigns-loading"
      className="space-y-4"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          data-testid="campaigns-skeleton-child"
          className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 backdrop-blur-md shadow-lg"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-zinc-800 rounded w-1/3" />
            <div className="h-3 bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-800 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CampaignError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      data-testid="campaigns-error"
      className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 backdrop-blur-md shadow-lg"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-300 mb-1">
            Campaign generation failed
          </p>
          <p className="text-sm text-red-400/80">{message}</p>
          <button
            onClick={onRetry}
            data-testid="campaigns-retry-button"
            className="mt-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors border border-red-500/20"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({
  result,
  index,
}: {
  result: { phone_number: string; recoveryCopy: string; generatedAt: string };
  index: number;
}) {
  return (
    <div
      data-testid={`campaign-card-${index}`}
      className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 backdrop-blur-md shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-emerald-400">
          Draft generated
        </span>
      </div>
      <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
        {result.recoveryCopy}
      </p>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>To: {result.phone_number}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(result.generatedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

function CampaignResults({
  campaigns,
  generating,
  generateError,
  onRetry,
}: {
  campaigns: { phone_number: string; recoveryCopy: string; generatedAt: string }[] | null;
  generating: boolean;
  generateError: string | null;
  onRetry: () => void;
}) {
  if (generating) return <CampaignSkeleton />;
  if (generateError) return <CampaignError message={generateError} onRetry={onRetry} />;
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <div data-testid="campaigns-results" className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-4">
        Generated Campaigns
      </h2>
      {campaigns.map((result, index) => (
        <CampaignCard key={index} result={result} index={index} />
      ))}
    </div>
  );
}

export function PromotionsClient() {
  const {
    segments,
    segmentsLoading,
    segmentsError,
    campaigns,
    generating,
    generateError,
    generateCampaigns,
  } = useCampaigns();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
            L
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100">
              Promotions Manager
            </h1>
            <p className="text-xs text-zinc-500">
              Customer segments and campaign generation
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        aria-label="Admin navigation"
        className="border-b border-zinc-800/60 bg-zinc-900/40"
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4 sm:gap-6">
          <Link
            href="/admin/cash"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Cashier
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/social"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Social
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <SegmentCards
          segments={segments}
          segmentsLoading={segmentsLoading}
          segmentsError={segmentsError}
          onSegmentSelect={() => void generateCampaigns()}
        />

        {generating && (
          <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Generating campaign drafts...</span>
          </div>
        )}

        <CampaignResults
          campaigns={campaigns}
          generating={generating}
          generateError={generateError}
          onRetry={generateCampaigns}
        />
      </main>
    </div>
  );
}
