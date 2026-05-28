"use client";

import React, { useState } from "react";
import { CashierMilestoneModal } from "@/components/cashier/milestone-modal.component";

export default function TestMilestoneModalPage() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimCount, setClaimCount] = useState(0);
  const [dismissCount, setDismissCount] = useState(0);

  const [customerName, setCustomerName] = useState("Jane Doe");
  const [customerPhone, setCustomerPhone] = useState("+1 555-0199");
  const [rewardDescription, setRewardDescription] = useState("Free Coffee & Donut");
  const [visitCount, setVisitCount] = useState(10);

  const handleClaim = () => {
    setClaimCount((prev) => prev + 1);
  };

  const handleDismiss = () => {
    setDismissCount((prev) => prev + 1);
  };

  return (
    <main className="p-8 max-w-xl mx-auto bg-zinc-950 min-h-screen text-zinc-100 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">Milestone Modal Test Harness</h1>
        <p className="text-sm text-zinc-400">
          Control the props dynamically to test all states of the CashierMilestoneModal component.
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Controls</h2>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              data-testid="control-visible"
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Modal Visible</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
              data-testid="control-loading"
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Loading State</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              data-testid="control-customer-name"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Customer Phone</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              data-testid="control-customer-phone"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Reward Description</label>
            <input
              type="text"
              value={rewardDescription}
              onChange={(e) => setRewardDescription(e.target.value)}
              data-testid="control-reward-description"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Visit Count</label>
            <input
              type="number"
              value={visitCount}
              onChange={(e) => setVisitCount(Number(e.target.value))}
              data-testid="control-visit-count"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400">
        <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Interactive Callbacks Log</h2>
        <div className="flex justify-between border-b border-zinc-800 pb-1.5">
          <span>Claim Callback Count:</span>
          <strong className="text-zinc-200" data-testid="claim-callback-count">
            {claimCount}
          </strong>
        </div>
        <div className="flex justify-between pt-0.5">
          <span>Dismiss Callback Count:</span>
          <strong className="text-zinc-200" data-testid="dismiss-callback-count">
            {dismissCount}
          </strong>
        </div>
      </div>

      <CashierMilestoneModal
        visible={visible}
        customerName={customerName}
        customerPhone={customerPhone}
        rewardDescription={rewardDescription}
        visitCount={visitCount}
        loading={loading}
        onClaim={handleClaim}
        onDismiss={handleDismiss}
      />
    </main>
  );
}
