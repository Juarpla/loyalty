import { NextResponse } from "next/server";
import { SalesController } from "../../../../../backend/controllers/sales.controller";
import { logger } from "../../../../../backend/utils/logger.utils";

/**
 * Next.js App Router API Route for Sales Transaction Registration
 * Exposes: POST /api/v1/sales/record
 */
export async function POST(request: Request) {
  logger.info("POST /api/v1/sales/record API route invoked");

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

  const result = await SalesController.recordTransaction(
    body as { phone_number?: unknown; phoneNumber?: unknown; amount?: unknown }
  );

  if (!result.success) {
    return NextResponse.json(result, { status: result.status || 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
