import { NextResponse } from 'next/server';
import { registerPortalClient } from '@/backend/controllers/portal.controller';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, status: 400, error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  const result = await registerPortalClient(body);

  if (!result.success) {
    return NextResponse.json(result, { status: result.status || 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
