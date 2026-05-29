import { afterEach, describe, expect, it, vi } from "vitest";

import { CompanyController } from "../../src/backend/controllers/company.controller";
import { GET, POST } from "../../src/app/api/v1/company/[companyId]/wifi/route";

afterEach(() => {
  vi.restoreAllMocks();
});

function companyRouteContext(companyId: string) {
  return {
    params: Promise.resolve({ companyId }),
  };
}

describe("api_company_wifi_routes Integration Tests", () => {
  it("R1, R2, R3: exposes GET, delegates the dynamic company ID, and returns 200 success JSON", async () => {
    const controllerPayload = {
      success: true,
      status: 200,
      data: {
        company_id: "company-alpha",
        ssid: "Cafe Alpha",
        wifi_password: "securepass123",
      },
    };
    const controllerSpy = vi
      .spyOn(CompanyController, "getWifiSettings")
      .mockResolvedValueOnce(controllerPayload);

    const response = await GET(
      new Request("http://localhost/api/v1/company/company-alpha/wifi"),
      companyRouteContext("company-alpha"),
    );
    const data = await response.json();

    expect(controllerSpy).toHaveBeenCalledTimes(1);
    expect(controllerSpy).toHaveBeenCalledWith("company-alpha");
    expect(response.status).toBe(200);
    expect(data).toEqual(controllerPayload);
  });

  it("R4, R5: exposes POST, parses JSON, delegates company ID plus body, and returns success JSON", async () => {
    const requestBody = {
      ssid: "Cafe Alpha",
      wifi_password: "securepass123",
      brand_color: "#1f7a4d",
    };
    const controllerPayload = {
      success: true,
      status: 200,
      data: {
        company_id: "company-alpha",
        ...requestBody,
      },
    };
    const controllerSpy = vi
      .spyOn(CompanyController, "upsertWifiSettings")
      .mockResolvedValueOnce(controllerPayload);

    const response = await POST(
      new Request("http://localhost/api/v1/company/company-alpha/wifi", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      companyRouteContext("company-alpha"),
    );
    const data = await response.json();

    expect(controllerSpy).toHaveBeenCalledTimes(1);
    expect(controllerSpy).toHaveBeenCalledWith("company-alpha", requestBody);
    expect(response.status).toBe(200);
    expect(data).toEqual(controllerPayload);
  });

  it("R6: returns 400 for malformed POST JSON without calling the controller", async () => {
    const controllerSpy = vi.spyOn(CompanyController, "upsertWifiSettings");

    const response = await POST(
      new Request("http://localhost/api/v1/company/company-alpha/wifi", {
        method: "POST",
        body: "{ invalid json ",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      companyRouteContext("company-alpha"),
    );
    const data = await response.json();

    expect(controllerSpy).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      status: 400,
      error: "Invalid JSON payload",
    });
  });

  it("R7, R8: maps controller-provided GET error statuses into the HTTP response", async () => {
    const controllerPayload = {
      success: false,
      status: 400,
      error: "Validation failed: Company ID is required",
    };
    vi.spyOn(CompanyController, "getWifiSettings").mockResolvedValueOnce(
      controllerPayload,
    );

    const response = await GET(
      new Request("http://localhost/api/v1/company/%20/wifi"),
      companyRouteContext(" "),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual(controllerPayload);
  });

  it("R7, R8: defaults POST controller error packets without status to HTTP 500", async () => {
    const controllerPayload = {
      success: false,
      error: "Unknown error",
    };
    vi.spyOn(CompanyController, "upsertWifiSettings").mockResolvedValueOnce(
      controllerPayload,
    );

    const response = await POST(
      new Request("http://localhost/api/v1/company/company-alpha/wifi", {
        method: "POST",
        body: JSON.stringify({ ssid: "Cafe Alpha" }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      companyRouteContext("company-alpha"),
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual(controllerPayload);
  });
});
