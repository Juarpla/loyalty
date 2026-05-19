import { NextResponse } from "next/server";
import { TrafficController } from "@/backend/controllers/traffic.controller";

/**
 * Next.js App Router API Route for Traffic Analytics
 * Deliberately minimal. Delegates HTTP response shaping to TrafficController.
 */
export async function GET() {
  const result = await TrafficController.getTrafficOverview();
  
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 200 });
}
