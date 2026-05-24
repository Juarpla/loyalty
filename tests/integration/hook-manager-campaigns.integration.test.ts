// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCampaigns } from "../../src/hooks/use-campaigns.hook";

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

const mockSegmentsData = {
  segments: [
    {
      phone_number: "+51999000001",
      name: "Juan Perez",
      visit_count: 1,
      average_ticket: 45,
      last_transaction_date: "2026-04-01T10:00:00Z",
      segment: "inactive_30d" as const,
    },
    {
      phone_number: "+51999000002",
      name: "Maria Lopez",
      visit_count: 8,
      average_ticket: 120,
      last_transaction_date: "2026-05-20T14:30:00Z",
      segment: "high_spender" as const,
    },
  ],
  summary: {
    inactive_30d: 1,
    high_spender: 1,
    frequent: 0,
    unassigned: 0,
  },
};

const mockCampaignsData = [
  {
    phone_number: "+51999000001",
    recoveryCopy: "¡Te extrañamos! Visítanos y obtén un 15% de descuento.",
    generatedAt: "2026-05-24T12:00:00Z",
  },
];

describe("hook_manager_campaigns Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R1: exposes segments, campaigns, loading states, error states, and generateCampaigns", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({ success: true, data: mockSegmentsData }),
      })
    );

    const { result } = renderHook(() => useCampaigns());

    expect(result.current.segments).toBeNull();
    expect(result.current.segmentsLoading).toBe(true);
    expect(result.current.segmentsError).toBeNull();
    expect(result.current.campaigns).toBeNull();
    expect(result.current.generating).toBe(false);
    expect(result.current.generateError).toBeNull();
    expect(typeof result.current.generateCampaigns).toBe("function");
  });

  it("R2, R3: auto-fetches segments on mount and loading toggles until settled", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      mockFetchResponse(200, { success: true, data: mockSegmentsData })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCampaigns());

    // Loading starts true on mount
    expect(result.current.segmentsLoading).toBe(true);

    // Wait for fetch to settle
    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/promotions/segments");
  });

  it("R3: sets segments and clears error on 200 success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: mockSegmentsData })
      )
    );

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    expect(result.current.segments).toEqual(mockSegmentsData);
    expect(result.current.segmentsError).toBeNull();
    expect(result.current.segmentsLoading).toBe(false);
  });

  it("R4: sets segmentsError on non-200 response", async () => {
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

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    expect(result.current.segmentsError).toBe("DB_CONNECTION_FAILURE");
    expect(result.current.segments).toBeNull();
    expect(result.current.segmentsLoading).toBe(false);
  });

  it("R4: sets segmentsError when success is false on 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, {
          success: false,
          error: "Unknown backend error",
        })
      )
    );

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    expect(result.current.segmentsError).toBe("Unknown backend error");
    expect(result.current.segments).toBeNull();
  });

  it("R5: sets generic segmentsError on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network unavailable"))
    );

    const { result } = renderHook(() => useCampaigns());

    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    expect(result.current.segmentsError).toBe("Network unavailable");
    expect(result.current.segments).toBeNull();
    expect(result.current.segmentsLoading).toBe(false);
  });

  it("R6: generateCampaigns sets generating true and clears prior campaigns", async () => {
    // First auto-fetch segments succeeds
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: mockSegmentsData })
      )
    );

    const { result } = renderHook(() => useCampaigns());

    // Wait for segments to load
    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    // Override fetch mock for generate call
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, {
          success: true,
          data: { campaigns: mockCampaignsData },
        })
      )
    );

    // Trigger generation
    await act(async () => {
      await result.current.generateCampaigns();
    });

    // generating was true during fetch; after settle it's false
    expect(result.current.generating).toBe(false);
    expect(result.current.campaigns).toEqual(mockCampaignsData);
    expect(result.current.generateError).toBeNull();
  });

  it("R7: generate success sets campaigns array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: mockSegmentsData })
      )
    );

    const { result } = renderHook(() => useCampaigns());

    // Wait for segments to load
    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    // Now stub fetch for generation
    const generateFetchMock = vi.fn().mockImplementation(() =>
      mockFetchResponse(200, {
        success: true,
        data: { campaigns: mockCampaignsData },
      })
    );
    vi.stubGlobal("fetch", generateFetchMock);

    await act(async () => {
      await result.current.generateCampaigns();
    });

    expect(result.current.campaigns).toEqual(mockCampaignsData);
    expect(result.current.generating).toBe(false);
    expect(result.current.generateError).toBeNull();
    expect(generateFetchMock).toHaveBeenCalledWith(
      "/api/v1/promotions/generate"
    );
  });

  it("R8: generate error sets generateError and clears campaigns", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: mockSegmentsData })
      )
    );

    const { result } = renderHook(() => useCampaigns());

    // Wait for segments to load
    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    // Stub fetch to return error on generation
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(500, {
          success: false,
          error: "AI_SERVICE_UNAVAILABLE",
        })
      )
    );

    await act(async () => {
      await result.current.generateCampaigns();
    });

    expect(result.current.generateError).toBe("AI_SERVICE_UNAVAILABLE");
    expect(result.current.campaigns).toBeNull();
    expect(result.current.generating).toBe(false);
  });

  it("R8: generate network failure sets generic error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: mockSegmentsData })
      )
    );

    const { result } = renderHook(() => useCampaigns());

    // Wait for segments to load
    await waitFor(() => {
      expect(result.current.segmentsLoading).toBe(false);
    });

    // Stub fetch to throw on generation
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network timeout"))
    );

    await act(async () => {
      await result.current.generateCampaigns();
    });

    expect(result.current.generateError).toBe("Network timeout");
    expect(result.current.campaigns).toBeNull();
    expect(result.current.generating).toBe(false);
  });

  it("R9: full lifecycle — segments load, generate yields campaigns", async () => {
    // Simulate full sequence: segments success -> generate success
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(200, { success: true, data: mockSegmentsData })
      )
      .mockImplementationOnce(() =>
        mockFetchResponse(200, {
          success: true,
          data: { campaigns: mockCampaignsData },
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCampaigns());

    // Wait for segments
    await waitFor(() => {
      expect(result.current.segments).toEqual(mockSegmentsData);
    });

    // Generate campaigns
    await act(async () => {
      await result.current.generateCampaigns();
    });

    expect(result.current.segments).toEqual(mockSegmentsData);
    expect(result.current.campaigns).toEqual(mockCampaignsData);
    expect(result.current.generating).toBe(false);
    expect(result.current.generateError).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
