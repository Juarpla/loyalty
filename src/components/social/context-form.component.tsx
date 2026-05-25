"use client";

export interface ContextFormProps {
  context: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  setContext: (value: string) => void;
  onSubmit: () => void;
}

export function ContextForm({
  context,
  loading,
  error,
  successMessage,
  setContext,
  onSubmit,
}: ContextFormProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg">
        {error && (
          <div
            role="alert"
            data-testid="context-error"
            className="mb-4 rounded-xl bg-red-900/30 border border-red-700/50 px-4 py-3 text-sm text-red-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            data-testid="context-success"
            className="mb-4 rounded-xl bg-emerald-900/30 border border-emerald-700/50 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            {successMessage}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="social-context"
            className="text-sm font-medium text-zinc-300"
          >
            Social Post Context
          </label>
          <textarea
            id="social-context"
            name="context"
            rows={6}
            aria-label="Describe your social post idea"
            placeholder="e.g. Weekend special offer for our regular customers..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-vertical min-h-[120px] sm:rows-4"
            data-testid="context-textarea"
          />
        </div>

        <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
          <span>{context.length} / 3 min</span>
          {context.length > 0 && context.length < 3 && (
            <span className="text-amber-400">
              Minimum 3 characters required
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full mt-4 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 transition-colors min-h-11"
          data-testid="context-submit"
        >
          {loading && (
            <svg
              className="h-5 w-5 animate-spin text-white inline mr-2"
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
          Generate Ideas
        </button>
      </div>
    </div>
  );
}
