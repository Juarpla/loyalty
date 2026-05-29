// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useCompanySettings } from "../../src/hooks/use-company-settings.hook";

function mockFetchResponse(
  status: number,
  body: Record<string, unknown>
): ReturnType<typeof fetch> {
  return Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    statusText: status === 200 ? "OK" : "Error",
    json: async () => body,
  } as Response);
}

describe("hook_company_settings Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R10: manages and exposes the correct initial hook state and handlers", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        mockFetchResponse(200, {
          success: true,
          data: {
            ssid: "DemoSSID",
            wifi_password: "password123",
            welcome_title: "Welcome Title",
            welcome_message: "Welcome Message",
            brand_color: "#112233",
          },
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCompanySettings("demo-company"));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.ssid).toBe("DemoSSID");
    expect(result.current.wifiPassword).toBe("password123");
    expect(result.current.welcomeTitle).toBe("Welcome Title");
    expect(result.current.welcomeMessage).toBe("Welcome Message");
    expect(result.current.brandColor).toBe("#112233");
  });

  it("R10: handles fetch failure and sets the error message correctly", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        mockFetchResponse(400, {
          success: false,
          error: "Failed to fetch company settings",
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCompanySettings("demo-company"));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch company settings");
  });

  it("R10: validates required fields, length limits, and color hex format before posting", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, {
          success: true,
          data: { ssid: "DemoSSID", wifi_password: "password123" },
        })
      )
    );

    const { result } = renderHook(() => useCompanySettings("demo-company"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.setSsid("");
    });
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveSettings();
    });
    expect(saveResult).toBe(false);
    expect(result.current.error).toContain("SSID is required");

    await act(async () => {
      result.current.setSsid("ValidSSID");
      result.current.setWifiPassword("short");
    });
    await act(async () => {
      saveResult = await result.current.saveSettings();
    });
    expect(saveResult).toBe(false);
    expect(result.current.error).toContain("WiFi password must be between 8 and 64 characters");

    await act(async () => {
      result.current.setWifiPassword("validpassword123");
      result.current.setBrandColor("invalid-color");
    });
    await act(async () => {
      saveResult = await result.current.saveSettings();
    });
    expect(saveResult).toBe(false);
    expect(result.current.error).toContain("Brand color is invalid");
  });

  it("R10: saveSettings toggles saving state and POSTs payload, then sets success", async () => {
    const postCallMock = vi.fn().mockImplementation(() =>
      mockFetchResponse(200, { success: true })
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url, options) => {
        if (options && options.method === "POST") {
          return postCallMock();
        }
        return mockFetchResponse(200, {
          success: true,
          data: { ssid: "DemoSSID", wifi_password: "password123" },
        });
      })
    );

    const { result } = renderHook(() => useCompanySettings("demo-company"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.setSsid("NewSSID");
      result.current.setWifiPassword("newsecurepassword");
      result.current.setWelcomeTitle("New Title");
      result.current.setWelcomeMessage("New Message");
      result.current.setBrandColor("#aabbcc");
    });

    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveSettings();
    });

    expect(saveResult).toBe(true);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
    expect(postCallMock).toHaveBeenCalledTimes(1);
  });
});
