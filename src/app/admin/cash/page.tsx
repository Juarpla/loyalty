"use client";

import { CashierForm } from "@/components/cashier/form.component";

/**
 * Minimal cashier route to mount CashierForm for E2E verification.
 * Feature 8 (page_cashier_dashboard) will extend layout, theme, and hook wiring.
 */
export default function CashierPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10">
      <h1 className="mb-8 text-center text-2xl font-bold text-zinc-100">
        Register Sale
      </h1>
      <CashierForm onSubmit={() => {}} />
    </main>
  );
}
