"use client";

import { useState, useCallback } from "react";

export interface PortalRegisterData {
  name: string;
  phone: string;
}

export interface UsePortalReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  registerClient: (data: PortalRegisterData) => Promise<void>;
  reset: () => void;
}

const PORTAL_REGISTER_ENDPOINT = "/api/v1/portal/register";

export function usePortal(): UsePortalReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerClient = useCallback(async (data: PortalRegisterData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch(PORTAL_REGISTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let payload: { error?: string; message?: string } | null = null;
      try {
        payload = (await response.json()) as { error?: string; message?: string };
      } catch {
        // Response body might be empty or not JSON
      }

      if (response.status === 201 || response.ok) {
        setIsSuccess(true);
        return;
      }

      const errorMsg =
        payload?.error ||
        payload?.message ||
        `Failed to register client: ${response.statusText || response.status}`;
      setError(errorMsg);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  return {
    isLoading,
    isSuccess,
    error,
    registerClient,
    reset,
  };
}
