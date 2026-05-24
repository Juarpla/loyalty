import { NextResponse } from "next/server";
import { PromotionsController } from "../../../../../backend/controllers/promotions.controller";
import { logger } from "../../../../../backend/utils/logger.utils";

export async function GET() {
  logger.info("GET /api/v1/promotions/segments API route invoked");

  try {
    const result = await PromotionsController.getSegments();

    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 500 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Unexpected error in GET /api/v1/promotions/segments", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
