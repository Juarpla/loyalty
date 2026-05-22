"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrafficDistribution } from "@/backend/types/models.type";

const METRICS_ENDPOINT = "/api/v1/sales/metrics";

interface MetricsSuccessPayload {
  success: true;
  data: TrafficDistribution;
}

interface MetricsErrorPayload {
  success: false;
  status?: number;
  error: string;
}

export interface UseTrafficResult {
  data: TrafficDistribution | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * State abstraction hook for traffic analytics.
 * Orchestrates GET fetch to /api/v1/sales/metrics, caching, and error states.
 */
export function useTraffic(): UseTrafficResult {
  const [data, setData] = useState<TrafficDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(METRICS_ENDPOINT);

      if (!response.ok) {
        const payload = (await response.json()) as MetricsErrorPayload;
        throw new Error(
          payload.error || `Failed to fetch metrics: ${response.statusText}`
        );
      }

      const payload = (await response.json()) as
        | MetricsSuccessPayload
        | MetricsErrorPayload;

      if (payload.success) {
        setData(payload.data);
      } else {
        throw new Error(
          (payload as MetricsErrorPayload).error || "Unknown backend error"
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading traffic metrics";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    let active = true;

    const timeoutId = setTimeout(() => {
      if (active) {
        void fetchMetrics();
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [fetchMetrics]);

  return {
    data,
    loading,
    error,
    refresh: fetchMetrics,
  };
}
