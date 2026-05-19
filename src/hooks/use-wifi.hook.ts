"use client";

import { useState } from "react";
import { DatabaseClient } from "@/backend/types/database.type";

interface RegisterWifiCredentials {
  name: string;
  phone: string;
  email?: string;
}

interface UseWifiResult {
  loading: boolean;
  error: string | null;
  client: DatabaseClient | null;
  registerConnection: (credentials: RegisterWifiCredentials) => Promise<boolean>;
}

/**
 * State Abstraction Hook for Wi-Fi Portal CRM Registrations
 */
export function useWifi(): UseWifiResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<DatabaseClient | null>(null);

  const registerConnection = async (credentials: RegisterWifiCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, you would post this payload to the /api/wifi endpoint
      // which calls the client controller. For this skeleton, we simulate network and mock successful join.
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!credentials.name.trim() || !credentials.phone.trim()) {
        throw new Error("Customer name and phone number are required for Wi-Fi access");
      }

      const mockRegisteredClient: DatabaseClient = {
        id: `cli-${Math.random().toString(36).substr(2, 9)}`,
        name: credentials.name,
        phone: credentials.phone,
        email: credentials.email,
        createdAt: new Date().toISOString(),
        visitCount: 1
      };

      setClient(mockRegisteredClient);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit portal access credentials";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    client,
    registerConnection
  };
}
