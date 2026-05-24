import type { Metadata } from "next";
import { PromotionsClient } from "./promotions.client";

export const metadata: Metadata = {
  title: "Promotions Manager | Loyalty",
  description: "Manage customer segments and AI-powered promotions",
};

export default function PromotionsPage() {
  return <PromotionsClient />;
}
