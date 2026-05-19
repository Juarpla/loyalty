"use client";

import { useState, useEffect, useCallback } from "react";
import { TrafficRecord } from "@/backend/types/database.type";

interface TrafficSummary {
  totalVisits: number;
  wifiConnections: number;
  conversionRate: number;
}

interface UseTrafficResult {
  loading: boolean;
  error: string | null;
  summary: TrafficSummary | null;
  records: TrafficRecord[];
  refresh: () => Promise<void>;
}

/**
 * State Abstraction Hook for Traffic API Data Management
 * Perfectly decouples network orchestration from React component rendering.
 */
export function useTraffic(): UseTrafficResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [records, setRecords] = useState<TrafficRecord[]>([]);

  const fetchTraffic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Calls local next.js internal route which delegates to the isolated controllers.
      // E.g., if you move the backend, this fetch target is the ONLY string that changes!
      const response = await fetch("/api/traffic");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch traffic stats: ${response.statusText}`);
      }

      const payload = await response.json();
      
      if (payload.success) {
        setSummary(payload.summary);
        setRecords(payload.records);
      } else {
        throw new Error(payload.error || "Unknown backend error");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while loading traffic";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto load on mounting
  useEffect(() => {
    let active = true;
    
    // Execute asynchronously in the next event loop tick to avoid synchronous setState calls in mounting effect
    const timeoutId = setTimeout(() => {
      if (active) {
        void fetchTraffic();
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [fetchTraffic]);

  return {
    loading,
    error,
    summary,
    records,
    refresh: fetchTraffic,
  };
}
