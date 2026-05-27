import { ClientModel } from "../models/client.model";
import { logger } from "../utils/logger.utils";
import { MILESTONE_THRESHOLD } from "../types/models.type";
import type { MilestoneEvaluation } from "../types/models.type";

export class MilestoneService {
  static async evaluateMilestone(clientId: string): Promise<MilestoneEvaluation> {
    logger.info("MilestoneService.evaluateMilestone invoked", { clientId });

    if (!clientId || clientId.trim() === "") {
      throw new Error("INVALID_CLIENT_ID");
    }

    const visitCount = await ClientModel.getWifiLoginCount(clientId);
    const isMilestone = visitCount === MILESTONE_THRESHOLD;

    return {
      clientId,
      visitCount,
      isMilestone,
    };
  }
}
