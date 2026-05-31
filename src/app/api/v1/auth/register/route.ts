import { NextResponse } from "next/server";

import {
  encodeRegisteredAdminCredentials,
  isValidRegisteredAdminCredentials,
  normalizeAdminCredential,
  registeredAdminCredentialsCookieName,
} from "@/backend/utils/admin-auth.utils";
import { logger } from "@/backend/utils/logger.utils";

export async function POST(request: Request) {
  try {
    const { username, passcode } = await request.json();
    const credentials = {
      username: normalizeAdminCredential(username),
      passcode: normalizeAdminCredential(passcode),
    };

    if (!isValidRegisteredAdminCredentials(credentials)) {
      logger.warn("Admin registration rejected: invalid credentials");
      return NextResponse.json(
        { success: false, error: "INVALID_REGISTRATION_INPUT" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: registeredAdminCredentialsCookieName,
      value: encodeRegisteredAdminCredentials(credentials),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    logger.info("Admin registration successful");
    return response;
  } catch (error: unknown) {
    logger.error("Error in administrative registration API handler", error as Error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
