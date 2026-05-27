"use client";

import Link from "next/link";

import { useTraffic } from "@/hooks/use-traffic.hook";
import { TrafficChartComponent } from "@/components/traffic/chart.component";
import { useArrivals } from "@/hooks/use-arrivals.hook";
import { ArrivalsFeedComponent } from "@/components/dashboard/arrivals-feed.component";

export function DashboardClient() {
  const { data, loading, error } = useTraffic();
  const {
    notifications,
    summary,
    loading: arrivalsLoading,
    error: arrivalsError,
    refresh: refreshArrivals,
  } = useArrivals();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header — R1 */}
      <header className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
            L
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100">Manager Dashboard</h1>
            <p className="text-xs text-zinc-500">Traffic and peak hours analytics</p>
          </div>
        </div>
      </header>

      {/* Navigation — R6, R8 */}
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
            href="/admin/promotions"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Promotions
          </Link>
          <Link
            href="/admin/social"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Social
          </Link>
        </div>
      </nav>

      {/* Main content — R2, R4, R5 */}
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full flex flex-col gap-8">
        <TrafficChartComponent data={data} loading={loading} error={error} />
        <ArrivalsFeedComponent
          notifications={notifications}
          summary={summary}
          loading={arrivalsLoading}
          error={arrivalsError}
          onRefresh={refreshArrivals}
        />
      </main>
    </div>
  );
}
