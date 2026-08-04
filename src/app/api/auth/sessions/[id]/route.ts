import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/guards";
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  await prisma.session.updateMany({
    where: { id: params.id, userId: auth.user.id, revokedAt: null },
    data: { revokedAt: new Date(), revokeReason: "USER_REVOKED_DEVICE" },
  });
  return NextResponse.json({ ok: true });
}
