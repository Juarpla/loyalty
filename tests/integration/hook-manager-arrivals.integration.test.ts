// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useArrivals } from "../../src/hooks/use-arrivals.hook";

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

const mockNotifications = [
  {
    phone_number: "+51999000001",
    name: "Ana Torres",
    greetingText: "Hola Ana Torres, bienvenida de vuelta.",
    whatsappUrl: "https://wa.me/51999000001?text=Hola%20Ana",
    generatedAt: "2026-05-27T07:00:00.000Z",
    clientId: "cli-arrival-001",
    loginId: "log-arrival-001",
    arrivedAt: "2026-05-27T06:58:00.000Z",
  },
];

const mockSummary = {
  total: 1,
  named: 1,
  anonymous: 0,
  generatedAt: "2026-05-27T07:00:00.000Z",
  latestArrivalAt: "2026-05-27T06:58:00.000Z",
};

const refreshedNotifications = [
  {
    phone_number: "+51999000002",
    name: null,
    greetingText: "Hola, bienvenida de vuelta.",
    whatsappUrl: "https://wa.me/51999000002?text=Hola",
    generatedAt: "2026-05-27T07:05:00.000Z",
    clientId: "cli-arrival-002",
    loginId: "log-arrival-002",
    arrivedAt: "2026-05-27T07:04:00.000Z",
  },
];

const refreshedSummary = {
  total: 1,
  named: 0,
  anonymous: 1,
  generatedAt: "2026-05-27T07:05:00.000Z",
  latestArrivalAt: "2026-05-27T07:04:00.000Z",
};

describe("hook_manager_arrivals Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R1: exposes notifications, summary, loading, error, and refresh", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({
          success: true,
          data: { notifications: mockNotifications, summary: mockSummary },
        }),
      })
    );

    const { result } = renderHook(() => useArrivals());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.summary).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refresh).toBe("function");
  });

  it("R2, R3: auto-fetches arrivals on mount and keeps loading true until settled", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      mockFetchResponse(200, {
        success: true,
        data: { notifications: mockNotifications, summary: mockSummary },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useArrivals());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/arrivals/notifications");
  });

  it("R4: stores notifications and summary on 200 success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, {
          success: true,
          data: { notifications: mockNotifications, summary: mockSummary },
        })
      )
    );

    const { result } = renderHook(() => useArrivals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.notifications).toEqual(mockNotifications);
    expect(result.current.summary).toEqual(mockSummary);
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

    const { result } = renderHook(() => useArrivals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("DB_CONNECTION_FAILURE");
    expect(result.current.notifications).toEqual([]);
    expect(result.current.summary).toBeNull();
  });

  it("R5: sets error when success is false on a 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, {
          success: false,
          error: "Failed to get arrival notifications",
        })
      )
    );

    const { result } = renderHook(() => useArrivals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to get arrival notifications");
    expect(result.current.notifications).toEqual([]);
    expect(result.current.summary).toBeNull();
  });

  it("R6: sets a generic arrival error and clears data on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down"))
    );

    const { result } = renderHook(() => useArrivals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(
      "An unexpected error occurred while loading arrival notifications"
    );
    expect(result.current.notifications).toEqual([]);
    expect(result.current.summary).toBeNull();
  });

  it("R7, R8: refresh re-fetches arrivals and updates state", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(200, {
          success: true,
          data: { notifications: mockNotifications, summary: mockSummary },
        })
      )
      .mockImplementationOnce(() =>
        mockFetchResponse(200, {
          success: true,
          data: {
            notifications: refreshedNotifications,
            summary: refreshedSummary,
          },
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useArrivals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.notifications).toEqual(refreshedNotifications);
    expect(result.current.summary).toEqual(refreshedSummary);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
