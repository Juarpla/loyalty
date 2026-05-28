"use client";

import React from "react";

export interface CashierMilestoneModalProps {
  visible: boolean;
  customerName: string;
  customerPhone: string;
  rewardDescription: string;
  visitCount: number;
  loading: boolean;
  onClaim: () => void;
  onDismiss: () => void;
}

export function CashierMilestoneModal({
  visible,
  customerName,
  customerPhone,
  rewardDescription,
  visitCount,
  loading,
  onClaim,
  onDismiss,
}: CashierMilestoneModalProps) {
  if (!visible) {
    return null;
  }

  const handleClaimReward = () => {
    if (!loading) {
      onClaim();
    }
  };

  const handleDismissModal = () => {
    if (!loading) {
      onDismiss();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      data-testid="milestone-modal-overlay"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-2xl"
        data-testid="milestone-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-modal-title"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5 animate-pulse">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>

          <h2
            id="milestone-modal-title"
            className="mb-1 text-2xl font-black tracking-tight text-zinc-100"
          >
            Milestone Reached!
          </h2>
          <p className="mb-6 text-sm text-zinc-400">
            This customer has completed their milestone visit.
          </p>

          <div className="mb-8 w-full rounded-xl bg-zinc-950 p-5 text-left border border-zinc-800/60">
            <div className="mb-4 border-b border-zinc-800 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Customer Details
              </span>
              <div
                className="mt-1 text-lg font-bold text-zinc-100"
                data-testid="milestone-customer-name"
              >
                {customerName}
              </div>
              <div
                className="text-sm text-zinc-400"
                data-testid="milestone-customer-phone"
              >
                {customerPhone}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Milestone Reward
              </span>
              <div
                className="mt-1 text-lg font-extrabold text-amber-400"
                data-testid="milestone-reward-description"
              >
                {rewardDescription}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
                <svg
                  className="h-4 w-4 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Completed{" "}
                  <strong
                    className="font-bold text-zinc-200"
                    data-testid="milestone-visit-count"
                  >
                    {visitCount}
                  </strong>{" "}
                  visits
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleClaimReward}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 active:scale-[0.98]"
              data-testid="milestone-claim-button"
            >
              {loading && (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>Claim Reward</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleDismissModal}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/40 px-5 py-3.5 font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 transition-all duration-200 active:scale-[0.98]"
              data-testid="milestone-dismiss-button"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
