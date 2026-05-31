import { CheckCircle2 } from "lucide-react";

type RegistrationToastProps = {
  visible: boolean;
};

export function RegistrationToast({ visible }: RegistrationToastProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-500/25 bg-zinc-950/90 px-4 py-3 text-sm text-zinc-100 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
        <CheckCircle2 className="h-5 w-5" />
      </span>
      <span className="leading-snug">
        Your user was created. You can now sign in through Gateway Security.
      </span>
    </div>
  );
}
