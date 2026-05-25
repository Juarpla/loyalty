import { NextResponse } from "next/server";
import { SocialController } from "../../../../../backend/controllers/social.controller";
import { logger } from "../../../../../backend/utils/logger.utils";

export async function POST(request: Request) {
  try {
    const { context } = await request.json();
    logger.info("POST /api/v1/social/ideas API route invoked", { context });

    const result = await SocialController.handleSocialIdeas(context);

    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 500 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Unexpected error in POST /api/v1/social/ideas", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
