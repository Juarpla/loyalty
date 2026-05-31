"use client";

import { useEffect, useRef } from "react";
import { useCashierSales } from "@/hooks/use-cashier-sales.hook";
import { CashierForm } from "@/components/cashier/form.component";
import { useArrivals } from "@/hooks/use-arrivals.hook";
import { useRewards } from "@/hooks/use-rewards.hook";
import { CashierMilestoneModal } from "@/components/cashier/milestone-modal.component";
import { LogoutButton } from "@/components/ui/logout-button.component";

export function CashierDashboardClient() {
  const {
    phoneNumber,
    amount,
    loading: salesLoading,
    error: salesError,
    successMessage: salesSuccess,
    setPhoneNumber,
    setAmount,
    registerSale,
  } = useCashierSales();

  const { notifications } = useArrivals();
  const {
    modalVisible,
    loading: rewardsLoading,
    error: rewardsError,
    successMessage: rewardsSuccess,
    checkMilestone,
    claimReward,
    dismissModal,
  } = useRewards();

  const checkedArrivalsRegistry = useRef<Set<string>>(new Set());

  useEffect(() => {
    const latestArrivalNotification = notifications[0];
    if (!latestArrivalNotification) {
      return;
    }

    const sessionIdentifierKey = `${latestArrivalNotification.clientId}-${latestArrivalNotification.loginId}`;
    if (!checkedArrivalsRegistry.current.has(sessionIdentifierKey)) {
      checkedArrivalsRegistry.current.add(sessionIdentifierKey);
      void checkMilestone(latestArrivalNotification.clientId);
    }
  }, [notifications, checkMilestone]);

  const activeArrival = notifications[0];
  const activeArrivalClientId = activeArrival?.clientId || "";
  const activeArrivalCustomerName = activeArrival?.name || "Anonymous Customer";
  const activeArrivalCustomerPhone = activeArrival?.phone_number || "";

  const handleClaimActiveReward = () => {
    if (activeArrivalClientId) {
      void claimReward(activeArrivalClientId);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Page header */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
              L
            </div>
            <div>
              <h1 className="text-base font-bold text-zinc-100">Cashier Dashboard</h1>
              <p className="text-xs text-zinc-500">Register customer transactions</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Success banners */}
      {salesSuccess && (
        <div className="max-w-lg mx-auto px-4 pt-6 w-full">
          <div
            role="status"
            data-testid="success-banner"
            className="rounded-xl bg-emerald-900/30 border border-emerald-700/50 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {salesSuccess}
          </div>
        </div>
      )}

      {rewardsSuccess && (
        <div className="max-w-lg mx-auto px-4 pt-6 w-full">
          <div
            role="status"
            data-testid="rewards-success-banner"
            className="rounded-xl bg-emerald-900/30 border border-emerald-700/50 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {rewardsSuccess}
          </div>
        </div>
      )}

      {/* Error banners */}
      {salesError && (
        <div className="max-w-lg mx-auto px-4 pt-6 w-full">
          <div
            role="alert"
            data-testid="error-banner"
            className="rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {salesError}
          </div>
        </div>
      )}

      {rewardsError && (
        <div className="max-w-lg mx-auto px-4 pt-6 w-full">
          <div
            role="alert"
            data-testid="rewards-error-banner"
            className="rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {rewardsError}
          </div>
        </div>
      )}

      {/* Form — R2, R3, R4 */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <CashierForm
          onSubmit={registerSale}
          loading={salesLoading}
          phoneNumber={phoneNumber}
          amount={amount}
          setPhoneNumber={setPhoneNumber}
          setAmount={setAmount}
        />
      </div>

      {/* Milestone Warning Modal overlay */}
      <CashierMilestoneModal
        visible={modalVisible}
        customerName={activeArrivalCustomerName}
        customerPhone={activeArrivalCustomerPhone}
        rewardDescription="Free Coffee & Donut"
        visitCount={10}
        loading={rewardsLoading}
        onClaim={handleClaimActiveReward}
        onDismiss={dismissModal}
      />
    </main>
  );
}