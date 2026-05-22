import type { Metadata } from "next";
import { DashboardClient } from "./dashboard.client";

export const metadata: Metadata = {
  title: "Manager Dashboard | Loyalty",
  description: "View sales traffic and peak hours analytics",
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
