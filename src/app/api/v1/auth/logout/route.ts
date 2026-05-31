import { NextResponse } from "next/server";
import { adminCompanyIdCookieName } from "@/backend/utils/admin-auth.utils";
import { logger } from "@/backend/utils/logger.utils";

export async function POST() {
  try {
    logger.info("Admin logging out, clearing cookies");
    const response = NextResponse.json({ success: true });

    response.cookies.delete("admin_session");
    response.cookies.delete(adminCompanyIdCookieName);

    return response;
  } catch (error: unknown) {
    logger.error("Error in administrative logout API handler", error as Error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
