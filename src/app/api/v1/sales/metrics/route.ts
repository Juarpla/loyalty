import { NextResponse } from "next/server";
import { TrafficController } from "../../../../../backend/controllers/traffic.controller";
import { logger } from "../../../../../backend/utils/logger.utils";

export async function GET() {
  logger.info("GET /api/v1/sales/metrics API route invoked");

  const result = await TrafficController.getMetrics();

  if (!result.success) {
    return NextResponse.json(result, { status: result.status || 500 });
  }

  return NextResponse.json(result, { status: 200 });
}