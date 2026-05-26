import type { Metadata } from "next";
import { PortalClient } from "./portal.client";

export const metadata: Metadata = {
  title: "Connect to WiFi | Loyalty Portal",
  description: "Register to access free WiFi and join our loyalty program.",
};

export default function PortalPage() {
  return <PortalClient />;
}
