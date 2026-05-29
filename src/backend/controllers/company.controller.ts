import { CompanyModel } from "../models/company.model";
import type { UpsertCompanyWifiSettingsInput } from "../types/company.type";
import { logger } from "../utils/logger.utils";

export interface CompanyControllerResponse {
  success: boolean;
  status?: number;
  data?: unknown;
  error?: string;
}

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;
const WELCOME_TITLE_MAX_LENGTH = 80;
const WELCOME_MESSAGE_MAX_LENGTH = 240;
const BRAND_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: CompanyControllerResponse };

function validationError(message: string): CompanyControllerResponse {
  return {
    success: false,
    status: 400,
    error: `Validation failed: ${message}`,
  };
}

function validateCompanyId(companyId: unknown): ValidationResult<string> {
  if (typeof companyId !== "string" || companyId.trim() === "") {
    return {
      valid: false,
      error: validationError("Company ID is required"),
    };
  }

  return {
    valid: true,
    value: companyId.trim(),
  };
}

function validateRequiredString(
  value: unknown,
  fieldName: string,
): ValidationResult<string> {
  if (typeof value !== "string" || value.trim() === "") {
    return {
      valid: false,
      error: validationError(`${fieldName} is required`),
    };
  }

  return {
    valid: true,
    value: value.trim(),
  };
}

function validateWifiPassword(value: unknown): ValidationResult<string> {
  const passwordResult = validateRequiredString(value, "WiFi password");

  if (!passwordResult.valid) {
    return passwordResult;
  }

  if (
    passwordResult.value.length < PASSWORD_MIN_LENGTH ||
    passwordResult.value.length > PASSWORD_MAX_LENGTH
  ) {
    return {
      valid: false,
      error: validationError("WiFi password must be between 8 and 64 characters"),
    };
  }

  return passwordResult;
}

function validateOptionalString(
  body: Record<string, unknown>,
  key: "welcome_title" | "welcome_message",
  fieldName: string,
  maxLength: number,
): ValidationResult<string | undefined> {
  const value = body[key];

  if (value === undefined) {
    return { valid: true, value: undefined };
  }

  if (typeof value !== "string" || value.trim() === "" || value.trim().length > maxLength) {
    return {
      valid: false,
      error: validationError(`${fieldName} is invalid`),
    };
  }

  return {
    valid: true,
    value: value.trim(),
  };
}

function validateBrandColor(body: Record<string, unknown>): ValidationResult<string | undefined> {
  const value = body.brand_color;

  if (value === undefined) {
    return { valid: true, value: undefined };
  }

  if (typeof value !== "string" || !BRAND_COLOR_PATTERN.test(value.trim())) {
    return {
      valid: false,
      error: validationError("Brand color is invalid"),
    };
  }

  return {
    valid: true,
    value: value.trim(),
  };
}

function isRequestBodyObject(requestBody: unknown): requestBody is Record<string, unknown> {
  return (
    typeof requestBody === "object" &&
    requestBody !== null &&
    !Array.isArray(requestBody)
  );
}

function buildUpsertInput(
  companyId: string,
  requestBody: unknown,
): ValidationResult<UpsertCompanyWifiSettingsInput> {
  if (!isRequestBodyObject(requestBody)) {
    return {
      valid: false,
      error: {
        success: false,
        status: 400,
        error: "Request body is required",
      },
    };
  }

  const ssidResult = validateRequiredString(requestBody.ssid, "SSID");
  if (!ssidResult.valid) {
    return ssidResult;
  }

  const passwordResult = validateWifiPassword(requestBody.wifi_password);
  if (!passwordResult.valid) {
    return passwordResult;
  }

  const welcomeTitleResult = validateOptionalString(
    requestBody,
    "welcome_title",
    "Welcome title",
    WELCOME_TITLE_MAX_LENGTH,
  );
  if (!welcomeTitleResult.valid) {
    return welcomeTitleResult;
  }

  const welcomeMessageResult = validateOptionalString(
    requestBody,
    "welcome_message",
    "Welcome message",
    WELCOME_MESSAGE_MAX_LENGTH,
  );
  if (!welcomeMessageResult.valid) {
    return welcomeMessageResult;
  }

  const brandColorResult = validateBrandColor(requestBody);
  if (!brandColorResult.valid) {
    return brandColorResult;
  }

  return {
    valid: true,
    value: {
      company_id: companyId,
      ssid: ssidResult.value,
      wifi_password: passwordResult.value,
      ...(welcomeTitleResult.value !== undefined ? { welcome_title: welcomeTitleResult.value } : {}),
      ...(welcomeMessageResult.value !== undefined ? { welcome_message: welcomeMessageResult.value } : {}),
      ...(brandColorResult.value !== undefined ? { brand_color: brandColorResult.value } : {}),
    },
  };
}

function mapControllerError(error: unknown, source: string): CompanyControllerResponse {
  const err = error as Error;
  logger.error(source, err);

  if (err.message === "VALIDATION_ERROR") {
    return validationError("Company WiFi settings are invalid");
  }

  if (err.message === "DB_CONNECTION_FAILURE") {
    return {
      success: false,
      status: 500,
      error: "DB_CONNECTION_FAILURE",
    };
  }

  return {
    success: false,
    status: 500,
    error: "Internal Server Error",
  };
}

export class CompanyController {
  static async getWifiSettings(companyId: unknown): Promise<CompanyControllerResponse> {
    logger.info("CompanyController.getWifiSettings started", { companyId });

    const companyIdResult = validateCompanyId(companyId);
    if (!companyIdResult.valid) {
      return companyIdResult.error;
    }

    try {
      const settings = await CompanyModel.getWifiSettings(companyIdResult.value);

      return {
        success: true,
        status: 200,
        data: settings,
      };
    } catch (error: unknown) {
      return mapControllerError(error, "CompanyController.getWifiSettings failed");
    }
  }

  static async upsertWifiSettings(
    companyId: unknown,
    requestBody: unknown,
  ): Promise<CompanyControllerResponse> {
    logger.info("CompanyController.upsertWifiSettings started", { companyId });

    const companyIdResult = validateCompanyId(companyId);
    if (!companyIdResult.valid) {
      return companyIdResult.error;
    }

    const inputResult = buildUpsertInput(companyIdResult.value, requestBody);
    if (!inputResult.valid) {
      return inputResult.error;
    }

    try {
      const settings = await CompanyModel.upsertWifiSettings(inputResult.value);

      return {
        success: true,
        status: 200,
        data: settings,
      };
    } catch (error: unknown) {
      return mapControllerError(error, "CompanyController.upsertWifiSettings failed");
    }
  }
}
