"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-red-400 bg-zinc-900/60 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 min-h-9 cursor-pointer"
      title="Log out of administrative session"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{loading ? "Exiting..." : "Logout"}</span>
    </button>
  );
}
