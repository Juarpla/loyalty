import type { Metadata } from "next";
import { headers } from "next/headers";

import { PortalDynamicClient } from "./portal-dynamic.client";

type PageProps = {
  params: Promise<{ companyId: string }>;
};

export const metadata: Metadata = {
  title: "Connect to WiFi | Partner Portal",
  description: "Register to access free WiFi and join the customer loyalty network.",
};

export default async function PortalCompanyPage(props: PageProps) {
  const { companyId } = await props.params;

  const fallbackConfig = {
    companyId,
    ssid: "BusinessWiFi",
    password: "welcome123",
    welcomeTitle: "Welcome! Get Free WiFi",
    welcomeMessage: "Register below to connect to our network",
    brandColor: "#6366f1",
  };

  let config = { ...fallbackConfig };

  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/v1/company/${encodeURIComponent(companyId)}/wifi`, {
      cache: "no-store",
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.success && payload.data) {
        config = {
          companyId,
          ssid: payload.data.ssid || fallbackConfig.ssid,
          password: payload.data.wifi_password || fallbackConfig.password,
          welcomeTitle: payload.data.welcome_title || fallbackConfig.welcomeTitle,
          welcomeMessage: payload.data.welcome_message || fallbackConfig.welcomeMessage,
          brandColor: payload.data.brand_color || fallbackConfig.brandColor,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch dynamic company WiFi settings, using defaults:", error);
  }

  return <PortalDynamicClient config={config} />;
}
