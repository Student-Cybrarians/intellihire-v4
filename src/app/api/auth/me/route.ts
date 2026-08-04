import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
export async function GET() {
  const user = await getCurrentUser();
  return user
    ? NextResponse.json({ user })
    : NextResponse.json(
        { error: { code: "UNAUTHENTICATED", message: "Authentication is required." } },
        { status: 401 },
      );
}
