"use client";

import { useState, type FormEvent } from "react";

import { usePortal } from "@/hooks/use-portal.hook";

import { WifiInfoQrComponent } from "@/components/wifi/qr.component";

export interface DynamicPortalConfig {
  companyId: string;
  ssid: string;
  password: string;
  welcomeTitle: string;
  welcomeMessage: string;
  brandColor: string;
}

export interface PortalDynamicClientProps {
  config: DynamicPortalConfig;
}

export function PortalDynamicClient({ config }: PortalDynamicClientProps) {
  const { isLoading, isSuccess, error, registerClient } = usePortal();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await registerClient({ name, phone });
  }

  // Inline style accent color variables for premium brand highlights
  const accentGlowStyle = {
    background: `radial-gradient(circle, ${config.brandColor}22 0%, transparent 70%)`,
  };

  const buttonStyle = {
    backgroundColor: config.brandColor,
    boxShadow: `0 4px 14px 0 ${config.brandColor}33`,
  };

  return (
    <main
      data-testid="dynamic-portal-shell"
      className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-10 overflow-x-hidden"
    >
      <div className="w-full max-w-sm">
        {isSuccess ? (
          /* Success page - render WiFi QR code with custom SSID and password */
          <WifiInfoQrComponent ssid={config.ssid} password={config.password} />
        ) : (
          /* Customized Dynamic registration form */
          <div
            className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-6 shadow-2xl relative overflow-hidden"
            style={{ borderColor: `${config.brandColor}2b` }}
          >
            {/* Visual dynamic brand color accents */}
            <div
              className="absolute top-0 right-0 w-28 h-28 blur-[40px] rounded-full pointer-events-none"
              style={accentGlowStyle}
            />
            <div
              className="absolute bottom-0 left-0 w-28 h-28 blur-[40px] rounded-full pointer-events-none"
              style={accentGlowStyle}
            />

            {/* Header / CTA block */}
            <div
              data-testid="dynamic-portal-cta"
              className="text-center mb-6 relative z-10"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl text-white mx-auto mb-4"
                style={{ backgroundColor: config.brandColor }}
              >
                {config.welcomeTitle.charAt(0) || "W"}
              </div>
              <h1 className="text-xl font-extrabold text-zinc-100 tracking-tight">
                {config.welcomeTitle}
              </h1>
              <p className="text-xs text-zinc-400 mt-2">
                {config.welcomeMessage}
              </p>
            </div>

            {/* Dynamic SSID badge */}
            <div
              data-testid="dynamic-portal-ssid"
              className="mb-6 flex flex-col items-center gap-1 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 relative z-10 text-xs"
            >
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                Available WiFi Network
              </span>
              <span className="text-zinc-100 font-bold font-mono">
                {config.ssid}
              </span>
            </div>

            {/* Error message block */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-center gap-2 relative z-10"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* Registration Form with preserved testids */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 relative z-10">
              <input
                type="text"
                data-testid="portal-name-input"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-zinc-800/60 border border-zinc-700/60 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-500 transition-all"
              />

              <input
                type="text"
                data-testid="portal-phone-input"
                placeholder="Phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-zinc-800/60 border border-zinc-700/60 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-500 transition-all"
              />

              <button
                type="submit"
                data-testid="portal-submit-button"
                disabled={isLoading}
                style={buttonStyle}
                className="w-full min-h-[44px] rounded-xl text-zinc-900 text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin text-zinc-900"
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
