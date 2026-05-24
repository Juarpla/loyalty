"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  CustomerSegmentationResult,
  GeminiRecoveryPromptResult,
} from "@/backend/types/models.type";

const SEGMENTS_ENDPOINT = "/api/v1/promotions/segments";
const GENERATE_ENDPOINT = "/api/v1/promotions/generate";

interface SegmentsSuccessPayload {
  success: true;
  data: CustomerSegmentationResult;
}

interface SegmentsErrorPayload {
  success: false;
  status?: number;
  error: string;
}

interface GenerateSuccessPayload {
  success: true;
  data: { campaigns: GeminiRecoveryPromptResult[] };
}

interface GenerateErrorPayload {
  success: false;
  status?: number;
  error: string;
}

export interface UseCampaignsResult {
  segments: CustomerSegmentationResult | null;
  segmentsLoading: boolean;
  segmentsError: string | null;
  campaigns: GeminiRecoveryPromptResult[] | null;
  generating: boolean;
  generateError: string | null;
  generateCampaigns: () => Promise<void>;
}

/**
 * State abstraction hook for manager campaign workflows.
 * Auto-fetches customer segments on mount and exposes
 * a callback to trigger AI campaign generation.
 */
export function useCampaigns(): UseCampaignsResult {
  const [segments, setSegments] = useState<CustomerSegmentationResult | null>(null);
  const [segmentsLoading, setSegmentsLoading] = useState(true);
  const [segmentsError, setSegmentsError] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<GeminiRecoveryPromptResult[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const fetchSegments = useCallback(async () => {
    setSegmentsLoading(true);
    setSegmentsError(null);

    try {
      const response = await fetch(SEGMENTS_ENDPOINT);

      if (!response.ok) {
        const payload = (await response.json()) as SegmentsErrorPayload;
        throw new Error(
          payload.error || `Failed to fetch segments: ${response.statusText}`
        );
      }

      const payload = (await response.json()) as
        | SegmentsSuccessPayload
        | SegmentsErrorPayload;

      if (payload.success) {
        setSegments(payload.data);
      } else {
        throw new Error(
          (payload as SegmentsErrorPayload).error || "Unknown backend error"
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading customer segments";
      setSegmentsError(message);
      setSegments(null);
    } finally {
      setSegmentsLoading(false);
    }
  }, []);

  const generateCampaigns = useCallback(async () => {
    setGenerating(true);
    setGenerateError(null);
    setCampaigns(null);

    try {
      const response = await fetch(GENERATE_ENDPOINT);

      if (!response.ok) {
        const payload = (await response.json()) as GenerateErrorPayload;
        throw new Error(
          payload.error || `Failed to generate campaigns: ${response.statusText}`
        );
      }

      const payload = (await response.json()) as
        | GenerateSuccessPayload
        | GenerateErrorPayload;

      if (payload.success) {
        setCampaigns(payload.data.campaigns);
      } else {
        throw new Error(
          (payload as GenerateErrorPayload).error || "Unknown backend error"
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while generating campaigns";
      setGenerateError(message);
      setCampaigns(null);
    } finally {
      setGenerating(false);
    }
  }, []);

  // Auto-fetch segments on mount
  useEffect(() => {
    let active = true;

    const timeoutId = setTimeout(() => {
      if (active) {
        void fetchSegments();
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [fetchSegments]);

  return {
    segments,
    segmentsLoading,
    segmentsError,
    campaigns,
    generating,
    generateError,
    generateCampaigns,
  };
}
