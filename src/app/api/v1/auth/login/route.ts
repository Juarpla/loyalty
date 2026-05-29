import { NextResponse } from "next/server";
import { logger } from "@/backend/utils/logger.utils";

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    if (passcode === "loyalty2026") {
      logger.info("Admin authentication successful");
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "admin_session",
        value: "authorized_admin_session",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    }

    logger.warn("Admin authentication attempt failed: invalid passcode");
    return NextResponse.json(
      { success: false, error: "INVALID_PASSCODE" },
      { status: 401 }
    );
  } catch (error: unknown) {
    logger.error("Error in administrative login API handler", error as Error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
