import { NextResponse } from "next/server";

import { CompanyController } from "../../../../../../backend/controllers/company.controller";
import { logger } from "../../../../../../backend/utils/logger.utils";

type CompanyWifiRouteContext = {
  params: Promise<{ companyId: string }>;
};

type CompanyWifiRouteResult = {
  success: boolean;
  status?: number;
};

function getHttpStatus(result: CompanyWifiRouteResult, successStatus: number): number {
  if (result.success) {
    return result.status ?? successStatus;
  }

  return result.status ?? 500;
}

export async function GET(
  _request: Request,
  context: CompanyWifiRouteContext,
) {
  logger.info("GET /api/v1/company/[companyId]/wifi API route invoked");

  const { companyId } = await context.params;
  const result = await CompanyController.getWifiSettings(companyId);

  return NextResponse.json(result, {
    status: getHttpStatus(result, 200),
  });
}

export async function POST(
  request: Request,
  context: CompanyWifiRouteContext,
) {
  logger.info("POST /api/v1/company/[companyId]/wifi API route invoked");

  let body: unknown;
  try {
    body = await request.json();
  } catch (error: unknown) {
    logger.error("Failed to parse company WiFi settings JSON body", error);

    return NextResponse.json(
      {
        success: false,
        status: 400,
        error: "Invalid JSON payload",
      },
      { status: 400 },
    );
  }

  const { companyId } = await context.params;
  const result = await CompanyController.upsertWifiSettings(companyId, body);

  return NextResponse.json(result, {
    status: getHttpStatus(result, 200),
  });
}
