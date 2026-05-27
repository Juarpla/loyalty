"use client";

import React, { useState } from "react";
import { ArrivalsFeedComponent } from "@/components/dashboard/arrivals-feed.component";
import type {
  ArrivalNotificationWithMeta,
  ArrivalNotificationsSummary,
} from "@/backend/types/models.type";

const MOCK_NOTIFICATIONS: ArrivalNotificationWithMeta[] = [
  {
    loginId: "login-1",
    clientId: "client-1",
    name: "John Doe",
    phone_number: "+5491123456789",
    greetingText: "¡Hola John! Bienvenido de nuevo a Coffee Shop. ¿Qué tal tu día hoy?",
    whatsappUrl: "https://wa.me/5491123456789?text=Hola%20John",
    arrivedAt: "2026-05-27T10:00:00.000Z",
    generatedAt: "2026-05-27T10:00:00.000Z",
  },
  {
    loginId: "login-2",
    clientId: "client-2",
    name: "", // Anonymous fallback
    phone_number: "+5491198765432",
    greetingText: "¡Hola! Bienvenido a Coffee Shop. Disfruta de nuestra WiFi de alta velocidad.",
    whatsappUrl: "https://wa.me/5491198765432?text=Hola",
    arrivedAt: "2026-05-27T10:05:00.000Z",
    generatedAt: "2026-05-27T10:05:00.000Z",
  },
];

const MOCK_SUMMARY: ArrivalNotificationsSummary = {
  total: 2,
  named: 1,
  anonymous: 1,
  generatedAt: "2026-05-27T10:05:00.000Z",
  latestArrivalAt: "2026-05-27T10:05:00.000Z",
};

export default function TestArrivalsFeedPage() {
  const [scenario, setScenario] = useState<"loading" | "error" | "empty" | "populated">("populated");
  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const getProps = () => {
    switch (scenario) {
      case "loading":
        return {
          notifications: [],
          summary: null,
          loading: true,
          error: null,
        };
      case "error":
        return {
          notifications: [],
          summary: null,
          loading: false,
          error: "Connection failure. Please check your local server status.",
        };
      case "empty":
        return {
          notifications: [],
          summary: null,
          loading: false,
          error: null,
        };
      case "populated":
      default:
        return {
          notifications: MOCK_NOTIFICATIONS,
          summary: MOCK_SUMMARY,
          loading: false,
          error: null,
        };
    }
  };

  return (
    <main className="p-8 max-w-lg mx-auto bg-zinc-950 min-h-screen text-zinc-100 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black">Arrivals Feed Test Harness</h1>
        <p className="text-sm text-zinc-400">
          Switch scenarios to verify all visual states of the `ArrivalsFeedComponent`.
        </p>
      </div>

      {/* Scenario Controls */}
      <div className="flex flex-wrap gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl" data-testid="scenario-controls">
        {(["loading", "error", "empty", "populated"] as const).map((scen) => (
          <button
            key={scen}
            onClick={() => setScenario(scen)}
            data-testid={`scenario-btn-${scen}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              scenario === scen
                ? "bg-zinc-100 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {scen.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Debug Metadata */}
      <div className="text-xs text-zinc-500 flex justify-between px-1">
        <span>Active Scenario: <strong className="text-zinc-300" data-testid="active-scenario">{scenario}</strong></span>
        <span>Refresh Count: <strong className="text-zinc-300" data-testid="refresh-count">{refreshCount}</strong></span>
      </div>

      {/* Component Under Test */}
      <ArrivalsFeedComponent {...getProps()} onRefresh={handleRefresh} />
    </main>
  );
}
