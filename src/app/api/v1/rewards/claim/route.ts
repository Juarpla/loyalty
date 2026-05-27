import { NextResponse } from "next/server";
import { MilestoneController } from "../../../../../backend/controllers/milestone.controller";
import { logger } from "../../../../../backend/utils/logger.utils";

export async function POST(request: Request) {
  logger.info("POST /api/v1/rewards/claim API route invoked");

  let body: unknown;
  try {
    body = await request.json();
  } catch (error: unknown) {
    logger.error("Failed to parse request JSON body in API route", error);
    return NextResponse.json(
      {
        success: false,
        status: 400,
        error: "Invalid JSON payload",
      },
      { status: 400 }
    );
  }

  const result = await MilestoneController.claimReward(body);

  if (!result.success) {
    return NextResponse.json(result, { status: result.status || 500 });
  }

  return NextResponse.json(result, { status: 200 });
}
