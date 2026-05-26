"use client";

import { useState, type FormEvent } from "react";

import { usePortal } from "@/hooks/use-portal.hook";

import { WifiInfoQrComponent } from "@/components/wifi/qr.component";

export function PortalClient() {
  const { isLoading, isSuccess, error, registerClient } = usePortal();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const ssid = process.env.NEXT_PUBLIC_WIFI_SSID ?? "BusinessWiFi";
  const password = process.env.NEXT_PUBLIC_WIFI_PASSWORD ?? "welcome123";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await registerClient({ name, phone });
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {isSuccess ? (
          /* R6: Success — show WiFi QR, hide form */
          <WifiInfoQrComponent ssid={ssid} password={password} />
        ) : (
          /* R4: Registration form */
          <div className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-6 shadow-2xl relative overflow-hidden">
            {/* Visual accent lights — match WifiInfoQrComponent design */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 blur-[40px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-500 flex items-center justify-center font-bold text-xl text-white mx-auto mb-3">
                L
              </div>
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
                Welcome! Get Free WiFi
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Register below to connect to our network
              </p>
            </div>

            {/* R7: Error banner */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-center gap-2 relative z-10"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* R4: Form inputs */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative z-10">
              <input
                type="text"
                data-testid="portal-name-input"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-zinc-800/60 border border-zinc-700/60 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all"
              />

              <input
                type="text"
                data-testid="portal-phone-input"
                placeholder="Phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-zinc-800/60 border border-zinc-700/60 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all"
              />

              {/* R5: Loading state on submit button */}
              <button
                type="submit"
                data-testid="portal-submit-button"
                disabled={isLoading}
                className="w-full min-h-[44px] rounded-xl bg-zinc-100 text-zinc-900 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-black/20"
              >
                {isLoading ? (
                  <>
                    {/* Inline spinner */}
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
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
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  "Connect to WiFi"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
