import { SalesModel } from "../models/sales.model";
import { logger } from "../utils/logger.utils";

/**
 * Decoupled Sales HTTP Logic Controller
 * Totally independent of framework-specific HTTP request/response objects.
 */
export class SalesController {
  /**
   * Registers a new sales transaction after parsing, sanitizing, and validating inputs.
   */
  static async recordTransaction(body: { phone_number?: unknown; phoneNumber?: unknown; amount?: unknown }) {
    logger.info("SalesController.recordTransaction started", body);

    if (!body) {
      return {
        success: false,
        status: 400,
        error: "Request body is required"
      };
    }

    const phone = body.phone_number !== undefined ? body.phone_number : body.phoneNumber;
    const amountVal = body.amount;

    // Validate phone number presence and format
    if (phone === undefined || phone === null) {
      return {
        success: false,
        status: 400,
        error: "Phone number is required"
      };
    }

    const phoneRegex = /^(\+51\d{9}|\+(?!51)\d{7,15})$/;
    if (typeof phone !== "string" || !phoneRegex.test(phone)) {
      return {
        success: false,
        status: 400,
        error: "Invalid phone number format"
      };
    }

    // Validate amount presence and value
    if (amountVal === undefined || amountVal === null) {
      return {
        success: false,
        status: 400,
        error: "Amount is required"
      };
    }

    const amount = Number(amountVal);
    if (typeof amountVal === "boolean" || isNaN(amount) || amount <= 0) {
      return {
        success: false,
        status: 400,
        error: "Amount must be a strictly positive number"
      };
    }

    try {
      const data = await SalesModel.insertTransaction(phone, amount);
      return {
        success: true,
        data
      };
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("SalesController.recordTransaction failed", err);

      if (err.message === "DB_CONNECTION_FAILURE") {
        return {
          success: false,
          status: 500,
          error: "DB_CONNECTION_FAILURE"
        };
      }

      return {
        success: false,
        status: 500,
        error: err.message || "Failed to record sales transaction"
      };
    }
  }
}
