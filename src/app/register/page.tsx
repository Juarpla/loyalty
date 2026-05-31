import { Suspense } from "react";
import { Metadata } from "next";

import RegisterClient from "./register.client";

export const metadata: Metadata = {
  title: "Administrative Registration | Loyalty Engine",
  description: "Create local gateway credentials for administrative access.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#090b16] via-[#05060c] to-[#010103] flex items-center justify-center text-zinc-400 text-sm">Loading registration gateway...</div>}>
      <RegisterClient />
    </Suspense>
  );
}
