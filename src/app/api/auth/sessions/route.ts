import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/guards";
export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const sessions = await prisma.session.findMany({
    where: { userId: auth.user.id },
    select: {
      id: true,
      createdAt: true,
      lastSeenAt: true,
      expiresAt: true,
      revokedAt: true,
      userAgent: true,
      ipAddress: true,
      deviceId: true,
    },
    orderBy: { lastSeenAt: "desc" },
  });
  return NextResponse.json({ sessions });
}
