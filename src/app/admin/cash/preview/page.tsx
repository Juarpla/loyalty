"use client";

import { CashierForm } from "@/components/cashier/form.component";

/** E2E-only preview route for loading UI state (R7). */
export default function CashierLoadingPreviewPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10">
      <CashierForm onSubmit={() => {}} loading />
    </main>
  );
}
