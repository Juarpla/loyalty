import { Suspense } from "react";
import { Metadata } from "next";
import LoginClient from "./login.client";

export const metadata: Metadata = {
  title: "Administrative Login | Loyalty Engine",
  description: "Secure gateway for cashier operations and manager dashboards.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#090b16] via-[#05060c] to-[#010103] flex items-center justify-center text-zinc-400 text-sm">Loading security gateway...</div>}>
      <LoginClient />
    </Suspense>
  );
}
