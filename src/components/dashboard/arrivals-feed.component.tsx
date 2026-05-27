"use client";

import React from "react";
import { RefreshCw, MessageSquare, AlertCircle } from "lucide-react";
import type {
  ArrivalNotificationWithMeta,
  ArrivalNotificationsSummary,
} from "@/backend/types/models.type";

export interface ArrivalsFeedProps {
  notifications: ArrivalNotificationWithMeta[];
  summary: ArrivalNotificationsSummary | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function ArrivalsFeedComponent({
  notifications,
  summary,
  loading,
  error,
  onRefresh,
}: ArrivalsFeedProps) {
  return (
    <div className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50">
        <div>
          <h3 className="text-lg font-bold text-zinc-100">Live Arrivals</h3>
          <p className="text-xs text-zinc-500">Real-time captive portal visits</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          data-testid="refresh-button"
          className="p-2 text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Refresh live arrivals"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* States */}
      {loading ? (
        <div data-testid="arrivals-feed-skeleton" className="space-y-4 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              data-testid="arrivals-feed-skeleton-item"
              className="animate-pulse bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-3 bg-zinc-800 rounded w-1/4" />
              </div>
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
              <div className="h-8 bg-zinc-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          data-testid="arrivals-feed-error"
          className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3"
        >
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div>
            <h4 className="font-semibold text-zinc-200">Failed to Load</h4>
            <p data-testid="error-message" className="text-xs text-red-400/90 mt-1">
              {error}
            </p>
          </div>
          <button
            onClick={onRefresh}
            data-testid="retry-button"
            className="px-4 py-2 text-xs font-semibold text-zinc-100 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div
          data-testid="arrivals-feed-empty"
          className="py-12 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20"
        >
          <p className="text-sm font-medium text-zinc-400">No active portal arrivals</p>
          <p className="text-xs text-zinc-500 max-w-[250px]">
            New client connections will automatically appear here once they join the WiFi network.
          </p>
        </div>
      ) : (
        <div data-testid="arrivals-feed-populated" className="flex flex-col gap-4">
          {/* Summary Panel */}
          {summary && (
            <div
              data-testid="arrivals-summary"
              className="grid grid-cols-3 gap-2 p-3 bg-zinc-800/20 border border-zinc-800/40 rounded-xl text-center text-xs"
            >
              <div>
                <span className="block text-zinc-500">Total</span>
                <span className="text-base font-bold text-zinc-200">{summary.total}</span>
              </div>
              <div>
                <span className="block text-zinc-500">Named</span>
                <span className="text-base font-bold text-zinc-200">{summary.named}</span>
              </div>
              <div>
                <span className="block text-zinc-500">Anonymous</span>
                <span className="text-base font-bold text-zinc-200">{summary.anonymous}</span>
              </div>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-3 overflow-y-auto max-h-[450px] pr-1">
            {notifications.map((item) => {
              const displayName = item.name && item.name.trim() !== "" ? item.name : "Cliente Anónimo";
              return (
                <div
                  key={item.loginId}
                  data-testid={`arrival-card-${item.loginId}`}
                  className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-4 flex flex-col gap-3 hover:border-zinc-700/80 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        data-testid="arrival-name"
                        className="text-sm font-semibold text-zinc-200"
                      >
                        {displayName}
                      </h4>
                      <p data-testid="arrival-phone" className="text-xs text-zinc-500">
                        {item.phone_number}
                      </p>
                    </div>
                    <span
                      data-testid="arrival-time"
                      className="text-[10px] font-medium text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded-full"
                    >
                      {new Date(item.arrivedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {item.greetingText && (
                    <p
                      data-testid="arrival-greeting"
                      className="text-xs text-zinc-400 italic bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/30 line-clamp-2"
                    >
                      &ldquo;{item.greetingText}&rdquo;
                    </p>
                  )}

                  <a
                    href={item.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="whatsapp-link"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-zinc-100 font-semibold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Greet on WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
