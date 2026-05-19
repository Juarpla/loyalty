"use client";

import { useState } from "react";

/**
 * Premium Captive Wi-Fi QR Code component
 * Uses glassmorphism and subtle animations.
 */
export function WifiQRComponent() {
  const [copied, setCopied] = useState(false);

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText("SSID: Loyalty-Free-Wifi\nPASS: loyalty123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-6 shadow-2xl relative overflow-hidden group">
      {/* Visual Accent Lights */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 blur-[40px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
          Automatic Join
        </span>
        <h4 className="text-lg font-bold text-white tracking-tight">Wi-Fi Connection Gateway</h4>
        <p className="text-xs text-zinc-500">Scan code below with your phone camera to connect</p>
      </div>

      {/* QR Code Container */}
      <div className="flex items-center justify-center p-4 bg-zinc-900 border border-zinc-800/80 rounded-2xl mb-6 relative group-hover:border-zinc-700/60 transition-all duration-300">
        <div className="w-40 h-40 bg-white rounded-lg p-2 flex flex-col items-center justify-center relative shadow-inner">
          {/* Simulated Premium QR Code Matrix */}
          <div className="w-full h-full relative opacity-90">
            {/* Corner Anchors */}
            <div className="absolute top-0 left-0 w-10 h-10 border-[3px] border-zinc-950 rounded-sm" />
            <div className="absolute top-1.5 left-1.5 w-7 h-7 bg-zinc-950 rounded-sm" />

            <div className="absolute top-0 right-0 w-10 h-10 border-[3px] border-zinc-950 rounded-sm" />
            <div className="absolute top-1.5 right-1.5 w-7 h-7 bg-zinc-950 rounded-sm" />

            <div className="absolute bottom-0 left-0 w-10 h-10 border-[3px] border-zinc-950 rounded-sm" />
            <div className="absolute bottom-1.5 left-1.5 w-7 h-7 bg-zinc-950 rounded-sm" />

            {/* Matrix dots simulation */}
            <div className="absolute inset-x-0 inset-y-0 m-auto w-24 h-24 border-2 border-dashed border-zinc-950/20 rounded flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-zinc-950/60 uppercase">Scan Me</span>
            </div>

            {/* Micro QR grid details */}
            <div className="absolute top-12 right-2 w-3 h-3 bg-zinc-950 rounded-sm" />
            <div className="absolute bottom-12 right-2 w-4 h-2 bg-zinc-950 rounded-sm" />
            <div className="absolute bottom-2 right-12 w-2 h-4 bg-zinc-950 rounded-sm" />
            <div className="absolute top-12 left-12 w-4 h-4 bg-zinc-950/10 rounded-sm" />
          </div>

          {/* Central Logo Overlay */}
          <div className="absolute w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-extrabold text-xs border border-zinc-800 shadow-md">
            WIFI
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 mb-4 text-xs font-mono text-zinc-400">
        <div className="flex justify-between">
          <span className="text-zinc-600">SSID:</span>
          <span className="text-zinc-200 font-bold">Loyalty-Free-Wifi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-600">SECURITY:</span>
          <span className="text-zinc-200">WPA/WPA2-PSK</span>
        </div>
      </div>

      {/* Interactive Actions */}
      <button
        onClick={handleCopyCredentials}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
          copied
            ? "bg-teal-500 text-zinc-950 shadow-lg shadow-teal-500/20"
            : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:text-white border border-zinc-700/60"
        }`}
      >
        {copied ? "Copied Credentials!" : "Copy Wi-Fi Password"}
      </button>
    </div>
  );
}
