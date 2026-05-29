"use client";

import { useState, useEffect, useCallback } from "react";

import type { CompanyWifiSettings } from "@/backend/types/company.type";

const DEFAULT_COMPANY_ID = "demo-company";
const SETTINGS_ERROR_MESSAGE = "An unexpected error occurred while loading company settings";

export interface UseCompanySettingsResult {
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
  ssid: string;
  wifiPassword: string;
  welcomeTitle: string;
  welcomeMessage: string;
  brandColor: string;
  setSsid: (ssid: string) => void;
  setWifiPassword: (password: string) => void;
  setWelcomeTitle: (title: string) => void;
  setWelcomeMessage: (message: string) => void;
  setBrandColor: (color: string) => void;
  saveSettings: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useCompanySettings(companyId: string = DEFAULT_COMPANY_ID): UseCompanySettingsResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [ssid, setSsid] = useState<string>("");
  const [wifiPassword, setWifiPassword] = useState<string>("");
  const [welcomeTitle, setWelcomeTitle] = useState<string>("");
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [brandColor, setBrandColor] = useState<string>("#6366f1");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/v1/company/${companyId}/wifi`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to fetch company settings");
      }

      const settings = payload.data as CompanyWifiSettings;
      if (settings) {
        setSsid(settings.ssid || "");
        setWifiPassword(settings.wifi_password || "");
        setWelcomeTitle(settings.welcome_title || "");
        setWelcomeMessage(settings.welcome_message || "");
        setBrandColor(settings.brand_color || "#6366f1");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : SETTINGS_ERROR_MESSAGE;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    let active = true;

    const timeoutId = setTimeout(() => {
      if (active) {
        void fetchSettings();
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [fetchSettings]);

  const saveSettings = async (): Promise<boolean> => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (!ssid.trim()) {
      setError("Validation failed: SSID is required");
      setSaving(false);
      return false;
    }

    if (!wifiPassword.trim()) {
      setError("Validation failed: WiFi password is required");
      setSaving(false);
      return false;
    }

    if (wifiPassword.length < 8 || wifiPassword.length > 64) {
      setError("Validation failed: WiFi password must be between 8 and 64 characters");
      setSaving(false);
      return false;
    }

    if (welcomeTitle.length > 80) {
      setError("Validation failed: Welcome title is invalid");
      setSaving(false);
      return false;
    }

    if (welcomeMessage.length > 240) {
      setError("Validation failed: Welcome message is invalid");
      setSaving(false);
      return false;
    }

    const brandColorPattern = /^#[0-9a-fA-F]{6}$/;
    if (brandColor && !brandColorPattern.test(brandColor)) {
      setError("Validation failed: Brand color is invalid");
      setSaving(false);
      return false;
    }

    try {
      const response = await fetch(`/api/v1/company/${companyId}/wifi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid: ssid.trim(),
          wifi_password: wifiPassword,
          welcome_title: welcomeTitle.trim() || undefined,
          welcome_message: welcomeMessage.trim() || undefined,
          brand_color: brandColor.trim() || undefined,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to update company settings");
      }

      setSuccess(true);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save company settings";
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    success,
    ssid,
    wifiPassword,
    welcomeTitle,
    welcomeMessage,
    brandColor,
    setSsid,
    setWifiPassword,
    setWelcomeTitle,
    setWelcomeMessage,
    setBrandColor,
    saveSettings,
    refresh: fetchSettings,
  };
}
