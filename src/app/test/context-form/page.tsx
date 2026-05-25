"use client";

import { useState, useCallback } from "react";
import {
  ContextForm,
  type ContextFormProps,
} from "@/components/social/context-form.component";

interface ScenarioData {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  onSubmit: () => void;
}

const SCENARIOS: Record<string, ScenarioData> = {
  idle: {
    loading: false,
    error: null,
    successMessage: null,
    onSubmit: () => {},
  },
  loading: {
    loading: true,
    error: null,
    successMessage: null,
    onSubmit: () => {},
  },
  error: {
    loading: false,
    error: "Failed to generate ideas. Context must be at least 3 characters.",
    successMessage: null,
    onSubmit: () => {},
  },
  success: {
    loading: false,
    error: null,
    successMessage: "Ideas generated successfully",
    onSubmit: () => {},
  },
};

export default function ContextFormTestPage() {
  const [scenario, setScenario] = useState<string>("idle");
  const [context, setContext] = useState("");

  const handleScenarioChange = useCallback((key: string) => {
    setScenario(key);
    setContext("");
  }, []);

  const { loading, error, successMessage, onSubmit } =
    SCENARIOS[scenario] ?? SCENARIOS.idle;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <h1 className="text-lg font-bold mb-4">Context Form Test Page</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(SCENARIOS).map((key) => (
          <button
            key={key}
            onClick={() => handleScenarioChange(key)}
            data-testid={`scenario-${key}`}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              scenario === key
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        <ContextForm
          context={context}
          loading={loading}
          error={error}
          successMessage={successMessage}
          setContext={setContext}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
