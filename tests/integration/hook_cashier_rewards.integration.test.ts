// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRewards } from "../../src/hooks/use-rewards.hook";

function mockFetchResponse(
  status: number,
  body: Record<string, unknown>
): ReturnType<typeof fetch> {
  return Promise.resolve({
    status,
    statusText: status >= 200 && status < 300 ? "OK" : "Error",
    ok: status >= 200 && status < 300,
    json: async () => body,
  } as Response);
}

describe("hook_cashier_rewards Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R10: exposes all state fields and callbacks with correct initial values", () => {
    vi.stubGlobal("fetch", vi.fn());

    const { result } = renderHook(() => useRewards());

    expect(result.current.isMilestoneReached).toBe(false);
    expect(result.current.modalVisible).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.successMessage).toBeNull();
    expect(typeof result.current.checkMilestone).toBe("function");
    expect(typeof result.current.claimReward).toBe("function");
    expect(typeof result.current.dismissModal).toBe("function");
  });

  it("R2: loading toggles true during checkMilestone then false after resolution", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: { message: "Reward claimed successfully" } })
      )
    );

    const { result } = renderHook(() => useRewards());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.checkMilestone("client-abc-123");
    });

    expect(result.current.loading).toBe(false);
  });

  it("R3: isMilestoneReached and modalVisible become true when endpoint returns success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: { message: "Reward claimed successfully" } })
      )
    );

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.checkMilestone("client-abc-123");
    });

    expect(result.current.isMilestoneReached).toBe(true);
    expect(result.current.modalVisible).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("R4: isMilestoneReached stays false and modalVisible stays false on 400 milestone-not-reached", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(400, {
          success: false,
          status: 400,
          error: "Validation failed: Milestone not reached",
        })
      )
    );

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.checkMilestone("client-abc-123");
    });

    expect(result.current.isMilestoneReached).toBe(false);
    expect(result.current.modalVisible).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("R5: error is populated and loading is false on network failure in checkMilestone", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network unavailable"))
    );

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.checkMilestone("client-abc-123");
    });

    expect(result.current.error).toBe(
      "An unexpected error occurred while checking the milestone"
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.modalVisible).toBe(false);
  });

  it("R5: error is set when checkMilestone is called with empty clientId", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.checkMilestone("");
    });

    expect(result.current.error).toBe("Client ID is required");
    expect(result.current.loading).toBe(false);
  });

  it("R6, R7: claimReward toggles loading and resets modal and milestone on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, { success: true, data: { message: "Reward claimed successfully" } })
      )
    );

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.claimReward("client-abc-123");
    });

    expect(result.current.modalVisible).toBe(false);
    expect(result.current.isMilestoneReached).toBe(false);
    expect(result.current.successMessage).toBe("Reward claimed successfully");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("R8: error is set when claimReward returns a non-success response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(500, {
          success: false,
          error: "DB_CONNECTION_FAILURE",
        })
      )
    );

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.claimReward("client-abc-123");
    });

    expect(result.current.error).toBe("DB_CONNECTION_FAILURE");
    expect(result.current.loading).toBe(false);
  });

  it("R8: error is set when claimReward suffers a network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Connection refused"))
    );

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.claimReward("client-abc-123");
    });

    expect(result.current.error).toBe(
      "An unexpected error occurred while claiming the reward"
    );
    expect(result.current.loading).toBe(false);
  });

  it("R9: dismissModal sets modalVisible to false without network calls", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      mockFetchResponse(200, { success: true, data: { message: "Reward claimed successfully" } })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.checkMilestone("client-abc-123");
    });

    expect(result.current.modalVisible).toBe(true);

    act(() => {
      result.current.dismissModal();
    });

    expect(result.current.modalVisible).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("R2, R3, R7: full lifecycle — check milestone shows modal, claim reward resets it", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        mockFetchResponse(200, { success: true, data: { message: "Reward claimed successfully" } })
      )
      .mockImplementationOnce(() =>
        mockFetchResponse(200, { success: true, data: { message: "Reward claimed successfully" } })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRewards());

    await act(async () => {
      await result.current.checkMilestone("client-abc-123");
    });

    expect(result.current.modalVisible).toBe(true);
    expect(result.current.isMilestoneReached).toBe(true);

    await act(async () => {
      await result.current.claimReward("client-abc-123");
    });

    expect(result.current.modalVisible).toBe(false);
    expect(result.current.isMilestoneReached).toBe(false);
    expect(result.current.successMessage).toBe("Reward claimed successfully");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
