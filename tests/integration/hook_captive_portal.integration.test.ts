// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePortal } from "../../src/hooks/use-portal.hook";

function mockFetchResponse(
  status: number,
  body: Record<string, unknown>
): ReturnType<typeof fetch> {
  return Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    statusText: status === 201 ? "Created" : "Error",
    json: async () => body,
  } as Response);
}

describe("hook_captive_portal Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R5: manages and exposes the correct initial hook state and reset function", () => {
    const { result } = renderHook(() => usePortal());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.registerClient).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("R1, R2: registerClient toggles loading state and POSTs to `/api/v1/portal/register`", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        mockFetchResponse(201, { success: true, client: { name: "Alice", phone: "1234567890" } })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => usePortal());

    let promise;
    act(() => {
      promise = result.current.registerClient({
        name: "Alice",
        phone: "1234567890",
      });
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/portal/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice", phone: "1234567890" }),
    });
  });

  it("R3: registerClient toggles loading state to false and sets isSuccess on successful registration", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(201, { success: true })
      )
    );

    const { result } = renderHook(() => usePortal());

    await act(async () => {
      await result.current.registerClient({
        name: "Bob",
        phone: "0987654321",
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("R4: registerClient handles API failure, sets error message and clears isSuccess", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(400, {
          success: false,
          error: "Phone format is invalid",
        })
      )
    );

    const { result } = renderHook(() => usePortal());

    await act(async () => {
      await result.current.registerClient({
        name: "Charlie",
        phone: "invalid-phone",
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe("Phone format is invalid");
  });

  it("R4: registerClient handles network failure, sets error message and clears states", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network connection lost"))
    );

    const { result } = renderHook(() => usePortal());

    await act(async () => {
      await result.current.registerClient({
        name: "Dave",
        phone: "5551234567",
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe("Network connection lost");
  });

  it("R5: reset function restores initial states", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(201, { success: true })
      )
    );

    const { result } = renderHook(() => usePortal());

    await act(async () => {
      await result.current.registerClient({
        name: "Eve",
        phone: "1112223333",
      });
    });

    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
