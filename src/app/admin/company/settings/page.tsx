import type { Metadata } from "next";

import { CompanySettingsClient } from "./company-settings.client";

export const metadata: Metadata = {
  title: "WiFi & Portal Settings | Admin",
  description: "Configure your business's customer WiFi network parameters and branding.",
};

export default function CompanySettingsPage() {
  return <CompanySettingsClient />;
}
