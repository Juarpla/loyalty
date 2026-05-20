"use client";

import { useState, useEffect, type FormEvent } from "react";

export interface CashierFormProps {
  onSubmit: (phoneNumber: string, amount: string) => void;
  loading?: boolean;
  // Controlled state props — when provided, form uses them as state source (R3)
  phoneNumber?: string;
  amount?: string;
  setPhoneNumber?: (value: string) => void;
  setAmount?: (value: string) => void;
}

type FocusedField = "phone" | "amount" | null;

const TOUCHPAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const;
const MOBILE_BREAKPOINT = 768;

function appendToField(current: string, digit: string): string {
  return `${current}${digit}`;
}

function removeLastCharacter(current: string): string {
  return current.slice(0, -1);
}

export function CashierForm({
  onSubmit,
  loading = false,
  phoneNumber: controlledPhone,
  amount: controlledAmount,
  setPhoneNumber: controlledSetPhone,
  setAmount: controlledSetAmount,
}: CashierFormProps) {
  // Internal fallback state when controlled props are not provided
  const [internalPhone, setInternalPhone] = useState("");
  const [internalAmount, setInternalAmount] = useState("");

  // Use controlled external state when provided; fall back to internal
  const phoneNumber = controlledPhone ?? internalPhone;
  const setPhone = controlledSetPhone ?? setInternalPhone;
  const amount = controlledAmount ?? internalAmount;
  const setAmountFn = controlledSetAmount ?? setInternalAmount;

  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [viewportWidth, setViewportWidth] = useState(1024);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const showTouchpad = viewportWidth < MOBILE_BREAKPOINT;

  const applyToFocusedField = (transform: (value: string) => string) => {
    const target = focusedField ?? "phone";
    if (target === "phone") {
      setPhone(transform(phoneNumber));
      if (focusedField === null) {
        setFocusedField("phone");
      }
    } else {
      setAmountFn(transform(amount));
      if (focusedField === null) {
        setFocusedField("amount");
      }
    }
  };

  const handleDigitPress = (digit: string) => {
    applyToFocusedField((value) => appendToField(value, digit));
  };

  const handleBackspace = () => {
    applyToFocusedField(removeLastCharacter);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading) {
      onSubmit(phoneNumber, amount);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto flex flex-col gap-6 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80"
      data-testid="cashier-form"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="cashier-phone" className="text-sm font-medium text-zinc-300">
          Phone number
        </label>
        <input
          id="cashier-phone"
          name="phone_number"
          type="tel"
          autoComplete="tel"
          aria-label="Customer phone number"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={() => setFocusedField("phone")}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          data-testid="cashier-phone-input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cashier-amount" className="text-sm font-medium text-zinc-300">
          Sale amount
        </label>
        <input
          id="cashier-amount"
          name="amount"
          type="text"
          inputMode="decimal"
          aria-label="Sale amount"
          value={amount}
          onChange={(e) => setAmountFn(e.target.value)}
          onFocus={() => setFocusedField("amount")}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          data-testid="cashier-amount-input"
        />
      </div>

      {showTouchpad && (
        <div
          className="grid grid-cols-3 gap-2"
          data-testid="cashier-touchpad"
          role="group"
          aria-label="Numeric keypad"
        >
          {TOUCHPAD_DIGITS.slice(0, 9).map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 py-4 text-lg font-semibold text-zinc-100 hover:bg-zinc-700 active:scale-95 transition-transform"
              data-testid={`cashier-touchpad-${digit}`}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Backspace"
            className="rounded-xl border border-zinc-700 bg-zinc-800 py-4 text-lg font-semibold text-zinc-100 hover:bg-zinc-700 active:scale-95 transition-transform"
            data-testid="cashier-touchpad-backspace"
          >
            ⌫
          </button>
          <button
            type="button"
            onClick={() => handleDigitPress("0")}
            className="rounded-xl border border-zinc-700 bg-zinc-800 py-4 text-lg font-semibold text-zinc-100 hover:bg-zinc-700 active:scale-95 transition-transform"
            data-testid="cashier-touchpad-0"
          >
            0
          </button>
          <div aria-hidden="true" />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        data-testid="cashier-submit"
      >
        {loading && (
          <svg
            className="h-5 w-5 animate-spin text-white"
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
        Register Sale
      </button>
    </form>
  );
}
