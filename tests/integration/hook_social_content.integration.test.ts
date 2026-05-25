// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSocialIdeas } from "../../src/hooks/use-social.hook";

function mockFetchResponse(
  status: number,
  body: Record<string, unknown>
): ReturnType<typeof fetch> {
  return Promise.resolve({
    status,
    statusText: status === 200 ? "OK" : "Bad Request",
    json: async () => body,
  } as Response);
}

describe("hook_social_content Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("R1: exposes controlled context form state and setter", () => {
    const { result } = renderHook(() => useSocialIdeas());

    expect(result.current.context).toBe("");
    expect(result.current.ideas).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.successMessage).toBeNull();

    act(() => {
      result.current.setContext("Summer promotion");
    });

    expect(result.current.context).toBe("Summer promotion");
  });

  it("R2, R3: generateIdeas toggles loading and POSTs to the social ideas API", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        mockFetchResponse(200, {
          success: true,
          data: {
            ideas: [
              {
                title: "Summer Vibes",
                body: "Enjoy our summer specials!",
                visualPrompt: "Sunny beach scene",
                hashtags: ["#summer", "#sale"],
              },
            ],
          },
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useSocialIdeas());

    act(() => {
      result.current.setContext("Summer promotion");
    });

    act(() => {
      void result.current.generateIdeas();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/social/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "Summer promotion" }),
    });
  });

  it("R4: stores ideas, clears context, and sets successMessage on 200 success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(200, {
          success: true,
          data: {
            ideas: [
              {
                title: "Winter Sale",
                body: "Cozy winter discounts",
                visualPrompt: "Snowy landscape",
                hashtags: ["#winter", "#sale"],
              },
              {
                title: "Holiday Special",
                body: "Celebrate with us",
                visualPrompt: "Holiday decorations",
                hashtags: ["#holiday", "#family"],
              },
            ],
          },
        })
      )
    );

    const { result } = renderHook(() => useSocialIdeas());

    act(() => {
      result.current.setContext("Winter campaign");
    });

    await act(async () => {
      await result.current.generateIdeas();
    });

    expect(result.current.ideas).toHaveLength(2);
    expect(result.current.ideas[0].title).toBe("Winter Sale");
    expect(result.current.context).toBe("");
    expect(result.current.successMessage).toBe("Ideas generated successfully");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("R5: preserves context and sets error on API failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        mockFetchResponse(400, {
          success: false,
          status: 400,
          error: "Context must be at least 3 characters",
        })
      )
    );

    const { result } = renderHook(() => useSocialIdeas());

    act(() => {
      result.current.setContext("ab");
    });

    await act(async () => {
      await result.current.generateIdeas();
    });

    expect(result.current.context).toBe("ab");
    expect(result.current.error).toBe("Context must be at least 3 characters");
    expect(result.current.successMessage).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.ideas).toEqual([]);
  });

  it("R6: preserves context and sets error on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network unavailable"))
    );

    const { result } = renderHook(() => useSocialIdeas());

    act(() => {
      result.current.setContext("Summer promotion");
    });

    await act(async () => {
      await result.current.generateIdeas();
    });

    expect(result.current.context).toBe("Summer promotion");
    expect(result.current.error).toBe("Network unavailable");
    expect(result.current.successMessage).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
