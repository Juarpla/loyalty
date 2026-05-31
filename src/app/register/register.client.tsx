"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldPlus, UserPlus } from "lucide-react";

export default function RegisterClient() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = username.trim().length >= 2 && passcode.trim().length >= 4;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passcode }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/?registered=1");
        router.refresh();
      } else {
        setError("Use a username of at least 2 characters and a passcode of at least 4.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-[#090b16] via-[#05060c] to-[#010103] text-zinc-100 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      <div className="z-10 w-full max-w-md bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-indigo-600 opacity-60 rounded-t-3xl" />

        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-lg">
            <ShieldPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 justify-center">
              Create Gateway User
              <UserPlus className="w-4 h-4 text-emerald-400" />
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Register a local user and passcode for Gateway Security.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="username-input" className="text-xs font-semibold text-zinc-400 px-1">
              User
            </label>
            <input
              id="username-input"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={loading}
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 min-h-11 transition-all"
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="register-passcode-input" className="text-xs font-semibold text-zinc-400 px-1">
              New passcode
            </label>
            <input
              id="register-passcode-input"
              type="password"
              placeholder="••••••••"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              disabled={loading}
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 min-h-11 transition-all"
              required
            />
          </div>

          {error && (
            <div role="alert" className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 disabled:from-zinc-800 disabled:to-zinc-800 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm min-h-11 cursor-pointer group shadow-lg shadow-emerald-500/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-200" /> : <>Create user<ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-900/60 text-center">
          <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-block">
            Back to Gateway Security
          </Link>
        </div>
      </div>
    </main>
  );
}
