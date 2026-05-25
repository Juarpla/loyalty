"use client";

import { useState, useCallback } from "react";
import type { SocialIdea } from "@/backend/types/models.type";

const SOCIAL_IDEAS_ENDPOINT = "/api/v1/social/ideas";
const SUCCESS_MESSAGE = "Ideas generated successfully";

interface SocialIdeasSuccessPayload {
  success: true;
  data: { ideas: SocialIdea[] };
}

interface SocialIdeasErrorPayload {
  success: false;
  status?: number;
  error: string;
}

export interface UseSocialIdeasResult {
  context: string;
  ideas: SocialIdea[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  setContext: (value: string) => void;
  generateIdeas: () => Promise<void>;
}

export function useSocialIdeas(): UseSocialIdeasResult {
  const [context, setContext] = useState("");
  const [ideas, setIdeas] = useState<SocialIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const generateIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(SOCIAL_IDEAS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      const payload = (await response.json()) as
        | SocialIdeasSuccessPayload
        | SocialIdeasErrorPayload;

      if (response.status === 200 && payload.success === true) {
        setIdeas(payload.data.ideas);
        setContext("");
        setSuccessMessage(SUCCESS_MESSAGE);
        return;
      }

      const errorPayload = payload as SocialIdeasErrorPayload;
      setError(
        errorPayload.error ||
          `Failed to generate ideas: ${response.statusText}`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while generating ideas";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [context]);

  return {
    context,
    ideas,
    loading,
    error,
    successMessage,
    setContext,
    generateIdeas,
  };
}
