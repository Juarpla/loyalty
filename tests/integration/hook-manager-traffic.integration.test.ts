// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTraffic } from "../../src/hooks/use-traffic.hook";

function mockFetchResponse(
  status: number,
  body: Record<string, unknown>
): ReturnType<typeof fetch> {
  return Promise.resolve({
    status,
    statusText: status === 200 ? "OK" : "Internal Server Error",
    ok: status >= 200 && status < 300,
    json: async () => body,
  } as Response);
}

const mockDistribution = {
  hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  weekdays: [5, 10, 15, 20, 25, 30, 35],
  peakHour: 23,
  peakWeekday: 6,
  totalTransactions: 276,
};

describe("hook_manager_traffic Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R1: exposes data, loading, error, and refresh", () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ success: true, data: mockDistribution }),
    }));

    const { result } = renderHook(() => useTraffic());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refresh).toBe("function");
  });

  it("R2, R3: auto-fetches on mount and keeps loading true until settled", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      mockFetchResponse(200, { success: true, data: mockDistribution })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useTraffic());

    // Loading starts true on mount
    expect(result.current.loading).toBe(true);

    // Wait for fetch to settle
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/sales/metrics");
  });

  it("R4: sets data and clears error on 200 success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: mockDistribution })
      )
    );

    const { result } = renderHook(() => useTraffic());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockDistribution);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("R5: sets error and clears data on non-200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(500, {
          success: false,
          status: 500,
          error: "DB_CONNECTION_FAILURE",
        })
      )
    );

    const { result } = renderHook(() => useTraffic());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("DB_CONNECTION_FAILURE");
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("R5: sets error when success is false on 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, {
          success: false,
          error: "Unknown backend error",
        })
      )
    );

    const { result } = renderHook(() => useTraffic());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Unknown backend error");
    expect(result.current.data).toBeNull();
  });

  it("R6: sets generic error and clears data on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network unavailable"))
    );

    const { result } = renderHook(() => useTraffic());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network unavailable");
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("R7: refresh re-fetches and updates state", async () => {
    const freshDistribution = {
      ...mockDistribution,
      totalTransactions: 500,
    };

    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(200, { success: true, data: mockDistribution })
      )
      .mockImplementationOnce(() =>
        mockFetchResponse(200, { success: true, data: freshDistribution })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useTraffic());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data?.totalTransactions).toBe(276);

    // Call refresh
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.data?.totalTransactions).toBe(500);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("R8: all states are testable via mocked fetch", async () => {
    // This test verifies the full lifecycle: success -> error -> success
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(200, { success: true, data: mockDistribution })
      )
      .mockImplementationOnce(() =>
        mockFetchResponse(500, {
          success: false,
          error: "Temporary failure",
        })
      )
      .mockImplementationOnce(() =>
        mockFetchResponse(200, { success: true, data: mockDistribution })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useTraffic());

    // Initial success
    await waitFor(() => {
      expect(result.current.data).toEqual(mockDistribution);
    });

    // Refresh with error
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.error).toBe("Temporary failure");
    expect(result.current.data).toBeNull();

    // Refresh with success again
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.data).toEqual(mockDistribution);
    expect(result.current.error).toBeNull();
  });
});
