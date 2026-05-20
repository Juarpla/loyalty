import type { Metadata } from "next";
import { CashierDashboardClient } from "./cashier-dashboard.client";

export const metadata: Metadata = {
  title: "Cashier Dashboard | Loyalty",
  description: "Register customer sales transactions",
};

export default function CashierPage() {
  return <CashierDashboardClient />;
}