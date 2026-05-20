"use client";

import { useState, useCallback } from "react";
import type { SalesTransaction } from "@/backend/types/models.type";

const SALES_RECORD_ENDPOINT = "/api/v1/sales/record";
const SUCCESS_MESSAGE = "Sale registered successfully";

interface SalesRecordSuccessPayload {
  success: true;
  data: SalesTransaction;
}

interface SalesRecordErrorPayload {
  success: false;
  status?: number;
  error: string;
}

export interface UseCashierSalesResult {
  phoneNumber: string;
  amount: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  setPhoneNumber: (value: string) => void;
  setAmount: (value: string) => void;
  registerSale: () => Promise<void>;
}

/**
 * State abstraction hook for cashier sales registration.
 * Orchestrates form state, loading indicators, and POST to the sales record API.
 */
export function useCashierSales(): UseCashierSalesResult {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const registerSale = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(SALES_RECORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          amount: Number(amount),
        }),
      });

      const payload = (await response.json()) as
        | SalesRecordSuccessPayload
        | SalesRecordErrorPayload;

      if (response.status === 201 && payload.success === true) {
        setPhoneNumber("");
        setAmount("");
        setSuccessMessage(SUCCESS_MESSAGE);
        return;
      }

      const errorPayload = payload as SalesRecordErrorPayload;
      setError(
        errorPayload.error ||
          `Failed to register sale: ${response.statusText}`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while registering the sale";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, amount]);

  return {
    phoneNumber,
    amount,
    loading,
    error,
    successMessage,
    setPhoneNumber,
    setAmount,
    registerSale,
  };
}
