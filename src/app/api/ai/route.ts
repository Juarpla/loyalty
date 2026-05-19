import { NextResponse } from "next/server";
import { AIController } from "@/backend/controllers/ai.controller";

/**
 * Next.js App Router API Route for AI Analytics
 * Simply triggers the isolated AIController logic.
 */
export async function GET() {
  const result = await AIController.generateInsights();
  
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 200 });
}
