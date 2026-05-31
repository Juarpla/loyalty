import { NextResponse } from "next/server";

import {
  adminCompanyIdCookieName,
  authorizedAdminSession,
  createAdminCompanyId,
  demoAdminPasscode,
  matchesRegisteredAdminCredentials,
  normalizeAdminCredential,
} from "@/backend/utils/admin-auth.utils";
import { logger } from "@/backend/utils/logger.utils";

export async function POST(request: Request) {
  try {
    const { username, passcode } = await request.json();
    const normalizedUsername = normalizeAdminCredential(username);
    const normalizedPasscode = normalizeAdminCredential(passcode);

    if (
      normalizedPasscode === demoAdminPasscode ||
      matchesRegisteredAdminCredentials(
        { username: normalizedUsername, passcode: normalizedPasscode },
        request.headers.get("cookie"),
      )
    ) {
      logger.info("Admin authentication successful");
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "admin_session",
        value: authorizedAdminSession,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      response.cookies.set({
        name: adminCompanyIdCookieName,
        value: createAdminCompanyId(normalizedUsername),
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
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
