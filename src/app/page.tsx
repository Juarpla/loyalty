import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  LayoutDashboard, 
  Coins, 
  Wifi, 
  Activity, 
  QrCode, 
  ChevronRight,
  TrendingUp,
  MessageSquare
} from "lucide-react";

export const metadata: Metadata = {
  title: "Loyalty Engine Hub | Enterprise Core",
  description: "Enterprise local business customer loyalty platform core dashboard, featuring cashier operations, AI marketing promotion drafting, live traffic analytics, and guest captive wifi logins.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-16 bg-gradient-to-br from-[#090b16] via-[#05060c] to-[#010103] text-zinc-100 font-sans selection:bg-indigo-500/40 selection:text-white overflow-hidden relative">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-[-20%] left-[-15%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-500/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-emerald-500/5 via-indigo-500/10 to-transparent blur-[160px] pointer-events-none" />

      {/* Premium Header */}
      <header className="z-10 w-full max-w-6xl flex items-center justify-between border-b border-zinc-800/40 pb-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/10 font-black text-lg text-white">
            L
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              LoyaltyEngine
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Enterprise Core Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Harness Live
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center text-xs text-zinc-400 hover:text-white transition-colors font-medium border border-zinc-800 rounded-lg px-4 bg-zinc-950/30 backdrop-blur min-h-[44px] min-w-[44px]"
          >
            v1.0.0
          </a>
        </div>
      </header>

      {/* Main Hero & Navigation Hub */}
      <section className="z-10 w-full max-w-6xl my-auto py-16 flex flex-col lg:flex-row gap-12 items-center justify-between">
        
        {/* Marketing Hero Copy */}
        <div className="flex flex-col gap-6 text-center lg:text-left max-w-xl">
          <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Local Businesses with AI
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
            Seamless Loyalty. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Infinite Engagement.
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Welcome to the local business customer loyalty platform. Powering touch-first cashier workflows, live traffic insights, dynamic AI recovery promotions, and custom customer onboarding portals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 transition-all duration-200 group text-sm min-h-11 cursor-pointer"
            >
              Enter Control Panel
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm min-h-11 cursor-pointer"
            >
              Demo Captive Portal
              <Wifi className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-900/80 text-center lg:text-left mt-4">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Decoupled Core</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">Gemini</div>
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">AI Copywriting</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">Direct</div>
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">WhatsApp Link</div>
            </div>
          </div>
        </div>

        {/* Hub Portal Navigation Cards */}
        <div className="w-full max-w-lg lg:max-w-xl flex flex-col gap-4">
          <div className="text-xs uppercase font-bold tracking-wider text-zinc-500 px-2 flex items-center justify-between">
            <span>Select System Interface</span>
            <span className="flex items-center gap-1.5 text-indigo-400 normal-case font-semibold">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Deployment
            </span>
          </div>

          {/* Cashier Dashboard Link */}
          <Link
            href="/admin/cash"
            className="flex min-h-[44px] items-center justify-between p-4 rounded-2xl bg-zinc-900/30 hover:bg-indigo-950/20 border border-zinc-800/60 hover:border-indigo-500/40 backdrop-blur-xl group transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Coins className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  Cashier Portal
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">Touch Ops</span>
                </div>
                <p className="text-xs text-zinc-500 leading-normal mt-0.5">
                  Register visitor transactions & claim milestone rewards.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all duration-300" />
          </Link>

          {/* Manager Analytics Control Panel */}
          <Link
            href="/admin/dashboard"
            className="flex min-h-[44px] items-center justify-between p-4 rounded-2xl bg-zinc-900/30 hover:bg-purple-950/20 border border-zinc-800/60 hover:border-purple-500/40 backdrop-blur-xl group transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  Manager Dashboard
                  <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full font-semibold">Analytics</span>
                </div>
                <p className="text-xs text-zinc-500 leading-normal mt-0.5">
                  Inspect peak traffic charts, arrival feeds & predictions.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all duration-300" />
          </Link>

          {/* AI Promotions campaign writer */}
          <Link
            href="/admin/promotions"
            className="flex min-h-[44px] items-center justify-between p-4 rounded-2xl bg-zinc-900/30 hover:bg-emerald-950/20 border border-zinc-800/60 hover:border-emerald-500/40 backdrop-blur-xl group transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  Promotions Manager
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">AI Copy</span>
                </div>
                <p className="text-xs text-zinc-500 leading-normal mt-0.5">
                  Segment users and draft Gemini personalized campaigns.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all duration-300" />
          </Link>

          {/* Social content creation planner */}
          <Link
            href="/admin/social"
            className="flex min-h-[44px] items-center justify-between p-4 rounded-2xl bg-zinc-900/30 hover:bg-blue-950/20 border border-zinc-800/60 hover:border-blue-500/40 backdrop-blur-xl group transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                  Social Content Hub
                  <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full font-semibold">Planner</span>
                </div>
                <p className="text-xs text-zinc-500 leading-normal mt-0.5">
                  Create social posts & inject flash sales on low-traffic days.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all duration-300" />
          </Link>

          {/* Customer Captive WiFi Onboarding Portal */}
          <Link
            href="/portal"
            className="flex min-h-[44px] items-center justify-between p-4 rounded-2xl bg-zinc-900/30 hover:bg-zinc-800/40 border border-zinc-800/60 hover:border-zinc-700 backdrop-blur-xl group transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/40 text-zinc-300 border border-zinc-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white group-hover:text-zinc-200 transition-colors flex items-center gap-1.5">
                  WiFi Captive Portal
                  <span className="text-[10px] bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded-full font-semibold">User QR</span>
                </div>
                <p className="text-xs text-zinc-500 leading-normal mt-0.5">
                  Public customer onboarding, interactive QR and SSID flows.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transform group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </section>

      {/* Footer System Info */}
      <footer className="z-10 w-full max-w-6xl border-t border-zinc-900/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          © 2026 Loyalty Engine Hub. Built under Spec Driven Development protocols.
        </p>
        <div className="flex gap-4">
          <span className="text-[10px] text-zinc-600 font-mono">Next.js App Router (16.2.6)</span>
          <span className="text-[10px] text-zinc-600 font-mono">Tailwind CSS v4 (Glassmorphic)</span>
        </div>
      </footer>
    </main>
  );
}
