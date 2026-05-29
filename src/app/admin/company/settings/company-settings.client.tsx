"use client";

import Link from "next/link";
import { Settings, CheckCircle2, AlertCircle } from "lucide-react";

import { useCompanySettings } from "@/hooks/use-company-settings.hook";
import { ColorSwatch } from "@/components/company/color-swatch.component";

export function CompanySettingsClient() {
  const {
    loading,
    saving,
    error,
    success,
    ssid,
    wifiPassword,
    welcomeTitle,
    welcomeMessage,
    brandColor,
    setSsid,
    setWifiPassword,
    setWelcomeTitle,
    setWelcomeMessage,
    setBrandColor,
    saveSettings,
  } = useCompanySettings();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        {/* Header */}
        <header className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
              S
            </div>
            <div>
              <h1 className="text-base font-bold text-zinc-100">WiFi Settings Manager</h1>
              <p className="text-xs text-zinc-500">Configure WiFi credentials and onboarding portal styling</p>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav aria-label="Admin navigation" className="border-b border-zinc-800/60 bg-zinc-900/40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
            <div className="h-4 bg-zinc-800 rounded w-16 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded w-16 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded w-16 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded w-16 animate-pulse" />
          </div>
        </nav>

        {/* Skeletal Form */}
        <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div data-testid="settings-loading" className="space-y-6 animate-pulse">
            <div className="h-10 bg-zinc-900 border border-zinc-800/80 rounded-xl" />
            <div className="h-10 bg-zinc-900 border border-zinc-800/80 rounded-xl" />
            <div className="h-10 bg-zinc-900 border border-zinc-800/80 rounded-xl" />
            <div className="h-10 bg-zinc-900 border border-zinc-800/80 rounded-xl" />
            <div className="h-10 bg-zinc-900 border border-zinc-800/80 rounded-xl" />
          </div>
          <div className="space-y-6 animate-pulse">
            <div className="h-64 bg-zinc-900 border border-zinc-800/80 rounded-3xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
            S
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100">WiFi Settings Manager</h1>
            <p className="text-xs text-zinc-500">Configure WiFi credentials and onboarding portal styling</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav aria-label="Admin navigation" className="border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap">
          <Link
            href="/admin/cash"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Cashier
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/promotions"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Promotions
          </Link>
          <Link
            href="/admin/social"
            className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            Social
          </Link>
          <Link
            href="/admin/company/settings"
            className="text-sm text-indigo-400 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md px-2 py-1 transition-colors"
          >
            WiFi Settings
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Settings Form */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-zinc-100">Portal & WiFi Settings</h2>
          </div>

          {/* Banner Notifications */}
          {error && (
            <div
              role="alert"
              data-testid="settings-error-banner"
              className="rounded-xl bg-red-950/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Failed to update settings</p>
                <p className="text-red-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div
              role="alert"
              data-testid="settings-success-banner"
              className="rounded-xl bg-emerald-950/30 border border-emerald-700/50 px-4 py-3 text-sm text-emerald-300 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-200">Settings saved successfully!</p>
                <p className="text-emerald-300/80 mt-0.5">WiFi configuration and branding parameters are live.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="wifi-ssid" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                WiFi Network SSID
              </label>
              <input
                id="wifi-ssid"
                data-testid="wifi-ssid-input"
                type="text"
                placeholder="BusinessWiFi"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="wifi-password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                WiFi Network Password
              </label>
              <input
                id="wifi-password"
                data-testid="wifi-password-input"
                type="text"
                placeholder="••••••••"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="welcome-title" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Portal Welcome Title
              </label>
              <input
                id="welcome-title"
                data-testid="welcome-title-input"
                type="text"
                placeholder="Welcome! Get Free WiFi"
                value={welcomeTitle}
                onChange={(e) => setWelcomeTitle(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="welcome-message" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Portal Welcome Message
              </label>
              <textarea
                id="welcome-message"
                data-testid="welcome-message-input"
                placeholder="Register below to connect to our network"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={3}
                className="w-full min-h-[64px] rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="brand-color" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Brand Hex Accent Color
              </label>
              <div className="flex flex-col gap-2.5">
                <input
                  id="brand-color"
                  data-testid="brand-color-input"
                  type="text"
                  placeholder="#6366f1"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <ColorSwatch color={brandColor} />
              </div>
            </div>

            <button
              type="submit"
              data-testid="settings-save-button"
              disabled={saving}
              className="w-full min-h-[44px] mt-2 rounded-xl text-zinc-900 bg-indigo-400 text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Saving settings..." : "Save Settings"}
            </button>
          </form>
        </section>

        {/* Live Portal Preview */}
        <section className="space-y-6 flex flex-col justify-start">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-zinc-100">Live Portal Preview</h2>
          </div>

          <div
            data-testid="portal-preview-card"
            className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-6 shadow-2xl relative overflow-hidden w-full max-w-sm mx-auto"
            style={{ borderColor: `${brandColor}2b` }}
          >
            {/* Visual dynamic brand color accents */}
            <div
              className="absolute top-0 right-0 w-28 h-28 blur-[40px] rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${brandColor}22 0%, transparent 70%)` }}
            />
            <div
              className="absolute bottom-0 left-0 w-28 h-28 blur-[40px] rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${brandColor}22 0%, transparent 70%)` }}
            />

            {/* Header / CTA block */}
            <div className="text-center mb-6 relative z-10">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl text-white mx-auto mb-4"
                style={{ backgroundColor: brandColor }}
              >
                {welcomeTitle.charAt(0) || "W"}
              </div>
              <h3 className="text-xl font-extrabold text-zinc-100 tracking-tight">
                {welcomeTitle || "Welcome! Get Free WiFi"}
              </h3>
              <p className="text-xs text-zinc-400 mt-2">
                {welcomeMessage || "Register below to connect to our network"}
              </p>
            </div>

            {/* Dynamic SSID badge */}
            <div className="mb-6 flex flex-col items-center gap-1 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 relative z-10 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                Available WiFi Network
              </span>
              <span className="text-zinc-100 font-bold font-mono">
                {ssid || "BusinessWiFi"}
              </span>
            </div>

            {/* Form Inputs Mimics */}
            <div className="flex flex-col gap-3.5 relative z-10">
              <div className="w-full min-h-[44px] rounded-xl bg-zinc-850 border border-zinc-800 px-4 py-3 text-sm text-zinc-500 select-none">
                Your name
              </div>
              <div className="w-full min-h-[44px] rounded-xl bg-zinc-850 border border-zinc-800 px-4 py-3 text-sm text-zinc-500 select-none">
                Phone number
              </div>
              <div
                style={{
                  backgroundColor: brandColor,
                  boxShadow: `0 4px 14px 0 ${brandColor}33`,
                }}
                className="w-full min-h-[44px] rounded-xl text-zinc-900 text-sm font-extrabold flex items-center justify-center gap-2 select-none"
              >
                Connect to WiFi
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
