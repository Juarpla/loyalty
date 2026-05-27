"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  ArrivalNotificationWithMeta,
  ArrivalNotificationsSummary,
} from "@/backend/types/models.type";

const ARRIVALS_ENDPOINT = "/api/v1/arrivals/notifications";
const ARRIVALS_ERROR_MESSAGE =
  "An unexpected error occurred while loading arrival notifications";

interface ArrivalsSuccessPayload {
  success: true;
  data: {
    notifications: ArrivalNotificationWithMeta[];
    summary: ArrivalNotificationsSummary;
  };
}

interface ArrivalsErrorPayload {
  success: false;
  status?: number;
  error: string;
}

class ArrivalsApiError extends Error {}

export interface UseArrivalsResult {
  notifications: ArrivalNotificationWithMeta[];
  summary: ArrivalNotificationsSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useArrivals(): UseArrivalsResult {
  const [notifications, setNotifications] = useState<
    ArrivalNotificationWithMeta[]
  >([]);
  const [summary, setSummary] = useState<ArrivalNotificationsSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArrivals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(ARRIVALS_ENDPOINT);

      if (!response.ok) {
        const payload = (await response.json()) as ArrivalsErrorPayload;
        throw new ArrivalsApiError(
          payload.error || `Failed to fetch arrivals: ${response.statusText}`
        );
      }

      const payload = (await response.json()) as
        | ArrivalsSuccessPayload
        | ArrivalsErrorPayload;

      if (payload.success) {
        setNotifications(payload.data.notifications);
        setSummary(payload.data.summary);
      } else {
        throw new ArrivalsApiError(
          (payload as ArrivalsErrorPayload).error || "Unknown backend error"
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof ArrivalsApiError ? err.message : ARRIVALS_ERROR_MESSAGE;
      setError(message);
      setNotifications([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const timeoutId = setTimeout(() => {
      if (active) {
        void fetchArrivals();
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [fetchArrivals]);

  return {
    notifications,
    summary,
    loading,
    error,
    refresh: fetchArrivals,
  };
}
