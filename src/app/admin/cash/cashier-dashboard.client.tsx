"use client";

import { useCashierSales } from "@/hooks/use-cashier-sales.hook";
import { CashierForm } from "@/components/cashier/form.component";

export function CashierDashboardClient() {
  const {
    phoneNumber,
    amount,
    loading,
    error,
    successMessage,
    setPhoneNumber,
    setAmount,
    registerSale,
  } = useCashierSales();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Page header */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
            L
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100">Cashier Dashboard</h1>
            <p className="text-xs text-zinc-500">Register customer transactions</p>
          </div>
        </div>
      </div>

      {/* Success banner — R5 */}
      {successMessage && (
        <div className="max-w-lg mx-auto px-4 pt-6">
          <div
            role="status"
            data-testid="success-banner"
            className="rounded-xl bg-emerald-900/30 border border-emerald-700/50 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {successMessage}
          </div>
        </div>
      )}

      {/* Error banner — R6 */}
      {error && (
        <div className="max-w-lg mx-auto px-4 pt-6">
          <div
            role="alert"
            data-testid="error-banner"
            className="rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {error}
          </div>
        </div>
      )}

      {/* Form — R2, R3, R4 */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <CashierForm
          onSubmit={registerSale}
          loading={loading}
          phoneNumber={phoneNumber}
          amount={amount}
          setPhoneNumber={setPhoneNumber}
          setAmount={setAmount}
        />
      </div>
    </main>
  );
}