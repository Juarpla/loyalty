import { afterEach, describe, expect, it, vi } from "vitest";

import { CompanyController } from "../../src/backend/controllers/company.controller";
import { CompanyModel } from "../../src/backend/models/company.model";
import { logger } from "../../src/backend/utils/logger.utils";

afterEach(() => {
  vi.restoreAllMocks();
});

const persistedSettings = {
  company_id: "company-001",
  ssid: "Cafe Guest",
  wifi_password: "secure-pass",
  welcome_title: "Welcome",
  welcome_message: "Sign in to connect",
  brand_color: "#123abc",
};

describe("controller_company_wifi Integration Tests", () => {
  it("R1: returns a successful controller packet with WiFi settings for a valid company ID", async () => {
    const getWifiSettingsSpy = vi
      .spyOn(CompanyModel, "getWifiSettings")
      .mockResolvedValue(persistedSettings);
    vi.spyOn(logger, "info").mockImplementation(() => {});

    const response = await CompanyController.getWifiSettings("  company-001  ");

    expect(response).toEqual({
      success: true,
      status: 200,
      data: persistedSettings,
    });
    expect(getWifiSettingsSpy).toHaveBeenCalledWith("company-001");
  });

  it("R2: returns 400 when read company ID is empty or not a string", async () => {
    const getWifiSettingsSpy = vi.spyOn(CompanyModel, "getWifiSettings");

    await expect(CompanyController.getWifiSettings("   ")).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: Company ID is required",
    });
    await expect(CompanyController.getWifiSettings(123)).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: Company ID is required",
    });
    expect(getWifiSettingsSpy).not.toHaveBeenCalled();
  });

  it("R3: sanitizes valid WiFi settings and returns the persisted upsert result", async () => {
    const upsertWifiSettingsSpy = vi
      .spyOn(CompanyModel, "upsertWifiSettings")
      .mockResolvedValue(persistedSettings);

    const response = await CompanyController.upsertWifiSettings(" company-001 ", {
      ssid: "  Cafe Guest  ",
      wifi_password: "  secure-pass  ",
      welcome_title: "  Welcome  ",
      welcome_message: "  Sign in to connect  ",
      brand_color: "  #123abc  ",
    });

    expect(response).toEqual({
      success: true,
      status: 200,
      data: persistedSettings,
    });
    expect(upsertWifiSettingsSpy).toHaveBeenCalledWith({
      company_id: "company-001",
      ssid: "Cafe Guest",
      wifi_password: "secure-pass",
      welcome_title: "Welcome",
      welcome_message: "Sign in to connect",
      brand_color: "#123abc",
    });
  });

  it("R4: returns 400 when request body is missing, non-object, or SSID is empty", async () => {
    const upsertWifiSettingsSpy = vi.spyOn(CompanyModel, "upsertWifiSettings");

    await expect(CompanyController.upsertWifiSettings("company-001", null)).resolves.toEqual({
      success: false,
      status: 400,
      error: "Request body is required",
    });
    await expect(CompanyController.upsertWifiSettings("company-001", "bad-body")).resolves.toEqual({
      success: false,
      status: 400,
      error: "Request body is required",
    });
    await expect(
      CompanyController.upsertWifiSettings("company-001", {
        ssid: "   ",
        wifi_password: "secure-pass",
      })
    ).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: SSID is required",
    });
    expect(upsertWifiSettingsSpy).not.toHaveBeenCalled();
  });

  it("R5: returns 400 when WiFi password is outside security bounds", async () => {
    await expect(
      CompanyController.upsertWifiSettings("company-001", {
        ssid: "Guest",
        wifi_password: "short",
      })
    ).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: WiFi password must be between 8 and 64 characters",
    });

    await expect(
      CompanyController.upsertWifiSettings("company-001", {
        ssid: "Guest",
        wifi_password: "x".repeat(65),
      })
    ).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: WiFi password must be between 8 and 64 characters",
    });
  });

  it("R6: returns 400 when optional branding fields are invalid", async () => {
    await expect(
      CompanyController.upsertWifiSettings("company-001", {
        ssid: "Guest",
        wifi_password: "secure-pass",
        welcome_title: "",
      })
    ).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: Welcome title is invalid",
    });

    await expect(
      CompanyController.upsertWifiSettings("company-001", {
        ssid: "Guest",
        wifi_password: "secure-pass",
        welcome_message: "x".repeat(241),
      })
    ).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: Welcome message is invalid",
    });

    await expect(
      CompanyController.upsertWifiSettings("company-001", {
        ssid: "Guest",
        wifi_password: "secure-pass",
        brand_color: "123abc",
      })
    ).resolves.toEqual({
      success: false,
      status: 400,
      error: "Validation failed: Brand color is invalid",
    });
  });

  it("R7: maps model VALIDATION_ERROR to a 400 validation packet", async () => {
    vi.spyOn(CompanyModel, "upsertWifiSettings").mockRejectedValue(new Error("VALIDATION_ERROR"));
    vi.spyOn(logger, "error").mockImplementation(() => {});

    const response = await CompanyController.upsertWifiSettings("company-001", {
      ssid: "Guest",
      wifi_password: "secure-pass",
    });

    expect(response).toEqual({
      success: false,
      status: 400,
      error: "Validation failed: Company WiFi settings are invalid",
    });
  });

  it("R8: maps model DB_CONNECTION_FAILURE to a stable 500 packet", async () => {
    vi.spyOn(CompanyModel, "getWifiSettings").mockRejectedValue(new Error("DB_CONNECTION_FAILURE"));
    vi.spyOn(logger, "error").mockImplementation(() => {});

    const response = await CompanyController.getWifiSettings("company-001");

    expect(response).toEqual({
      success: false,
      status: 500,
      error: "DB_CONNECTION_FAILURE",
    });
  });

  it("R9: maps unexpected model errors to a generic 500 packet", async () => {
    vi.spyOn(CompanyModel, "getWifiSettings").mockRejectedValue(new Error("DB_QUERY_ERROR"));
    vi.spyOn(logger, "error").mockImplementation(() => {});

    const response = await CompanyController.getWifiSettings("company-001");

    expect(response).toEqual({
      success: false,
      status: 500,
      error: "Internal Server Error",
    });
  });

  it("R10: keeps controller coverage in the runner-compliant integration suite", () => {
    expect(CompanyController.getWifiSettings).toBeTypeOf("function");
    expect(CompanyController.upsertWifiSettings).toBeTypeOf("function");
  });
});
