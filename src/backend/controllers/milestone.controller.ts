import { MilestoneService } from "../services/milestone.service";
import { ClientModel } from "../models/client.model";
import { logger } from "../utils/logger.utils";

export interface ControllerResponse {
  success: boolean;
  status?: number;
  data?: unknown;
  error?: string;
}

export class MilestoneController {
  static async claimReward(reqBody: unknown): Promise<ControllerResponse> {
    logger.info("MilestoneController.claimReward started", reqBody);

    if (!reqBody || typeof reqBody !== "object") {
      return {
        success: false,
        status: 400,
        error: "Request body is required"
      };
    }

    const body = reqBody as Record<string, unknown>;
    const clientId = body.clientId !== undefined ? body.clientId : body.client_id;

    if (clientId === undefined || clientId === null || typeof clientId !== "string" || clientId.trim() === "") {
      return {
        success: false,
        status: 400,
        error: "Validation failed: Client ID is required"
      };
    }

    try {
      const evaluation = await MilestoneService.evaluateMilestone(clientId);

      if (!evaluation.isMilestone) {
        return {
          success: false,
          status: 400,
          error: "Validation failed: Milestone not reached"
        };
      }

      await ClientModel.resetWifiLoginCount(clientId);

      logger.info("Reward claimed successfully", {
        clientId,
        claimedAt: new Date().toISOString()
      });

      return {
        success: true,
        status: 200,
        data: {
          message: "Reward claimed successfully"
        }
      };
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("MilestoneController.claimReward failed", err);

      if (err.message === "DB_CONNECTION_FAILURE") {
        return {
          success: false,
          status: 500,
          error: "DB_CONNECTION_FAILURE"
        };
      }

      if (err.message === "INVALID_CLIENT_ID") {
        return {
          success: false,
          status: 400,
          error: "Validation failed: Client ID is required"
        };
      }

      return {
        success: false,
        status: 500,
        error: "Internal Server Error"
      };
    }
  }
}
