// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCashierSales } from "../../src/hooks/use-cashier-sales.hook";

function mockFetchResponse(
  status: number,
  body: Record<string, unknown>
): ReturnType<typeof fetch> {
  return Promise.resolve({
    status,
    statusText: status === 201 ? "Created" : "Bad Request",
    json: async () => body,
  } as Response);
}

describe("hook_cashier_sales Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R1: exposes controlled form state and setters", () => {
    const { result } = renderHook(() => useCashierSales());

    expect(result.current.phoneNumber).toBe("");
    expect(result.current.amount).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.successMessage).toBeNull();

    act(() => {
      result.current.setPhoneNumber("+51987654321");
      result.current.setAmount("42.50");
    });

    expect(result.current.phoneNumber).toBe("+51987654321");
    expect(result.current.amount).toBe("42.50");
  });

  it("R2, R3: registerSale toggles loading and POSTs to the sales record API", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        mockFetchResponse(201, {
          success: true,
          data: {
            id: "tx-1",
            phone_number: "+51987654321",
            amount: 42.5,
            created_at: "2026-05-20T00:00:00.000Z",
          },
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCashierSales());

    act(() => {
      result.current.setPhoneNumber("+51987654321");
      result.current.setAmount("42.50");
    });

    act(() => {
      void result.current.registerSale();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/sales/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: "+51987654321",
        amount: 42.5,
      }),
    });
  });

  it("R4: clears form fields and sets successMessage on 201 success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(201, {
          success: true,
          data: {
            id: "tx-2",
            phone_number: "+51911111111",
            amount: 10,
            created_at: "2026-05-20T00:00:00.000Z",
          },
        })
      )
    );

    const { result } = renderHook(() => useCashierSales());

    act(() => {
      result.current.setPhoneNumber("+51911111111");
      result.current.setAmount("10");
    });

    await act(async () => {
      await result.current.registerSale();
    });

    expect(result.current.phoneNumber).toBe("");
    expect(result.current.amount).toBe("");
    expect(result.current.successMessage).toBe("Sale registered successfully");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("R5: preserves form values and sets error on API failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(400, {
          success: false,
          status: 400,
          error: "Invalid phone number format",
        })
      )
    );

    const { result } = renderHook(() => useCashierSales());

    act(() => {
      result.current.setPhoneNumber("bad-phone");
      result.current.setAmount("15");
    });

    await act(async () => {
      await result.current.registerSale();
    });

    expect(result.current.phoneNumber).toBe("bad-phone");
    expect(result.current.amount).toBe("15");
    expect(result.current.error).toBe("Invalid phone number format");
    expect(result.current.successMessage).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("R6: preserves form values and sets error on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network unavailable"))
    );

    const { result } = renderHook(() => useCashierSales());

    act(() => {
      result.current.setPhoneNumber("+51922222222");
      result.current.setAmount("99");
    });

    await act(async () => {
      await result.current.registerSale();
    });

    expect(result.current.phoneNumber).toBe("+51922222222");
    expect(result.current.amount).toBe("99");
    expect(result.current.error).toBe("Network unavailable");
    expect(result.current.successMessage).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
