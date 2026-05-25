import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SocialController } from "../../src/backend/controllers/social.controller";
import { POST } from "../../src/app/api/v1/social/ideas/route";

describe("api_social_ideas_route Integration Tests", () => {
  const originalHandleSocialIdeas = SocialController.handleSocialIdeas;

  beforeEach(() => {
    SocialController.handleSocialIdeas = originalHandleSocialIdeas;
  });

  afterEach(() => {
    SocialController.handleSocialIdeas = originalHandleSocialIdeas;
  });

  it("R4: should return 200 OK with success payload containing ideas", async () => {
    const mockIdeas = [
      {
        title: "Test Title",
        body: "Test body content",
        visualPrompt: "A vibrant scene",
        hashtags: ["#test", "#social"],
      },
    ];

    SocialController.handleSocialIdeas = async () => ({
      success: true,
      data: { ideas: mockIdeas },
    });

    const request = new Request("http://localhost/api/v1/social/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "test context for social post" }),
    });

    const res = await POST(request);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.ideas).toEqual(mockIdeas);
  });

  it("R5: should return 400 on controller validation error", async () => {
    SocialController.handleSocialIdeas = async () => ({
      success: false,
      status: 400,
      error: "Context must be at least 3 characters long",
    });

    const request = new Request("http://localhost/api/v1/social/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "ab" }),
    });

    const res = await POST(request);
    expect(res).toBeDefined();
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Context must be at least 3 characters long");
  });

  it("R5: should return 500 on controller server error", async () => {
    SocialController.handleSocialIdeas = async () => ({
      success: false,
      status: 500,
      error: "Internal server error",
    });

    const request = new Request("http://localhost/api/v1/social/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "valid context" }),
    });

    const res = await POST(request);
    expect(res).toBeDefined();
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Internal server error");
  });

  it("R6: should return 500 with INTERNAL_SERVER_ERROR on unexpected exception", async () => {
    SocialController.handleSocialIdeas = async () => {
      throw new Error("UNEXPECTED_CRASH");
    };

    const request = new Request("http://localhost/api/v1/social/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "valid context" }),
    });

    const res = await POST(request);
    expect(res).toBeDefined();
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("INTERNAL_SERVER_ERROR");
  });
});
