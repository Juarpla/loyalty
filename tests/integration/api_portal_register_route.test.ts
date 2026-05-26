import { describe, it, expect, vi } from "vitest";
import { POST } from "../../src/app/api/v1/portal/register/route";
import * as portalController from "../../src/backend/controllers/portal.controller";

describe("api_portal_register_route Integration Tests", () => {
  it("R1, R3, R5, R6: should return 201 Created on successful registration", async () => {
    const mockBody = { name: "Test User", phone: "+1234567890" };
    const mockReq = new Request("http://localhost/api/v1/portal/register", {
      method: "POST",
      body: JSON.stringify(mockBody),
    });

    const spy = vi.spyOn(portalController, "registerPortalClient").mockResolvedValueOnce({
      success: true,
      status: 200,
      data: { id: "123", name: "Test User", phone: "+1234567890" }
    });

    const res = await POST(mockReq);
    expect(res.status).toBe(201);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Test User");
    
    expect(spy).toHaveBeenCalledWith(mockBody);
  });

  it("R1, R2, R6: should return 400 Bad Request for invalid JSON payload", async () => {
    const mockReq = new Request("http://localhost/api/v1/portal/register", {
      method: "POST",
      body: "{ invalid json ",
    });

    const res = await POST(mockReq);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid JSON payload");
  });

  it("R3, R4, R6: should map controller error to correct status code", async () => {
    const mockBody = { name: "A", phone: "123" }; // Invalid validation
    const mockReq = new Request("http://localhost/api/v1/portal/register", {
      method: "POST",
      body: JSON.stringify(mockBody),
    });

    vi.spyOn(portalController, "registerPortalClient").mockResolvedValueOnce({
      success: false,
      status: 400,
      error: "Validation failed"
    });

    const res = await POST(mockReq);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
  });

  it("R4, R6: should default to 500 status code if controller returns false without status", async () => {
    const mockReq = new Request("http://localhost/api/v1/portal/register", {
      method: "POST",
      body: JSON.stringify({}),
    });

    vi.spyOn(portalController, "registerPortalClient").mockResolvedValueOnce({
      success: false,
      error: "Unknown error"
    });

    const res = await POST(mockReq);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unknown error");
  });
});
