import { ClientModel } from "../models/client.model";
import { logger } from "../utils/logger.utils";

export type ResultObject = {
  success: boolean;
  status?: number;
  data?: unknown;
  error?: string;
  details?: unknown;
};

export async function registerPortalClient(reqBody: unknown): Promise<ResultObject> {
  try {
    if (!reqBody || typeof reqBody !== "object") {
      return {
        success: false,
        status: 400,
        error: "Request body is required",
      };
    }

    const body = reqBody as Record<string, unknown>;
    const name = body.name;
    const phone = body.phone;

    // Validate name
    if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      return {
        success: false,
        status: 400,
        error: "Validation failed: Name must be a string between 2 and 100 characters",
      };
    }

    // Validate phone
    const phoneRegex = /^\+?[\d\s-]{8,20}$/;
    if (typeof phone !== "string" || !phoneRegex.test(phone)) {
      return {
        success: false,
        status: 400,
        error: "Validation failed: Invalid phone number format",
      };
    }

    const result = await ClientModel.registerPortalLogin(phone, name);

    return {
      success: true,
      status: 200,
      data: result,
    };
  } catch (err: unknown) {
    const error = err as Error;
    logger.error("Error in registerPortalClient controller", error);
    
    if (error.message === "DB_CONNECTION_FAILURE") {
      return {
        success: false,
        status: 500,
        error: "DB_CONNECTION_FAILURE"
      };
    }

    return {
      success: false,
      status: 500,
      error: "Internal Server Error",
    };
  }
}
